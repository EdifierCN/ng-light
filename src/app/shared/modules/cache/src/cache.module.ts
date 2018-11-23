import { NgModule, ModuleWithProviders } from '@angular/core';
import { CacheService } from './cache.service';
import { CacheConfig } from './config';
import { ZN_CACHE_SERVICE_TOKEN, ZN_CACHE_CONFIG_TOKEN } from './interface';

const MyServices = [{
  provide: ZN_CACHE_CONFIG_TOKEN,
  useClass: CacheConfig
},{
  provide: ZN_CACHE_SERVICE_TOKEN,
  useClass: CacheService
}];

@NgModule()
export class CacheModule {
  static forRoot():ModuleWithProviders {
    return {
      ngModule: CacheModule,
      providers: [
        ...MyServices
      ]
    }
  }
  static forChild():ModuleWithProviders {
    return {
      ngModule: CacheModule,
    }
  }
}
