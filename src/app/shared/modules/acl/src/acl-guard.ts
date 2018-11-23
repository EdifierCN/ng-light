import { Injectable, Inject } from '@angular/core';
import { Router, Route, CanActivate, CanActivateChild, CanLoad, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { map, tap, filter } from 'rxjs/operators';

import { ACLService } from './acl.service';
import { ACLModel, ZN_ACL_SERVICE_TOKEN, ZN_ACL_CONFIG_TOKEN } from './interface';
import { ACLConfig } from './config';
import { AuthService, ZN_AUTH_SERVICE_TOKEN, AuthConfig, ZN_AUTH_CONFIG_TOKEN } from '../../auth';

@Injectable()
export class ACLGuard implements CanActivate, CanActivateChild, CanLoad {
  constructor(
    private router: Router,
    @Inject(ZN_ACL_CONFIG_TOKEN) private options: ACLConfig,
    @Inject(ZN_ACL_SERVICE_TOKEN) private acl: ACLService,
    @Inject(ZN_AUTH_CONFIG_TOKEN) private authOpts: AuthConfig,
    @Inject(ZN_AUTH_SERVICE_TOKEN) private auth: AuthService,
  ){}

  private isLogin: boolean = false;

  private validate(guard: ACLModel | Observable<ACLModel>): Observable<boolean>{
    if(!(guard && guard instanceof Observable)){
      if(typeof guard !== 'undefined' && guard !== null){
        guard = of(guard)
      }else{
        guard = of(null)
      }
    }
    return (<Observable<ACLModel | null>>guard).pipe(
      tap(v => {
        this.isLogin = (<any>v).role.includes(this.options.member_key) && !this.auth.get();
      }),
      map(v => {
        return this.acl.has(v)
      }),
      tap(v => {
        if(this.isLogin){
          this.router.navigateByUrl(this.authOpts.login_url);
        }else{
          if(!v) this.router.navigateByUrl(this.options.guard_url);
        }
      })
    )
  }

  // 保护对特性模块的未授权加载，route 为目标url
  canLoad(route: Route): Observable<boolean>{
    return this.validate(route.data && route.data.guard || null)
  }

  // 访问授权
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>{
    // console.info('当前路由参数:', route.data);
    return this.validate(route.data && route.data.guard || null)
  }

  // 保护子路由访问授权，需要给每个子守卫
  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>{
    while (route.firstChild) route = route.firstChild;
    return this.canActivate(route, state)
  }
}
