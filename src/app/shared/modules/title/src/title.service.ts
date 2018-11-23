import { Injectable, Inject, Injector } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { share, filter } from 'rxjs/operators';
import { TitleServiceModel, TitleModel, ZN_TITLE_CONFIG_TOKEN } from './interface';
import { TitleConfig } from './config';
import { I18nService, ZN_I18N_SERVICE_TOKEN } from '@shared/modules/i18n';
import { MenuService, ZN_MENU_SERVICE_TOKEN } from '@shared/modules/menu';

/* 注意：不要在 构造函数 中 执行第一次setTitle，u由于路由和异步加载翻译文件 */

@Injectable()
export class TitleService implements TitleServiceModel {
  constructor(
    private injector: Injector,
    private appTitle: Title,
    @Inject(DOCUMENT) private doc: any,
    @Inject(ZN_TITLE_CONFIG_TOKEN) private options: TitleConfig,
    @Inject(ZN_I18N_SERVICE_TOKEN) private i18n: I18nService,
    @Inject(ZN_MENU_SERVICE_TOKEN) private menu: MenuService,
  ){}

  private _options: TitleConfig = this.options;
  private _title: string = this._options.title;
  private _change$: BehaviorSubject<TitleModel> = new BehaviorSubject<TitleModel>(null);

  private get routeInfo(): ActivatedRoute{
    return this.injector.get(ActivatedRoute)
  }
  get data(){
    return {
      title: this._options.titleI18n[this.i18n.lang] || this._options.title,
      separator: this._options.separator,
      prefix: this._options.prefixI18n[this.i18n.lang] || this._options.prefix,
      suffix: this._options.suffixI18n[this.i18n.lang] || this._options.suffix,
    };
  }
  get change$(){
    return this._change$.asObservable().pipe(filter(v => v !== null), share())
  }

  private getByRoute(){
    let routeInfo = this.routeInfo.snapshot;
    while (routeInfo.firstChild) routeInfo = routeInfo.firstChild;  // 注意
    const data = {...routeInfo.data};
    return (data.titleI18n && data.titleI18n[this.i18n.lang]) || data.title;
  }
  private getByMenu(): string{
    const route = this.routeInfo.snapshot.data;
    const menu = this.menu.getMenuByUrl(route.url);
    let title = '';

    if(menu && menu.length > 0){
      const item = menu[menu.length - 1];
      title = item.titleI18n[this.i18n.lang] || item.title;
    }
    return title;
  }
  private getByElement(): string {
    const el = this.doc.querySelector(this.options.selector);
    if(el) return el.firstChild.textContent.trim();
    return '';
  }

  setTitle(value?: string | string[]){
    if(!value){
      value =
        this.getByRoute() ||
        this.getByMenu() ||
        this.getByElement() ||
        this.options.title;
    }
    if(value && typeof value === 'string'){
      value = [value]
    }
    const lang = this.i18n.lang;
    let newTitles = [];
    if (this._options.prefix) {
      newTitles.push(this._options.prefixI18n[lang] || this._options.prefix);
    }
    newTitles.push(...(value as string[]));
    if (this._options.suffix) {
      newTitles.push(this._options.suffixI18n[lang] || this._options.suffix);
    }
    this._title = newTitles.join(this._options.separator);
    this.appTitle.setTitle(this._title);
    this._change$.next(this.data);
  }
  setSeparator(value: string){
    this._options.separator = value;
  }
  setPrefix(value: string){
    this._options.prefix = value;
  }
  setSuffix(value: string){
    this._options.suffix = value;
  }
}
