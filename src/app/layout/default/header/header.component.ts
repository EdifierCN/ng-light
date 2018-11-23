import { Component, OnInit, Inject, Input, Output, EventEmitter, Injector, LOCALE_ID } from '@angular/core';
import { registerLocaleData, Location, DOCUMENT } from '@angular/common';
import zh from '@angular/common/locales/zh';
import en from '@angular/common/locales/en';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { zh_CN, en_US, NzI18nService } from 'ng-zorro-antd';
import { SettingService, ZN_SETTING_SERVICE_TOKEN } from '@shared/modules/setting';
import { I18nService, ZN_I18N_SERVICE_TOKEN } from '@shared/modules/i18n';
import { AuthService, ZN_AUTH_SERVICE_TOKEN } from '@shared/modules/auth';
import { MenuService, ZN_MENU_SERVICE_TOKEN } from '@shared/modules/menu';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less'],
  preserveWhitespaces: false,
})
export class HeaderComponent implements OnInit {
  constructor(
    private loc: Location,
    private router: Router,
    private routeInfo: ActivatedRoute,
    private nzI18nService: NzI18nService,
    @Inject(DOCUMENT) private doc: HTMLDocument,
    @Inject(ZN_AUTH_SERVICE_TOKEN) private authService: AuthService,
    @Inject(ZN_I18N_SERVICE_TOKEN) private i18nService: I18nService,
    @Inject(ZN_MENU_SERVICE_TOKEN) private menuService: MenuService,
    @Inject(ZN_SETTING_SERVICE_TOKEN) private settingService: SettingService,
  ){}

  get isCollapsed(){
    return this.settingService.layout.collapsed
  };

  get token(){
    return this.authService.get();
  }
  get user(){
    return this.settingService.user
  }
  get lang(){
    return this.i18nService.lang
  }
  get langs(){
    return this.i18nService.langs
  }

  handleChangeCollapsed(){
    this.settingService.setLayout({ collapsed: !this.isCollapsed });
    this.isCollapsed && this.menuService.refresh();
  }
  handleChangeLang(){
    const oleLang = this.i18nService.lang;
    let newLang:string, ngLang, antLang:any;

    if(oleLang === 'en-US'){
      newLang = 'zh-CN';
      ngLang = zh;
      antLang = zh_CN;
    }else{
      newLang = 'en-US';
      ngLang = en;
      antLang = en_US;
    }

    /*this.i18nService.use(newLang);
    registerLocaleData(ngLang, newLang);
    this.settingService.setLayout({
      lang: newLang
    });
    this.nzI18nService.setLocale(antLang);*/

    this.settingService.setLayout({
      lang: newLang
    });

    // let navigationExtras: NavigationExtras = {
    //   relativeTo: this.routeInfo,
    //   queryParams: { 'lang': newLang },
    //   queryParamsHandling: "merge",
    // };
    //
    // console.info(newLang);
    // this.router.navigate(['../'], navigationExtras);
    setTimeout(() => this.doc.location.reload(),0);
  }

  ngOnInit() {}

}
