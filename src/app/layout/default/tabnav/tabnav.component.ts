import { Component, Input, OnInit, Inject, HostListener } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { combineLatest, zip } from 'rxjs';
import { filter } from 'rxjs/operators';
import { I18nService, ZN_I18N_SERVICE_TOKEN } from '@shared/modules/i18n';
import { ReuseService, ZN_REUSE_SERVICE_TOKEN } from '@shared/modules/reuse';
import { SettingService, ZN_SETTING_SERVICE_TOKEN } from '@shared/modules/setting';

export interface TabModel {
  url?: string,
  closable?: boolean,
  title?: string,
  titleI18n?: object
}

@Component({
  selector: 'app-tabnav',
  templateUrl: './tabnav.component.html',
  styleUrls: ['./tabnav.component.less']
})
export class TabnavComponent implements OnInit {
  constructor(
    private router: Router,
    private routeInfo: ActivatedRoute,
    @Inject(ZN_I18N_SERVICE_TOKEN) private i18nService: I18nService,
    @Inject(ZN_REUSE_SERVICE_TOKEN) private reuseService: ReuseService,
    @Inject(ZN_SETTING_SERVICE_TOKEN) private settingService: SettingService,
  ){
    // 注意：只能在构造函数里订阅
    const routeEnd$ = router.events.pipe(filter(v => v instanceof NavigationEnd));
    zip(routeEnd$, reuseService.change$).subscribe(([route, change]) => {
      this.refresh()
    });
  }

  get isCollapsed(){
    return this.settingService.layout.collapsed
  };

  private _initial = false;

  public tabs: TabModel[] = [];
  public selectedIndex: number = 0;

  get lang(){
    return this.i18nService.lang
  }

  private getCurTab(){
    const snapshot = this.routeInfo.snapshot;
    const url = this.reuseService.getUrl(snapshot);
    const menu = this.reuseService.getMenu(url);
    const titleObj = this.reuseService.getTitle(snapshot, menu);
    const closable = this.reuseService.cached.length > 0 && this.reuseService.getClosable(url, snapshot);
    return {
      url,
      closable,
      ...titleObj
    };
  }

  private refresh(){
    // 初始
    if(this.tabs.length <= 0){
      const curTab = this.getCurTab();
      this.tabs.push(curTab);
    }
    // 缓存
    this.reuseService.cached.forEach((v, k, arr) => {
      if(!this.tabs.some(v1 => v1.url === v.url)){
        this.tabs.push({
          url: v.url,
          title: v.title,
          titleI18n: v.titleI18n,
          closable: v.closable && arr.length > 0,
        });
      }
    });
    // 新建
    const curTab = this.getCurTab();
    const index = this.tabs.findIndex(v => v.url === curTab.url);
    if(this.tabs.length > 0 && index === -1){
      this.tabs.push(curTab);
    }else{
      if(index !== -1){
        this.selectedIndex = index;
        return
      }
    }
    this.selectedIndex = this.tabs.length -1;
  }

  private routeTo(index: number){
    index = Math.max(0, Math.min(index, this.tabs.length - 1));
    const tab = this.tabs[index];
    this.router.navigateByUrl(tab.url).then(() => {
      this.selectedIndex = index;
    });
  }

  handleTabClick(index: number){
    if(index === this.selectedIndex) return;
    this.routeTo(index)
  }

  handleTabClose(e: Event, index: number){
    e.stopPropagation();
    if(this.tabs.length <= 1) return;
    const tab = this.tabs[index];
    this.tabs.splice(index, 1);
    this.reuseService.close(tab.url);
    const len = this.tabs.length -1;
    // 重新导航
    if(index === this.selectedIndex){
      this.routeTo(index > len && index !== this.selectedIndex ? len : index)
    }
  }

  ngOnInit() {

  }

}
