import { NgModule, ModuleWithProviders } from '@angular/core';
import { ZN_TITLE_SERVICE_TOKEN, ZN_TITLE_CONFIG_TOKEN } from './interface';
import { TitleService } from './title.service';
import { TitleConfig } from './config';


const MyServices = [{
  provide: ZN_TITLE_CONFIG_TOKEN,
  useClass: TitleConfig
},{
  provide: ZN_TITLE_SERVICE_TOKEN,
  useClass: TitleService
}];


@NgModule()
export class TitleModule {
  static forRoot(): ModuleWithProviders{
    return {
      ngModule: TitleModule,
      providers: [
        ...MyServices
      ]
    }
  }
  static forChild(): ModuleWithProviders{
    return {
      ngModule: TitleModule,
    }
  }
}
