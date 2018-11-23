import { Injectable, Inject } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpHeaders, HttpEvent, HttpResponse } from '@angular/common/http';
import { of, Observable } from 'rxjs';
import { tap, startWith } from 'rxjs/operators';


interface CacheInterFace {
  /* 操作：增、删、改（已存在才更新）、查 */
  add(req: HttpRequest<any>, event: HttpEvent<any>): CacheInterFace;
  remove(req: HttpRequest<any>): boolean;
  update(req: HttpRequest<any>, event: HttpEvent<any>): boolean;
  get(req: HttpRequest<any>): any;
  has(req: HttpRequest<any>): boolean;
  forEach(fn: {(v, k):void}): void;
}

/*
* 内存缓存
* */
class Cache implements CacheInterFace{
  /* 不能直接把req作为键，因为每次都是新的实例 */
  private _data: Map<string, any> = new Map<string, any>();

  get data(){
    return this._data
  }

  static getUrlWithParams(req: HttpRequest<any>){
    return req.urlWithParams
  }

  /*
  * 有则更新，无则添加
  * */
  add(req: HttpRequest<any>, event: HttpEvent<any>): Cache{
    const url = Cache.getUrlWithParams(req);
    this._data.set(url, event);
    return this
  }

  /*
   * 删除
   * */
  remove(req: HttpRequest<any>): boolean{
    const url = Cache.getUrlWithParams(req);
    return this._data.delete(url);
  }

  /*
  * 有则更新
  * */
  update(req: HttpRequest<any>, event: HttpEvent<any>): boolean{
    const url = Cache.getUrlWithParams(req);
    if(this._data.has(url)){
      this._data.set(url, event);
      return true;
    }
    return false
  }

  /*
  * 获取
  * */
  get(req: HttpRequest<any>): any{
    const url = Cache.getUrlWithParams(req);
    return this._data.get(url)
  }

  /*
  * 有无
  * */
  has(req: HttpRequest<any>): boolean{
    const url = Cache.getUrlWithParams(req);
    return this._data.has(url)
  }

  /*
  * 清空
  * */
  clear(): void{
    this._data.clear()
  }

  /*
  * 遍历
  * */
  forEach(fn: {(v, k):void}){
    const entries:any = this._data.entries();
    for(let item of entries){
      fn(item[1], item[0])
    }
  }
}


@Injectable()
export class CachingInterceptor implements HttpInterceptor {
  private _cache: any = new Cache();

  /*
  * 提交至下一个拦截器，并缓存响应
  * */
  private sendRequest(req: HttpRequest<any>, next: HttpHandler, cache: any): Observable<HttpEvent<any>> {
    // const noHeaderReq = req.clone({ headers: new HttpHeaders() });
    return next.handle(req).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          this._cache.add(req, event); // Add the cache.
        }
      })
    );
  }

  intercept(req: HttpRequest<any>, next: HttpHandler){
    if(!req.headers.get('x-cache')) next.handle(req);
    const cachedResponse = this._cache.get(req);   // Get the cache

    // cache-then-refresh
    if (req.headers.get('x-refresh')) {
      const results$ = this.sendRequest(req, next, this._cache);
      return cachedResponse ?
        results$.pipe( startWith(cachedResponse) ) :
        results$;
    }

    // cache-or-fetch
    return cachedResponse ?
      of(cachedResponse) :
      this.sendRequest(req, next, this._cache);
  }
}
