import { Component, OnInit, Inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subject, BehaviorSubject } from 'rxjs';
import { filter, share, tap } from 'rxjs/operators';

import { AuthService, ZN_AUTH_SERVICE_TOKEN } from '@shared/modules/auth';
import { ACLService, ZN_ACL_SERVICE_TOKEN } from '@shared/modules/acl';
import { MenuService, ZN_MENU_SERVICE_TOKEN } from '@shared/modules/menu';
import { SettingService, ZN_SETTING_SERVICE_TOKEN } from '@shared/modules/setting';
import { TitleService, ZN_TITLE_SERVICE_TOKEN } from '@shared/modules/title';
import { I18nService, ZN_I18N_SERVICE_TOKEN} from "@shared/modules/i18n";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit{

  constructor(
    private router: Router,
    @Inject(ZN_AUTH_SERVICE_TOKEN) private authService: AuthService,
    @Inject(ZN_ACL_SERVICE_TOKEN) private aclService: ACLService,
    @Inject(ZN_SETTING_SERVICE_TOKEN) private settingService: SettingService,
    @Inject(ZN_MENU_SERVICE_TOKEN) private menuService: MenuService,
    @Inject(ZN_TITLE_SERVICE_TOKEN) private titleService: TitleService,
    @Inject(ZN_I18N_SERVICE_TOKEN) private i18nService: I18nService
  ){}

  get menu(){
    return this.menuService.data
  }

  ngOnInit() {


  }

}
