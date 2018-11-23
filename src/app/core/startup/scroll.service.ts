import { Injectable, Inject, Injector } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { DOCUMENT } from '@angular/platform-browser';
import { Router, NavigationStart, NavigationEnd, Scroll } from '@angular/router';
import { zip, BehaviorSubject } from 'rxjs';
import { filter, share } from 'rxjs/operators';

interface positionModel {
  url: string,
  savedPosition: Array<number>
}

@Injectable()
export class ScrollService {
  constructor(
    private injecter : Injector,
    private viewportScroller: ViewportScroller,
    @Inject(DOCUMENT) private doc: any
  ){}

  private _data: BehaviorSubject<positionModel | null> = new BehaviorSubject<positionModel | null>(null);

  public get data(){
    return this._data.asObservable().pipe(share());
  }

  setup(){
    return new Promise((resolve, reject) => {
      const router = this.injecter.get(Router);
      const arr: Array<any> = new Array(2);
      let savedPosition: Array<positionModel>;

      const routeStart$ = router.events.pipe(
        filter(evt => evt instanceof NavigationStart)
      );
      const routeScroll$ = router.events.pipe(
        filter(evt => evt instanceof Scroll)
      );

      routeStart$.subscribe((snapshot) => {
        savedPosition = [this.doc.body.scrollLeft || this.doc.documentElement.scrollLeft, this.doc.body.scrollTop || this.doc.documentElement.scrollTop];
      });

      routeScroll$.subscribe((v) => {
        const snapshot = (<any>v).routerEvent;
        arr.push({
          url: (<any>snapshot).url,
          savedPosition: [0,0]
        });
        arr.splice(0, 1);
        typeof arr[0] === 'undefined'?
          arr[0] = {
            url: '',
            savedPosition: [0,0]
          }:
          arr[0].savedPosition = savedPosition;
        const [from, to] = arr;
        this._data.next(to);
      });
      resolve(null)
    })
  }

}
