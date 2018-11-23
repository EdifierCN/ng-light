import { Injectable, OnDestroy, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { CacheModel, CacheNotifyResult, CacheNotifyType, ZN_CACHE_CONFIG_TOKEN } from './interface';
import { CacheConfig } from './config';
import { StorageService, ZN_STORAGE_SERVICE_TOKEN } from '@shared/modules/store';

@Injectable()
export class CacheService implements OnDestroy {
  constructor(
    private http: HttpClient,
    @Inject(ZN_CACHE_CONFIG_TOKEN) private options: CacheConfig,
    @Inject(ZN_STORAGE_SERVICE_TOKEN) private store: StorageService,
  ) {
    this.loadMeta();
    /* 变更通知 */
    // this.startExpireNotify();
  }

  /*  内存缓存 */
  private readonly memory: Map<string, CacheModel> = new Map<string, CacheModel>();
  /* 本地缓存键 */
  private readonly _meta: Set<string> = new Set<string>();
  private readonly notifyBuffer: Map<string, BehaviorSubject<CacheNotifyResult>> = new Map<string, BehaviorSubject<CacheNotifyResult>>();
  private freq_tick = 3000;
  private freq_time: any;

  get meta() {
    return this._meta;
  }

  _deepGet(obj: any, path: string[], defaultValue?: any) {
    if (!obj) return defaultValue;
    if (path.length <= 1) {
      const checkObj = path.length ? obj[path[0]] : obj;
      return typeof checkObj === 'undefined' ? defaultValue : checkObj;
    }
    return path.reduce((o, k) => o[k], obj) || defaultValue;
  }

  private pushMeta(key: string) {
    if (this._meta.has(key)) return;
    this._meta.add(key);
    this.saveMeta();
  }

  private removeMeta(key: string) {
    if (!this._meta.has(key)) return;
    this._meta.delete(key);
    this.saveMeta();
  }

  private loadMeta() {
    const ret = this.store.get(this.options.meta_key);
    if (ret && ret['v']) {
      (ret['v'] as string[]).forEach(key => this._meta.add(key));
    }
  }

  private saveMeta() {
    const metaData: string[] = [];
    this._meta.forEach(key => metaData.push(key));
    this.store.set(this.options.meta_key, { v: metaData, e: 0 });
  }

  /*
  * 设置缓存数据
  * */
  set(
    key: string,
    data: any | Observable<any>,
    options: {
      /** 存储类型，'m' 表示内存，'s' 表示持久 */
      type?: 'm' | 's';
      /**
       * 过期时间，单位 `秒`
       */
      expire?: number;
    } = {},
  ): any {
    // expire
    let e = 0;
    if (options.expire) {
      e = Date.now() + options.expire;
    }
    if (!(data instanceof Observable)) {
      this.save(options.type, key, { v: data, e });
      return;
    }
    return data.pipe(
      tap((v: any) => {
        this.save(options.type, key, { v, e });
      }),
    );
  }

  private save(type: 'm' | 's', key: string, value: CacheModel) {
    if (type === 'm') {
      this.memory.set(key, value);
    } else {
      this.store.set(this.options.prefix + key, value);
      this.pushMeta(key);
    }
    this.runNotify(key, 'set');
  }

  /** 获取缓存数据，若 `key` 不存在则 `key` 作为HTTP请求缓存后返回 */
  /* 默认：持久化存储 */
  get(
    key: string,
    options: {
      mode?: 'promise' | 'none';
      type?: 'm' | 's';
      expire?: number;
    } = {},
  ): Observable<any> | any {
    const isPromise = options.mode !== 'none' && this.options.mode === 'promise';
    const value: any = this.memory.has(key) ? this.memory.get(key) : this.store.get(this.options.prefix + key);
    if (!value || (value.e && value.e > 0 && value.e < new Date().valueOf())) {
      if (isPromise) {
        return this.http
          .get(key)
          .pipe(
            map((ret: any) =>
              this._deepGet(ret, this.options.reName as string[], null),
            ),
            tap(v => this.set(key, v)),
          );
      }
      return null;
    }

    return isPromise ? of(value.v) : value.v;
  }

  /** 获取缓存数据，若 `key` 不存在或已过期则返回 null */
  getNone(key: string): any {
    return this.get(key, { mode: 'none' });
  }

  /** 获取缓存，若不存在则设置缓存对象 */
  tryGet(
    key: string,
    data: any | Observable<any>,
    options: {
      /** 存储类型，'m' 表示内存，'s' 表示持久 */
      type?: 'm' | 's';
      /**
       * 过期时间，单位 `秒`
       */
      expire?: number;
    } = {},
  ): any {
    const ret = this.getNone(key);
    if (ret === null) {
      if (!(data instanceof Observable)) {
        this.set(key, data, <any>options);
        return data;
      }
      return this.set(key, data as Observable<any>, <any>options);
    }
    return of(ret);
  }

  /** 是否缓存 `key` */
  has(key: string): boolean {
    return this.memory.has(key) || this._meta.has(key);
  }

  private _remove(key: string, needNotify: boolean) {
    if (needNotify) this.runNotify(key, 'remove');
    if (this.memory.has(key)) {
      this.memory.delete(key);
      return;
    }
    this.store.remove(this.options.prefix + key);
    this.removeMeta(key);
  }

  /** 移除缓存 */
  remove(key: string) {
    this._remove(key, true);
  }

  /** 清空所有缓存 */
  clear() {
    this.notifyBuffer.forEach((v, k) => this.runNotify(k, 'remove'));
    this.memory.clear();
    this._meta.forEach(key => this.store.remove(this.options.prefix + key));
  }

  /** 设置监听频率，单位：毫秒且最低 `20ms`，默认：`3000ms` */
  set freq(value: number) {
    this.freq_tick = Math.max(20, value);
    this.abortExpireNotify();
    this.startExpireNotify();
  }

  private startExpireNotify() {
    this.checkExpireNotify();
    this.runExpireNotify();
  }

  private runExpireNotify() {
    this.freq_time = setTimeout(() => {
      this.checkExpireNotify();
      this.runExpireNotify();
    }, this.freq_tick);
  }

  private checkExpireNotify() {
    const removed: string[] = [];
    this.notifyBuffer.forEach((v, key) => {
      if (this.has(key) && this.getNone(key) === null) removed.push(key);
    });
    removed.forEach(key => {
      this.runNotify(key, 'expire');
      this._remove(key, false);
    });
  }

  private abortExpireNotify() {
    clearTimeout(this.freq_time);
  }

  private runNotify(key: string, type: CacheNotifyType) {
    if (!this.notifyBuffer.has(key)) return;
    this.notifyBuffer.get(key).next({ type, value: this.getNone(key) });
  }

  /**
   * `key` 监听，当 `key` 变更、过期、移除时通知，注意以下若干细节：
   *
   * - 调用后除再次调用 `cancelNotify` 否则永远不过期
   * - 监听器每 `freq` (默认：3秒) 执行一次过期检查
   */
  notify(key: string): Observable<CacheNotifyResult> {
    if (!this.notifyBuffer.has(key)) {
      const change$ = new BehaviorSubject<CacheNotifyResult>(this.getNone(key));
      this.notifyBuffer.set(key, change$);
    }
    return this.notifyBuffer.get(key).asObservable();
  }

  /** 取消 `key` 监听 */
  cancelNotify(key: string): void {
    if (!this.notifyBuffer.has(key)) return;
    this.notifyBuffer.get(key).unsubscribe();
    this.notifyBuffer.delete(key);
  }

  /** `key` 是否已经监听 */
  hasNotify(key: string): boolean {
    return this.notifyBuffer.has(key);
  }

  /** 清空所有 `key` 的监听 */
  clearNotify(): void {
    this.notifyBuffer.forEach(v => v.unsubscribe());
    this.notifyBuffer.clear();
  }

  ngOnDestroy(): void {
    this.memory.clear();
    this.abortExpireNotify();
    this.clearNotify();
  }
}
