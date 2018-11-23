import { Injectable, Inject } from '@angular/core';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { share } from 'rxjs/operators';
import { App, Layout, User, SettingModel, ZN_SETTING_CONFIG_TOKEN } from './interface';
import { SettingConfig } from './config';
import { StorageService, ZN_STORAGE_SERVICE_TOKEN } from '@shared/modules/store';

@Injectable()
export class SettingService {
  constructor(
    @Inject(ZN_SETTING_CONFIG_TOKEN) private options: SettingConfig,
    @Inject(ZN_STORAGE_SERVICE_TOKEN) private store: StorageService,
  ){}

  private _data: SettingModel = null;
  private _change$: BehaviorSubject<SettingModel|null> = new BehaviorSubject<SettingModel|null>(null);

  get data(): SettingModel{
    const opts = this.options;
    if(!this._data){
      const setting = {
        app: opts.app,
        layout: opts.layout,
        user: opts.user,
      };
      this._data = this.store.get(opts.store_key) || (this._set(setting), setting);
    }
    return this._data;
  }
  get app(): App {
    return this.data.app;
  }
  get layout(): Layout {
    return this.data.layout;
  }
  get user(): User {
    return this.data.user;
  }
  get change$(): Observable<SettingModel>{
    return this._change$.asObservable().pipe(share())
  }

  private _set(value: SettingModel){
    this._data = value;
    this.store.set(this.options.lang_key, value.layout.lang);  // 多存储一个语言，用于应用初始配置
    this.store.set(this.options.store_key, value);
    this._change$.next(this._data);
  }
  setApp(value: App){
    this._set(Object.assign(
      {},
      this.data,
      {app: Object.assign({}, this._data.app, value)}
      ));
  }
  setLayout(value: Layout){
    this._set(Object.assign(
      {},
      this.data,
      {layout: Object.assign({}, this._data.layout, value)}
    ));
  }
  setUser(value: User){
    this._set(Object.assign(
      {},
      this.data,
      {user: Object.assign({}, this._data.user, value)}
    ));
  }
}
