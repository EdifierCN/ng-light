import { InjectionToken } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';

export const ZN_REUSE_SERVICE_TOKEN = new InjectionToken('ZN_REUSE_SERVICE_TOKEN');
export const ZN_REUSE_CONFIG_TOKEN = new InjectionToken('ZN_REUSE_CONFIG_TOKEN');

export type ReuseMatchModel = 'URL'| 'MENU';

export interface ReuseModel {
  url?: string;
  snapshot?: ActivatedRouteSnapshot;
  handle?: any;
  closable?: boolean;
  [key: string]: any;
}


export interface ReuseClosableCacheModel {
  [url: string]: boolean,
}
