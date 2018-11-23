import { InjectionToken } from '@angular/core';

export interface CookieOptionsModel {
  expires: number | string | Date;
  domain?: string;
  path?: string;
  raw?: boolean;
  secure?: boolean;
}

export const PREFIX:string = 'd';

export const ZN_COOKIE_SERVICE_TOKEN = new InjectionToken<CookieServiceModel>(
  'ZN_COOKIE_SERVICE_TOKEN'
);
export const ZN_COOKIE_CONFIG_TOKEN = new InjectionToken<CookieConfigModel>(
  'ZN_COOKIE_CONFIG_TOKEN'
);

export interface CookieServiceModel {
  [key: string]: any
}
export interface CookieConfigModel {
  [key: string]: any
}

export const CacheApi = {
  set(){},
  get(){},
  remove(){},
  clear(){}
};
