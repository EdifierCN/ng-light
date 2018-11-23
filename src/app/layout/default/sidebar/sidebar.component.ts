import { Component, OnInit, Inject, Input, Output, EventEmitter, OnDestroy} from '@angular/core';
import { BreakpointObserver, BreakpointState, MediaMatcher, Breakpoints } from "@angular/cdk/layout";
import { Router, NavigationEnd } from '@angular/router';
import { Subscription, of } from 'rxjs';
import { filter, map, switchMap, distinctUntilChanged } from 'rxjs/operators';
import { MenuService, ZN_MENU_SERVICE_TOKEN } from '@shared/modules/menu';
import { I18nService, ZN_I18N_SERVICE_TOKEN } from '@shared/modules/i18n';
import { SettingService, ZN_SETTING_SERVICE_TOKEN} from '@shared/modules/setting';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.less']
})
export class SidebarComponent implements OnInit,OnDestroy {
  constructor(
    private router: Router,
    public bm: BreakpointObserver,
    public media: MediaMatcher,
    @Inject(ZN_I18N_SERVICE_TOKEN) private i18nService: I18nService,
    @Inject(ZN_MENU_SERVICE_TOKEN) private menuService: MenuService,
    @Inject(ZN_SETTING_SERVICE_TOKEN) private settingService: SettingService,
  ){}

  isCollapsed:boolean = false;
  timer:any;
  subscription: Subscription;

  get lang(){
    return this.i18nService.lang
  }
  get menu(){
    return this.menuService.data
  }

  handleMenuClick(e: Event){
    // 注意：必须，阻止鼠标事件，允许跳转
    e.preventDefault();
    e.stopPropagation();
    if(this.media.matchMedia(Breakpoints.Handset).matches || this.media.matchMedia(Breakpoints.Tablet).matches)
      !this.isCollapsed && this.settingService.setLayout({collapsed: true});
  }

  ngOnInit() {
    // 避检查错误
    this.timer = setTimeout(() => {
      this.subscription = this.settingService.change$
        .pipe(
          map(v => (<any>v).layout),
          distinctUntilChanged()
        )
        .subscribe(({ collapsed }) => {
          this.isCollapsed = collapsed
        });
    }, 0);
  }

  ngOnDestroy(){
    if(this.timer) clearTimeout(this.timer);
    if(this.subscription) this.subscription.unsubscribe();
  }
}
