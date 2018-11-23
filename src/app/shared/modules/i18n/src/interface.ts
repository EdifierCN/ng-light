import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';


export const ZN_I18N_CONFIG_TOKEN = new InjectionToken<I18nConfigModel>(
  'ZN_I18N_CONFIG_TOKEN',
);
export const ZN_I18N_SERVICE_TOKEN = new InjectionToken<I18nServiceModel>(
  'ZN_I18N_SERVICE_TOKEN',
);

export interface I18nConfigModel {
  [key: string]: any
}

export interface I18nServiceModel {
  readonly lang:any[];
  readonly change$: Observable<string>
  use(lang: string): void;
  translate(key: string): any;
}

export interface LangModel {
  code?: string;
  title?: string;
  titleI18n?: object
}
