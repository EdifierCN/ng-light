import { Injectable } from '@angular/core';
import { MenuModel } from './interface';

@Injectable()
export class MenuConfig {
  menu: MenuModel[] = [{ title: '菜单一', titleI18n: 'menu_1' }, { title: '菜单二', titleI18n: 'menu_2' }];
  [key: string]: any
}
