import { NgModule, ModuleWithProviders } from '@angular/core';
import { I18nService } from './i18n.service';
import { ZN_I18N_SERVICE_TOKEN, ZN_I18N_CONFIG_TOKEN } from './interface';
import { I18nConfig } from './config';


const MyServices = [{
  provide: ZN_I18N_CONFIG_TOKEN,
  useClass: I18nConfig
},{
  provide: ZN_I18N_SERVICE_TOKEN,
  useClass: I18nService
}];


@NgModule()
export class I18nModule{
  static forRoot(): ModuleWithProviders{
    return {
      ngModule: I18nModule,
      providers: [
        ...MyServices
      ]
    }
  }
  static forChild(): ModuleWithProviders{
    return {
      ngModule: I18nModule
    }
  }
}
