import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export interface MenuModel {
  /** 文本 */
  title: string;
  /** i18n主键 */
  titleI18n?: string;
  /** 是否菜单组 */
  group?: boolean;
  /** 路由 */
  link?: string;
   /* 路由是否精准匹配，默认：`false` */
  linkExact?: boolean;
  /** 外部链接 */
  externalLink?: string;
  /** 链接 target */
  target?: '_blank' | '_self' | '_parent' | '_top';
  /** 图标 */
  icon?: string;
  /** 是否隐藏菜单 */
  hidden?: boolean;
  /*  访问控制 */
  acl?: any;
  /** 二级菜单 */
  children?: MenuModel[];
  [key: string]: any;
}

export const ZN_MENU_CONFIG_TOKEN  = new InjectionToken<MenuConfigModel>(
  'ZN_MENU_CONFIG_TOKEN'
);
export const ZN_MENU_SERVICE_TOKEN  = new InjectionToken<MenuServiceModel>(
  'ZN_MENU_SERVICE_TOKEN'
);

export interface MenuConfigModel {
  [key: string]: any
}
export interface MenuServiceModel {
  readonly data: MenuModel[];
  readonly change$: Observable<MenuModel[]>;
  set(value: MenuModel[]):void;
  refresh(callback?: (item: MenuModel, parentMenum: MenuModel, depth?: number) => void):void;
  reset():void;
  clear():void;
}
