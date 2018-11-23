import { InjectionToken } from '@angular/core';

export interface CacheModel {
  v: any;
  /** 过期时间戳，`0` 表示不过期 */
  e: number;
}

export type CacheNotifyType = 'set' | 'remove' | 'expire';

export interface CacheNotifyResult {
  type?: CacheNotifyType;
  value?: any;
}

export const ZN_CACHE_SERVICE_TOKEN = new InjectionToken<CacheServiceModel>(
  'ZN_CACHE_SERVICE_TOKEN'
);
export const ZN_CACHE_CONFIG_TOKEN = new InjectionToken<CacheConfigModel>(
  'ZN_CACHE_CONFIG_TOKEN'
);

export interface CacheServiceModel {
  [key: string]: any
}
 export interface CacheConfigModel {
   [key: string]: any
 }
