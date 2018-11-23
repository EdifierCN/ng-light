import { NgModule, ModuleWithProviders } from '@angular/core';

import { ZN_COOKIE_CONFIG_TOKEN, ZN_COOKIE_SERVICE_TOKEN } from './cookie/interface';
import { CookieService } from './cookie/cookie.service';
import { CookieConfig } from './cookie/config';

import { ZN_STORAGE_CONFIG_TOKEN, ZN_STORAGE_SERVICE_TOKEN } from './storage/interface';
import { StorageService } from './storage/storage.service';
import { StorageConfig } from './storage/config';

import { ZN_SESSION_SERVICE_TOKEN } from './storage/interface';
import { SessionStorageFactory } from './storage/storage.service';


const MyServices = [{
  provide: ZN_COOKIE_CONFIG_TOKEN,
  useClass: CookieConfig
},{
  provide: ZN_COOKIE_SERVICE_TOKEN,
  useClass: CookieService
},{
  provide: ZN_STORAGE_CONFIG_TOKEN,
  useClass: StorageConfig
},{
  provide: ZN_STORAGE_SERVICE_TOKEN,
  useClass: StorageService
},{
  provide: ZN_SESSION_SERVICE_TOKEN,
  useFactory: SessionStorageFactory
}];


@NgModule()
export class StorageModule {
  static forRoot(): ModuleWithProviders{
    return {
      ngModule: StorageModule,
      providers: [
        ...MyServices
      ]
    }
  }
  static forChild(): ModuleWithProviders{
    return {
      ngModule: StorageModule,
    }
  }
}
