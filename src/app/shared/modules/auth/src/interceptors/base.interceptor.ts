import { Optional, Inject } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpRequest, HttpResponse, HttpErrorResponse, HttpHandler } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Observer } from 'rxjs';
import { AuthService } from '../auth.service';
import { AuthModel } from '../interface';
import { AuthConfig } from '../config';

export abstract class BaseInterceptor implements HttpInterceptor {
  constructor(
    protected options: AuthConfig,
    protected router: Router,
    protected routeInfo: ActivatedRoute,
    protected auth: AuthService,
  ){}

  protected data: AuthModel;

  // 主要分为两种登录类型
  // 检测Token
  abstract validateAuth(options: AuthConfig): boolean;
  // 设置请求
  abstract setReq(req: HttpRequest<any>, options: AuthConfig): HttpRequest<any>;

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{
    // console.info(req.url);
    const opts = this.options;
    // 不需要 token 的地址（静态配置）
    if(opts.ignores){
      for(let val of opts.ignores){
        if(val.test(req.url)){
          return next.handle(req)
        }
      }
    }

    // 若请求中具有参该数则表示不需要token（动态设置）
    if(opts.allow_anonymous_key && req.params.has(opts.allow_anonymous_key)){
      return next.handle(req)
    }

    if(this.validateAuth(opts)){
      req = this.setReq(req, opts);
    }else{
      const snapshot = this.routeInfo.snapshot;
      // 无效，是否跳转至登录页
      // 无法通过路由判断
      if(opts.token_invalid_redirect){
        this.router.navigateByUrl(opts.login_url);
      }
      // 不再继续转发,返回一个人工响应
      return new Observable((observer: Observer<HttpEvent<any>>) => {
        const res = new HttpErrorResponse({
          status: 401,
          statusText: '令牌已失效'
        });
        observer.error(res);
      });
    }
   return next.handle(req);
  }
}
