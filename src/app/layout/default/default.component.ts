import { Component, OnInit, ViewChild, ViewContainerRef, TemplateRef, Inject, ElementRef, Renderer2, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet, Router, Scroll, NavigationEnd, NavigationError, RouteConfigLoadStart, NavigationCancel } from '@angular/router';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { ViewportScroller } from '@angular/common';
import { BreakpointObserver, BreakpointState, MediaMatcher, Breakpoints } from "@angular/cdk/layout";
import { DOCUMENT } from '@angular/platform-browser';
import { zip } from 'rxjs';
import { filter, withLatestFrom } from 'rxjs/operators';
import { SettingService, ZN_SETTING_SERVICE_TOKEN } from '@shared/modules/setting';
import { ScrollService, ZN_SCROLL_SERVICE_TOKEN } from '@shared/modules/scroll';
import { slideInAnimation } from '../../animations';


@Component({
  selector: 'app-layout-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.less'],
  preserveWhitespaces: false,
  animations: [
    slideInAnimation,
    trigger('fadeInAnimation', [
      state('shown', style({
        opacity: 0.6,
      })),
      state('hidden', style({
        opacity: 0,
        display: 'none'
      })),
      transition('shown => hidden', [
        animate('0.2s', style({
          opacity: 0
        }))
      ]),
      transition('hidden => shown', [
        animate('0.2s', style({
          opacity: 0.6
        }))
      ])
    ])
  ],
})
export class LayoutDefaultComponent implements OnInit {
  public isFetching: boolean = false;
  private _timer: any;

  constructor(
    @Inject(DOCUMENT) private doc: any,
    private router: Router,
    public bm: BreakpointObserver,
    public media: MediaMatcher,
    private el: ElementRef,
    private renderer: Renderer2,
    private viewContainerRef: ViewContainerRef,
    private viewportScroller: ViewportScroller,
    @Inject(ZN_SETTING_SERVICE_TOKEN) private settingService: SettingService,
    @Inject(ZN_SCROLL_SERVICE_TOKEN) private scrollService: ScrollService,
  ){}

  @ViewChild('tabnav', {read: ViewContainerRef})
  tabnavRef: ViewContainerRef;

  get isCollapsed(){
    return this.settingService.layout.collapsed
  }

  private updateHostClass(){
    const { collapsed } = this.settingService.layout;
    if(collapsed){
      this.renderer.addClass(this.el.nativeElement,'zn-layout--collapsed');
    }else{
      this.renderer.removeClass(this.el.nativeElement,'zn-layout--collapsed');
    }
  }

  handleCloseSideBar(){
    this.settingService.setLayout({collapsed: true});
  }

  prepareRoute(outlet: RouterOutlet) {
    /* 在路由参数中定义状态*/
    // return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];

    // console.info(Breakpoints);
    return (this.media.matchMedia(Breakpoints.Handset).matches || this.media.matchMedia(Breakpoints.Tablet).matches) ? 0 :(<any>this.tabnavRef)._data.componentView.component.selectedIndex
  }

  ngOnInit() {

    this.settingService.change$.subscribe(({type, payload}) => {
      this.updateHostClass();
    });

    this.router.events.subscribe(evt => {
      if (!this.isFetching && evt instanceof RouteConfigLoadStart) {
        this.isFetching = true;
      }
      if (evt instanceof NavigationError || evt instanceof NavigationCancel) {
        this.isFetching = false;
        if (evt instanceof NavigationError) {
          console.error('路由加载失败！')
        }
        return;
      }
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      if(this._timer) clearTimeout(this._timer);
      this._timer = setTimeout(() => {
        this.isFetching = false;
        clearTimeout(this._timer);
      },300)
    });
  }

}
