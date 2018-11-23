import { Injectable } from '@angular/core';
import { App, Layout, User } from './interface';

@Injectable()
export class SettingConfig {
  store_key?= 'zn_setting';
  lang_key?= 'zn_language';
  app?: App = {};
  layout?: Layout = {
    fixed: true,
    collapsed: false,
    lang: 'zh-CN',
    theme: 'default'
  };
  user?: User = {};
}


export const LANG_KEY = 'zn_language';
