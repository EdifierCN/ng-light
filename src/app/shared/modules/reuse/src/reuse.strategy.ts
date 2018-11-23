import { Injectable, Inject, Injector } from '@angular/core';
import { Router, Route, RouterState, RouteReuseStrategy, ActivatedRoute, ActivatedRouteSnapshot, DetachedRouteHandle } from '@angular/router';
import { ReuseService } from './reuse.service';
import { ZN_REUSE_SERVICE_TOKEN } from './interface';

interface CacheModel {
  snapshot?: ActivatedRouteSnapshot,
  handle?: DetachedRouteHandle
}


@Injectable()
export class ReuseStrategy implements RouteReuseStrategy {
  constructor(
    private injector: Injector,
    @Inject(ZN_REUSE_SERVICE_TOKEN) private reuseService: ReuseService,
  ){}

  /* 决定是否将当前的路由进行分离并暂存。*/
  /* 直接返回 true 表示对所有路由允许复用 */
  public shouldDetach(route: ActivatedRouteSnapshot): boolean{
    return this.reuseService.shouldDetach(route);
  }

  /* 存储分离出的路由*/
  /* 当路由离开时会触发。按path作为key存储路由快照&组件当前实例对象；path等同RouterModule.forRoot中的配置 */
  public store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle){
    this.reuseService.store(route, handle);
  }

  /* 决定当前的路由是否还原*/
  /* 若 path 在缓存中有的都认为允许还原路由 */
  public shouldAttach(route: ActivatedRouteSnapshot): boolean{
    if(!route.routeConfig || route.routeConfig.path.trim() === ''){
      return false
    }
    return this.reuseService.shouldAttach(route);
  }

  /* 取得之前暂存的路由*/
  /* 从缓存中获取快照，若无则返回null */
  public retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle{
    if (!route.routeConfig) return null;
    return this.reuseService.retrieve(route)
  }

  /* 决定是否重用路由*/
  /* 进入路由触发，判断是否同一路由 */
  public shouldReuseRoute(from: ActivatedRouteSnapshot, to: ActivatedRouteSnapshot): boolean{
    return this.reuseService.shouldReuseRoute(from, to)
  }
}
