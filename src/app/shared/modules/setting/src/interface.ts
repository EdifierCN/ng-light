import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export interface App {
  name?: string;
  description?: string;
  date?: number|string;
  version?: string;
  [key: string]: any;
}

export interface User {
  name?: string;
  avatar?: string;
  email?: string;
  [key: string]: any;
}

export interface Layout {
  /** 是否固定顶部菜单 */
  fixed?: boolean;
  /** 是否折叠右边菜单 */
  collapsed?: boolean;
  /** 语言环境 */
  lang?: string;
  /** 当前主题 */
  theme?: string;
  [key: string]: any;
}

export interface SettingModel {
  app?: App;
  layout?: Layout;
  user?: User;
  [key: string]: any;
}

export type SettingStoreType = App | User | Layout;


export const ZN_SETTING_SERVICE_TOKEN = new InjectionToken<SettingServiceModel>(
  'ZN_SETTING_SERVICE_TOKEN'
);
export const ZN_SETTING_CONFIG_TOKEN = new InjectionToken<SettingConfigModel>(
  'ZN_SETTING_CONFIG_TOKEN'
);

export interface SettingConfigModel {
  [key: string]: any
}
export interface SettingServiceModel {
  readonly setting:SettingModel;
  readonly app: App;
  readonly layout: Layout;
  readonly user: User;
  readonly change$: Observable<SettingModel>;

  set(value: SettingModel): void;
  setApp(value: App): void;
  setLayout(value: Layout): void;
  setUser(value: User): void;
}
