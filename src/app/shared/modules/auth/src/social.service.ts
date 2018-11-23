import { Injectable, Inject, Injector, OnDestroy } from  '@angular/core';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { Observable, BehaviorSubject, Observer } from 'rxjs';
import { share } from 'rxjs/operators';
import { AuthService } from "./auth.service";
import { ZN_AUTH_SERVICE_TOKEN, ZN_SOCIAL_CONFIG_TOKEN, AuthModel } from './interface';
import { SocialConfig } from './config';

@Injectable()
export class SocialService {
  constructor(
    private router: Router,
    private injector: Injector,
    @Inject(DOCUMENT) private doc: any,
    @Inject(ZN_SOCIAL_CONFIG_TOKEN) private options: SocialConfig,
    @Inject(ZN_AUTH_SERVICE_TOKEN) private auth: AuthService,
  ){}

  private _win: Window;
  private _interval: any;
  private _change$: BehaviorSubject<AuthModel> = new BehaviorSubject<AuthModel>(null);
  private _options: SocialConfig = this.options;

  get currentOptions(){
    return this._options;
  }
  get change$(){
    return this._change$.asObservable().pipe(share())
  }

  login( url: string, options: SocialConfig ){
    this._options = Object.assign({}, this.options, options);
    this.doc.location.href = url;
  }

  callback(rawData?: string | AuthModel): AuthModel | null{
    let data: any;
    const opts = this._options;

    if (typeof rawData === 'string') {
      const paramsFrag = rawData.indexOf('?') !== -1 ? rawData.split('?')[1] : rawData;
      data = <any>this.router.parseUrl('./?' + paramsFrag).queryParams;
    } else {
      data = rawData;
    }

    console.info('第三方授权：', data);

    if (!data || (!data.token && !data.access_token) || data.error){
      console.error(data.error);
      return null;
    }
    data = {
      token: data.token || data.access_token,
      ...data
    };

    this.auth.set(data);
    return data;
  }
}
