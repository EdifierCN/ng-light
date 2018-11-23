import { Injectable, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpRequest } from '@angular/common/http';
import { BaseInterceptor } from './base.interceptor';
import { AuthService } from '../auth.service';
import { AuthConfig } from '../config';
import { ZN_AUTH_SERVICE_TOKEN, ZN_AUTH_CONFIG_TOKEN } from '../interface';

@Injectable()
export class PrimaryInterceptor extends BaseInterceptor{
  constructor(
    protected router: Router,
    protected routeInfo: ActivatedRoute,
    @Inject(ZN_AUTH_CONFIG_TOKEN) protected options: AuthConfig,
    @Inject(ZN_AUTH_SERVICE_TOKEN) protected auth: AuthService,
  ){
    super(options, router, routeInfo, auth);
  }

  validateAuth(options: AuthConfig){
    this.data = this.auth.get();
    return this.data && this.data.token && this.data.token.trim() !== ''
  }

  setReq(req: HttpRequest<any>, options: AuthConfig): HttpRequest<any>{
    const token = options.token_send_template.replace(
      /\$\{([\w]+?)\}/g,
      (match: string, $1: string) => this.data[$1],
    );
    switch (options.token_send_place) {
      case 'header':
        const obj = {};
        obj[options.token_send_key] = token;
        req = req.clone({
          setHeaders: obj,
        });
        break;
      case 'body':
        const body = req.body || {};
        body[options.token_send_key] = token;
        req = req.clone({
          body: body,
        });
        break;
      case 'url':
        req = req.clone({
          params: req.params.append(options.token_send_key, token),
        });
        break;
    }
    return req
  }
}
