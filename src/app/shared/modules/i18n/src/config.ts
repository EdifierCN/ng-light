import { Injectable } from '@angular/core';
import { LangModel } from './interface';

@Injectable()
export class I18nConfig {
  lang: string = 'zh-CN';
  langs: LangModel[] = [{
    code: 'zh-CN',
    title: '中文',
    titleI18n: {
      'zh-CN': '中文',
      'en-US': 'chinese'
    }
  },{
    code: 'en-US',
    title: '英文',
    titleI18n: {
      'zh-CN': '英文',
      'en-US': 'english'
    }
  }];
  [key: string]: any
}
