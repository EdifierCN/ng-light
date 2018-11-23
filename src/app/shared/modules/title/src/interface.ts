import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export interface TitleModel {
  separator: string;
  title: string;
  prefix: string;
  suffix: string;
  [key: string]: any;
}

export const ZN_TITLE_SERVICE_TOKEN = new InjectionToken<TitleServiceModel>(
  'ZN_TITLE_SERVICE_TOKEN'
);
export const ZN_TITLE_CONFIG_TOKEN = new InjectionToken<TitleConfigModel>(
  'ZN_TITLE_CONFIG_TOKEN'
);

export interface TitleConfigModel {
  [key: string]: any
}
export interface TitleServiceModel {
  readonly data: TitleModel;
  readonly change$: Observable<TitleModel>;

  setTitle(value?: string | string[]):void;
}
