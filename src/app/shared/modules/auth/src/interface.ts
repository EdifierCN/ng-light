import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export const ZN_AUTH_SERVICE_TOKEN = new InjectionToken<AuthServiceModel>('ZN_AUTH_SERVICE_TOKEN');
export const ZN_AUTH_CONFIG_TOKEN = new InjectionToken<AuthConfigModel>('ZN_AUTH_CONFIG_TOKEN');
export const ZN_SOCIAL_SERVICE_TOKEN = new InjectionToken<SocialServiceModel>('ZN_SOCIAL_SERVICE_TOKEN');
export const ZN_SOCIAL_CONFIG_TOKEN = new InjectionToken<SocialConfigModel>('ZN_SOCIAL_CONFIG_TOKEN');

export interface AuthModel {
  token: string;
  [key: string]: any;
}
export interface SocialConfigModel {
  [key: string]: any
}
export interface AuthConfigModel {
  [key: string]: any
}
export interface SocialServiceModel {
  [key: string]: any
}
export interface AuthServiceModel {
  readonly redirect: string;
  readonly login_url: string;
  readonly change$: Observable<AuthModel>

  setRedirect(value: string):void;
  set(value: AuthModel): void;
  get<T extends AuthModel>(type?: any): T;
  clear(): void;
}

// 第三方登录
export type SocialOpenType = 'href' | 'window';
