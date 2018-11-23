import { Injectable, Inject, Injector, Optional } from '@angular/core';
import { Router, ActivatedRoute, NavigationStart, NavigationEnd, ActivationEnd, Scroll } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ViewportScroller } from '@angular/common';
import { Observable, zip, of, combineLatest } from 'rxjs';
import { tap, catchError, map, mergeMap, shareReplay, filter, share } from 'rxjs/operators';

import { AuthService, ZN_AUTH_SERVICE_TOKEN } from '@shared/modules/auth';
import { ACLService, ZN_ACL_SERVICE_TOKEN } from '@shared/modules/acl';
import { MenuService, ZN_MENU_SERVICE_TOKEN } from '@shared/modules/menu';
import { SettingService, ZN_SETTING_SERVICE_TOKEN } from '@shared/modules/setting';
import { TitleService, ZN_TITLE_SERVICE_TOKEN } from '@shared/modules/title';
import { I18nService, ZN_I18N_SERVICE_TOKEN } from '@shared/modules/i18n';

/*
 *  启动时，获取应用基础数据，setup请求 需要设为忽略token，后端根据有无 token 返回数据，否则无法进入授权登录等页面
 *  登录判断放在 acl-guard 中进行
 *  无法注入router
 */
@Injectable()
export class InitialService {

  constructor(
    private http: HttpClient,
    private injector: Injector,
    private viewportScroller: ViewportScroller,
    @Inject(ZN_AUTH_SERVICE_TOKEN) private auth: AuthService,
    @Inject(ZN_ACL_SERVICE_TOKEN) private acl: ACLService,
    @Inject(ZN_SETTING_SERVICE_TOKEN) private setting: SettingService,
    @Inject(ZN_MENU_SERVICE_TOKEN) private menu: MenuService,
    @Inject(ZN_I18N_SERVICE_TOKEN) private i18n: I18nService,
    @Inject(ZN_TITLE_SERVICE_TOKEN) private title: TitleService,
  ) {}

  setup(){
    return new Promise((resolve, reject) => {
      // console.info('初始化应用状态！');
      const router = this.injector.get(Router);

      /* 设置当前语言，也可提供一个语言令牌，通过提供商设初值 */
      this.i18n.use(this.setting.layout.lang)
        .subscribe(
          () => {},
          error => {},
          () => {
            // console.info('当前语言：', this.i18n.lang);
          }
        );

      const langChange$ = this.i18n.change$;
      const routeEnd$ = router.events.pipe(
        filter(evt => evt instanceof NavigationEnd)
      );

      // 确保路由导航结束，防止 title 中无法获取 route 信息
      combineLatest(langChange$, routeEnd$)
        .subscribe(() => {
          this.title.setTitle();
          this.menu.refresh();
        });

      const routeScroll$ = router.events.pipe(
        filter(evt => evt instanceof Scroll)
      );
      routeScroll$.subscribe((e: any) => {
        // console.info(e);
        /* 前进后退，position有值，直接跳转为null */
        setTimeout(() => {
          if (e.position) {
            this.viewportScroller.scrollToPosition(e.position);
          }else{
            this.viewportScroller.scrollToPosition([0, 0]);
          }
        });
      });

      resolve(null)
    })
  }
}
