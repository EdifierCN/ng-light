import { Injectable, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpEvent, HttpInterceptor, HttpRequest, HttpResponse, HttpErrorResponse, HttpHandler } from '@angular/common/http';
import { BaseInterceptor } from './base.interceptor';
import { AuthService } from '../auth.service';
import { AuthConfig } from '../config';
import { AuthModel, ZN_AUTH_SERVICE_TOKEN } from '../interface';
import { Base64 } from 'js-base64';

@Injectable()
export class JWTInterceptor extends BaseInterceptor {
  constructor(
    protected options: AuthConfig,
    protected router: Router,
    protected routeInfo: ActivatedRoute,
    @Inject(ZN_AUTH_SERVICE_TOKEN) protected auth: AuthService,
  ){
    super(options, router, routeInfo, auth)
  }

  get payload(){
    const token = this.data.token;
    let payload = {};
    try{
      payload = JSON.parse(Base64.atob(token.split('.')[1]));
    }catch(e){
     throw new Error('缺少必要信息！')
    }
    return payload;
  }

  private isExpired(){
    const offsetSeconds = this.options.token_exp_offset || 0;
    const payload = this.payload;
    if(!payload.hasOwnProperty('exp')) return null;
    const date = new Date(0);
    date.setUTCSeconds(payload['exp']);
    return date.valueOf() > Date.now() + offsetSeconds + 1000;
  }

  validateAuth(options: AuthConfig){
    this.data = this.auth.get();
    return this.data && this.data.token && this.isExpired()
  }

  setReq(req: HttpRequest<any>, options: AuthConfig): HttpRequest<any>{
    return req.clone({
      setHeaders: {
        Authorization: `${this.data.token}`,
      },
    });
  }
}
