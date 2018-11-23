import { NgModule, ModuleWithProviders } from '@angular/core';
import { SettingService } from './setting.service';
import { ZN_SETTING_SERVICE_TOKEN, ZN_SETTING_CONFIG_TOKEN } from './interface';
import { SettingConfig } from './config';


const MyServices = [{
  provide: ZN_SETTING_CONFIG_TOKEN,
  useClass: SettingConfig
},{
  provide: ZN_SETTING_SERVICE_TOKEN,
  useClass: SettingService
}];


@NgModule()
export class SettingModule {
  static forRoot(): ModuleWithProviders{
    return {
      ngModule: SettingModule,
      providers: [
        ...MyServices
      ]
    }
  }
  static forChild(): ModuleWithProviders{
    return {
      ngModule: SettingModule
    }
  }
}
