import { NgModule, ModuleWithProviders } from '@angular/core';
import { ZN_SCROLL_CONFIG_TOKEN, ZN_SCROLL_SERVICE_TOKEN } from './interface';
import { ScrollConfig } from './config';
import { ScrollService } from './scroll.service';


const MyServices = [{
  provide: ZN_SCROLL_CONFIG_TOKEN,
  useClass: ScrollConfig
},{
  provide: ZN_SCROLL_SERVICE_TOKEN,
  useClass: ScrollService
}];


@NgModule()
export class ScrollModule {
  static forRoot(){
    return {
      ngModule: ScrollModule,
      providers: [
        ...MyServices
      ]
    }
  }
  static forChild(): ModuleWithProviders{
    return {
      ngModule: ScrollModule,
    }
  }
}
