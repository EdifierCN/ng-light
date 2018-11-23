import { Injectable, Inject, Injector } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Observable, zip, of, } from 'rxjs';
import { tap, catchError, map, mergeMap, shareReplay, filter } from 'rxjs/operators';

import { AuthService, ZN_AUTH_SERVICE_TOKEN } from '@shared/modules/auth';
import { ACLService, ZN_ACL_SERVICE_TOKEN } from '@shared/modules/acl';
import { MenuService, ZN_MENU_SERVICE_TOKEN } from '@shared/modules/menu';
import { SettingService, ZN_SETTING_SERVICE_TOKEN } from '@shared/modules/setting';
import { TitleService, ZN_TITLE_SERVICE_TOKEN } from '@shared/modules/title';
import { I18nService, ZN_I18N_SERVICE_TOKEN } from '@shared/modules/i18n';

import { SetupHttp } from '@services/setup';

/*
*  启动时，获取应用基础数据，setup请求 需要设为忽略token，后端根据有无 token 返回数据，否则无法进入授权登录等页面
*  登录判断放在 acl-guard 中进行
*  无法 构造函数注入router，通过 injector 获取
*/
@Injectable()
export class StartupService {
  constructor(
    @Inject(ZN_AUTH_SERVICE_TOKEN) private auth: AuthService,
    @Inject(ZN_ACL_SERVICE_TOKEN) private acl: ACLService,
    @Inject(ZN_SETTING_SERVICE_TOKEN) private setting: SettingService,
    @Inject(ZN_MENU_SERVICE_TOKEN) private menu: MenuService,
    @Inject(ZN_I18N_SERVICE_TOKEN) private i18n: I18nService,
    @Inject(ZN_TITLE_SERVICE_TOKEN) private title: TitleService,

    private setupHttp: SetupHttp
  ) {}

  private load(resolve: any, reject: any){
    // 未登录跳转至登录页
    this.setupHttp.getInitialData()
      .subscribe(
        v => {
          const res: any = v;
          // console.info('令牌', this.auth.get());
          // console.info('应用信息：', res);

          // 应用信息：名称、版本、日期
            this.setting.setApp(res.app);

          // 用户信息
          this.setting.setUser(res.user);

          // 访问控制
          this.acl.set(res.acl);

          // 菜单
          this.menu.set(res.menu);
        },
        error => {
          resolve(null);
        },
        () => {
          resolve(null)
        }
      );
  }

  setup(){
    return new Promise((resolve, reject) => {
      // console.info('加载应用初始服务！');
      this.load(resolve, reject)
    })
  }
}
