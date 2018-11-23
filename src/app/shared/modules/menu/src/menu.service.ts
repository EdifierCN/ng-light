import { Injectable, Inject, Injector } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { share } from 'rxjs/operators';
import { ACLService, ZN_ACL_SERVICE_TOKEN } from '../../acl/index';
import { I18nService, ZN_I18N_SERVICE_TOKEN } from '../../i18n/index';
import { SettingService, ZN_SETTING_SERVICE_TOKEN } from '../../setting/index';
import { MenuServiceModel, MenuModel, ZN_MENU_CONFIG_TOKEN } from "./interface";
import { MenuConfig } from './config';

@Injectable()
export class MenuService implements MenuServiceModel{
  constructor(
    private injector: Injector,
    @Inject(ZN_MENU_CONFIG_TOKEN) private options: MenuConfig,
    @Inject(ZN_I18N_SERVICE_TOKEN) private i18n: I18nService,
    @Inject(ZN_ACL_SERVICE_TOKEN) private acl: ACLService,
    @Inject(ZN_SETTING_SERVICE_TOKEN) private setting: SettingService,
  ){}

  private _data: MenuModel[] = this.options.menu;
  private _change$: BehaviorSubject<MenuModel[]> = new BehaviorSubject<MenuModel[]>([]);

  get data(){
    return this._data;
  }
  get change$(){
    return this._change$.asObservable().pipe(share())
  }
  get url(){
    const router = this.injector.get(Router);
    return router.url
  }

  // 访问配置，附加处理
  private visit(callback: (item: MenuModel, parentMenu: MenuModel, depth?: number) => void){
    const inFn = (list: MenuModel[], parentMenu: MenuModel, depth: number) => {
      for (const item of list) {
        callback(item, parentMenu, depth);
        if (item.children && item.children.length > 0) {
          inFn(item.children, item, depth + 1);
        } else {
          item.children = [];
        }
      }
    };
    inFn(this._data, null, 0);
  }

  set(value: MenuModel | MenuModel[]){
    this._data = [];
    this.add(value)
  }

  /* 更改配置后，手动刷新 */
  add(value: MenuModel | MenuModel[]){
    if(!(value instanceof Array)){
      value = [value]
    }
    this._data = value;
  }

  // 刷新配置（权限刷新，保留部分配置）(突变更新)
  refresh(callback?: (item: MenuModel, parent: MenuModel, depth?: number) => void){
    const url = this.url;
    let i = 0;
    this.visit((item, parent, depth) => {
      item.index = i++;
      item.parent = parent;
      item.title = item.titleI18n[this.i18n.lang] || item.title;

      if(!item.link) item.link = '';
      if(!item.externalLink) item.externalLink = '';
      if (typeof item.linkExact === 'undefined') item.linkExact = false;

      item.hidden = typeof item.hidden === 'undefined' ? false : item.hidden;
      if(item.acl) item.hidden = !this.acl.has(item.acl);

      item.selected = item.link === url;
      if(parent){
        parent.opened = !this.setting.layout.collapsed && parent.children.some(v => v.selected);
      }
      callback && callback(item, parent, depth);
    });
    this._change$.next(this._data);
  }

  // 重置为初始配置
  reset(){
    this.set(this.options.menu);
  }

  // 清空配置
  clear(){
    this.set([]);
  }

  // 根据 url 获取菜单列表
  getMenuByUrl(url: any): MenuModel[] {
    const ret: MenuModel[] = [];
    let menu: MenuModel = null;
    this.visit((item, parent, depth) => {
      if (item.link === url) {
        menu = item;
      }
    });
    if (!menu) return ret;
    do {
      ret.splice(0, 0, menu);
      menu = menu.parent;
    } while (menu);

    /* 扁平: [ a, b, c] */

    return ret;
  }
}
