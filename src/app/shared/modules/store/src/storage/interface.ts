import { InjectionToken } from '@angular/core';

export type StoreType = 'localStorage' | 'sessionStorage';

export type DateType = number | string | Date;

export const ZN_STORAGE_CONFIG_TOKEN = new InjectionToken<StorageConfigModel>(
  'ZN_STORAGE_CONFIG_TOKEN'
);
export const ZN_STORAGE_SERVICE_TOKEN = new InjectionToken<StorageServiceModel>(
  'ZN_STORAGE_SERVICE_TOKEN'
);
export const ZN_SESSION_SERVICE_TOKEN = new InjectionToken<StorageServiceModel>(
  'ZN_SESSION_SERVICE_TOKEN'
);

export interface StorageOptionModel {
  expires?:  DateType;
  force?: boolean,
}

export interface StorageConfigModel {
  storage?: StoreType;
  expires?:  DateType;
  force?: boolean,
  [key: string]: any
}

export interface StorageServiceModel{
  set(key:string, value:any, options?: StorageConfigModel):any;
  get<T>(key:string):T;
  remove(key:string):boolean;
  removeAllExpires():string[];
  add(key:string, options?:StorageConfigModel):boolean;
  update(key:string, value:any, options?:StorageConfigModel):boolean;
  touch(key:string, expires: DateType):boolean;
  clear():boolean;
}
