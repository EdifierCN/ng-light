import { NgModule } from '@angular/core';
import { RouteReuseStrategy } from '@angular/router';
import { ZN_REUSE_SERVICE_TOKEN, ZN_REUSE_CONFIG_TOKEN } from './interface';
import { ReuseConfig } from './config';
import { ReuseService } from './reuse.service';
import { ReuseStrategy } from './reuse.strategy';


const MyServices = [{
  provide: ZN_REUSE_CONFIG_TOKEN,
  useClass: ReuseConfig,
},{
  provide: ZN_REUSE_SERVICE_TOKEN,
  useClass: ReuseService,
},{
  provide: RouteReuseStrategy,
  useClass: ReuseStrategy,
}];

@NgModule()
export class ReuseModule {
  static forRoot(){
    return {
      ngModule: ReuseModule,
      providers: [
        ...MyServices
      ]
    }
  }
}
