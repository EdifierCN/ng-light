import { NgModule, ModuleWithProviders } from '@angular/core';
import { MenuService } from './menu.service';
import { MenuConfig } from './config';
import { ZN_MENU_SERVICE_TOKEN, ZN_MENU_CONFIG_TOKEN } from './interface';


const MyServices = [{
  provide: ZN_MENU_CONFIG_TOKEN,
  useClass: MenuConfig
},{
  provide: ZN_MENU_SERVICE_TOKEN,
  useClass: MenuService
}];


@NgModule()
export class MenuModule {
  static forRoot(): ModuleWithProviders{
    return {
      ngModule: MenuModule,
      providers: [
        ...MyServices
      ]
    }
  }
  static forChild(): ModuleWithProviders{
    return {
      ngModule: MenuModule
    }
  }
}
