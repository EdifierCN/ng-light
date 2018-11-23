import { Injectable } from '@angular/core';

@Injectable()
export class TitleConfig {
  selector?: string = '.zn-app-title';
  title?: string = 'Angular';
  titleI18n?: object = {
    'zh-CN': 'Angular',
    'en-US': 'Angular'
  };
  separator?: string = '-';
  prefix?: string = 'Angular';
  prefixI18n?: object = {
    'zh-CN': 'Angular',
    'en-US': 'Angular'
  };
  suffix?: string = '';
  suffixI18n?: object = {
    'zh-CN': '',
    'en-US': ''
  };
}
