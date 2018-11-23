import { Injectable, Inject, Injector } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ActivatedRouteSnapshot, Router, DetachedRouteHandle } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { share, filter } from 'rxjs/operators';
import { ReuseConfig } from './config';
import { ReuseMatchModel, ReuseModel, ReuseClosableCacheModel, ZN_REUSE_CONFIG_TOKEN } from './interface';
import { MenuService, ZN_MENU_SERVICE_TOKEN } from '@shared/modules/menu';
import { ScrollService, ZN_SCROLL_SERVICE_TOKEN } from '@shared/modules/scroll';

/* 相关：
    https://blog.csdn.net/ijiahong/article/details/81279236
    https://github.com/angular/angular/issues/13869#issuecomment-344403045
    */

@Injectable()
export class ReuseService {
  constructor(
    private injector: Injector,
    @Inject(DOCUMENT) private doc: any,
    @Inject(ZN_REUSE_CONFIG_TOKEN) private options: ReuseConfig,
    @Inject(ZN_MENU_SERVICE_TOKEN) private menuService: MenuService,
    @Inject(ZN_SCROLL_SERVICE_TOKEN) private scrollService: ScrollService,
  ){}

  private _max: number = this.options.max;
  private _mode: ReuseMatchModel = 'URL';
  private _cached: ReuseModel[] = [];
  private _closableCached: ReuseClosableCacheModel = {};  // 缓存动态修改的 closable 属性的列表
  private _change$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private _closeBuffer: string;    // 阻止当前关闭的选项卡缓存

  get mode(){
    return this._mode
  }
  get cached(): ReuseModel[]{
    return this._cached
  }
  get change$(){
    return this._change$.asObservable()
  }

  private isExists(url: string): ReuseModel{
    return this.cached.find(v => v.url === url)
  }

  private getTruthSnapshot(snapshot: ActivatedRouteSnapshot){
    while(snapshot.firstChild) snapshot = snapshot.firstChild;
    return snapshot
  }

  /* 注意；惰性模块 snapshot 的 url 不含模块路径,需补全 */
  public getUrl(snapshot: ActivatedRouteSnapshot): string{
    let next = this.getTruthSnapshot(snapshot);
    const urls = [];
    while (next) {
      urls.push(next.url.join('/'));
      next = next.parent;
    }
    return '/' + urls.filter(i => i).reverse().join('/');
  }

  public getMenu(url: string){
    const menus = this.menuService.getMenuByUrl(url);
    return (menus && menus.length > 0) ? menus.pop() : null;
  }

  public getTitle(snapshot: ActivatedRouteSnapshot, menu: any){
    snapshot = this.getTruthSnapshot(snapshot);
    return {
      title: snapshot.data.title || menu.title,
      titleI18n: snapshot.data.titleI18n || menu.titleI18n
    }
  }

  /*  获取 closable 属性：closableCached => 路由参数 => 菜单数据 => true */
  public getClosable(url: string, snapshot?: ActivatedRouteSnapshot){
    if(this._closableCached.hasOwnProperty(url)){
      return this._closableCached[url]
    }
    if(snapshot && snapshot.data && typeof snapshot.data.closable === 'boolean'){
      return snapshot.data.closable
    }
    const menu = this._mode === 'MENU' ? this.getMenu(url) : null;
    if(menu && typeof menu.closable === 'boolean'){
      return menu.closable
    }
    return true;
  }

  private normalize(snapshot: ActivatedRouteSnapshot, handle: DetachedRouteHandle){
    const url = this.getUrl(snapshot);
    const menu = this.getMenu(url);
    const closable = this.getClosable(url, snapshot);
    const titleObj = this.getTitle(snapshot, menu);
    return {
      url,
      menu,
      closable,
      snapshot,
      handle,
      ...titleObj
    } as ReuseModel;
  }

  private set(value: ReuseModel | ReuseModel[]){
    if(!Array.isArray(value)){
      value = [value]
    }
    this._cached = [];
    (<ReuseModel[]>value).forEach((v) => {
      this.add(v.snapshot, v.handle)
    });
  }

  private add(snapshot: ActivatedRouteSnapshot, handle: DetachedRouteHandle){
    if(this._cached.length >= this._max) this._cached.shift();
    const item = this.normalize(snapshot, handle);
    let existed = this.isExists(item.url);
    if(existed){
      existed = item;
    }else{
      this._cached.push(item)
    }
  }

  private remove(url: string, force: boolean = false){
    if(!this.isExists(url)){
      return;
    }
    this._cached = this._cached.filter(v => {
      if(v.url === url && (force || v.closable)) this.destroy(v.handle);
      return force ? v.url !== url : v.closable && v.url !== url
    });
  }

  private destroy(handle: any){
    if (handle && handle.componentRef && handle.componentRef.destroy)
      handle.componentRef.destroy();
  }

  /* 保存 */
  save(snapshot: ActivatedRouteSnapshot, handle: DetachedRouteHandle){
    this.add(snapshot, handle);
    this._closeBuffer = null;
    this._change$.next({ type: 'save', payload: { cached: this._cached } })
  }

  /* 读取 */
  get(url: string){
    return url ? this._cached.filter(v => v.url === url)[0] || null : null;
  }

  /* 移动 */
  move(url: string, end: number){
    const start = this._cached.findIndex(v => v.url === url);
    if(start === -1) return;
    const cached = this.cached.slice();
    cached.splice(
      end < 0 ? cached.length + end : end,
      0,
      cached.splice(start, 1)[0]
    );
    this._cached = cached;
    this._change$.next({ type: 'move', payload: { cached } });
  }

  /* 关闭 */
  close(url: string, force: boolean = false){
    this.remove(url, force);
    this._closeBuffer = url;
    this._change$.next({ type: 'close', payload: { url, cached: this._cached } })
  }

  /* 清空 */
  clear(force: boolean = false){
    this._cached.forEach(v => (force || v.closable) && this.destroy(v._handle));
    this._cached = force ? [] : this._cached.filter(v => !v.closable);
    this._closeBuffer = null;
    this._change$.next({ type: 'clear', payload: { cached: this._cached } })
  }

  /* 替换并跳转至新页 */
  replace(url: string){
    if(this.isExists(url)){
      this.remove(url, true)
    }else{
      this._closeBuffer = url;
    }
    this.injector.get(Router).navigateByUrl(url)
  }

  /*  清空 _closableCached */
  clearClosableCached(){
    this._closableCached = {};
  }

  /*  动态设置 closable 属性 */
  setClosable(url: string, value: boolean){
    this._closableCached[url] = value;
    this._change$.next({ type: 'change', payload: { cached: this._cached } })
  }

  /* 额外定义路由复用钩子 */
  private runHook(method: string, component: any){
    const instance = component.instance;
    if(instance && typeof instance[method] == 'function')
      instance[method]()
  }

  /* 注意：必须判断，否则 tab/1 切换至 tab/2（空组件路由分组） 会出错 */
  private hasInValidRoute(snapshot: ActivatedRouteSnapshot) {
    return (
      !snapshot.routeConfig ||
      snapshot.routeConfig.loadChildren ||
      snapshot.routeConfig.children
    );
  }

  // private shouldReuse(snapshot: ActivatedRouteSnapshot): boolean{
  //   const routeInfo = this.getTruthSnapshot(snapshot);
  //   const url = this.getUrl(snapshot);
  //   const menu = this.getMenu(url);
  //   if(routeInfo.data && typeof routeInfo.data.reuse === "boolean"){
  //     return snapshot.data.reuse
  //   }
  //   if(menu && typeof menu.reuse !== 'undefined' && typeof menu.reuse === "boolean"){
  //     return menu.reuse
  //   }
  // }

  // private _fromRoute: ActivatedRouteSnapshot;
  // private _toRoute: ActivatedRouteSnapshot;
  // private _isBack: boolean;

  // private get _isOneLevelTab(){
  //   return this._fromRoute.data.scroll && this._toRoute.data.scroll && this._fromRoute.data.scroll.zIndex === this._toRoute.data.scroll.zIndex
  // }

  /*  路由复用策略 */
  /* 默认：复用 */
  /* 注意：所有snapshot 使用firstChild*/
  shouldDetach(snapshot: ActivatedRouteSnapshot): boolean{
    // console.info('shouldDetach');
    if (this.hasInValidRoute(snapshot)) return false;
    snapshot = this.getTruthSnapshot(snapshot);
    const url = this.getUrl(snapshot);

    // 阻止当前关闭的选项卡缓存
    if(this._closeBuffer === url) return false;

    if(snapshot.data && typeof snapshot.data.reuse === "boolean"){
      return snapshot.data.reuse
    }
    const menu = this.getMenu(url);
    if(menu && typeof menu.reuse !== 'undefined' && typeof menu.reuse === "boolean"){
      return menu.reuse
    }
    return !this.options.excludes.some(v => v.test(url));
  }

  store(snapshot: ActivatedRouteSnapshot, handle: any){
    // console.info('store');
    snapshot = this.getTruthSnapshot(snapshot);
    if(handle && handle.componentRef){
      // const url = this.getUrl(snapshot);
      // if(this._isOneLevelTab){
      //   this.scrollService.savePosition(url);
      // }else{
      //   !this._isBack && this.scrollService.savePosition(url);
      // }
      this.save(snapshot, handle);
      this.runHook('_onReuseDestroy', handle.componentRef)
    }
  }

  shouldAttach(snapshot: ActivatedRouteSnapshot): boolean{
    // console.info('shouldAttach');
    if (this.hasInValidRoute(snapshot)) return false;
    snapshot = this.getTruthSnapshot(snapshot);
    const url = this.getUrl(snapshot);
    const cache = this.get(url);
    const ret = !!(cache && cache.handle);
    if(ret && cache.handle.componentRef){
      this.runHook('_onReuseInit', cache.handle.componentRef)
    }
    return ret
  }

  retrieve(snapshot: ActivatedRouteSnapshot){
    // console.info('retrieve');
    if (this.hasInValidRoute(snapshot)) return false;
    snapshot = this.getTruthSnapshot(snapshot);
    const url = this.getUrl(snapshot);
    const cache = this.get(url);
    return (cache && cache.handle) || null;
  }

  shouldReuseRoute(from: ActivatedRouteSnapshot, to: ActivatedRouteSnapshot){
    // console.info('shouldReuseRoute');
    // if(to.routeConfig && to.routeConfig.path.trim() !== ''){
    //   this._fromRoute = this.getTruthSnapshot(from);
    //   this._toRoute = this.getTruthSnapshot(to);
    //   const fromUrl = this.getUrl(from);
    //   const toUrl = this.getUrl(to);
    //
    //   const savedPosition = this.scrollService.getPosition(toUrl);
    //   if(typeof savedPosition == "number"){
    //     this._isBack = true;
    //     // console.info('后退');
    //     if(this._isOneLevelTab){   // 通过 level 标记是否是 Tab页，且划分不同层级
    //       if(this._toRoute.data.scroll.restore){
    //         this.scrollService.attachPosition(toUrl);  // Tab页还原位置
    //       }else{
    //         this.scrollService.scrollTop();   // Tab页滚动顶部
    //       }
    //     }else{
    //       this.scrollService.removePosition(fromUrl);
    //       this.scrollService.attachPosition(toUrl);
    //     }
    //   }else{
    //     this._isBack = false;
    //     // console.info('前进');
    //     this.scrollService.scrollTop();
    //   }
    // }

    let ret = from.routeConfig === to.routeConfig;
    if (!ret) return false;
    const path = ((from.routeConfig && from.routeConfig.path) || '') as string;
    if (path.trim() !== '' && path.indexOf(':') !== -1) {
      const fromUrl = this.getUrl(from);
      const toUrl = this.getUrl(to);
      ret = fromUrl === toUrl;
    }
    return ret
  }
}
