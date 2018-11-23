import { Injectable, Inject, ViewChild, ViewContainerRef } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { ScrollConfig } from './config';
import { ZN_SCROLL_CONFIG_TOKEN } from './interface';
import { StorageService, ZN_SESSION_SERVICE_TOKEN } from '../../store';

type propType = 'scrollTop' | 'scrollLeft';

/*
* 必须加延时
* */

@Injectable()
export class ScrollService{

  constructor(
    @Inject(ZN_SCROLL_CONFIG_TOKEN) private options: ScrollConfig,
    @Inject(ZN_SESSION_SERVICE_TOKEN) private store: StorageService,
    @Inject(DOCUMENT) private doc: Document
  ){}

  get scrollEle(){
    const opts = this.options;
    return opts.scrollSelector === 'window' ? this.doc.documentElement : opts.scrollSelector
  }

  private _data = this.store.get(this.options.store_key) ? this.store.get(this.options.store_key) : (this.store.set(this.options.store_key, {}), {});
  private _timer_1: any;
  private _timer_2: any;

  getPosition(key: string): number{
    return this._data[key]
  }
  removePosition(key: string): void{
    delete this._data[key];
    this.store.set(this.options.store_key, this._data);
  }
  savePosition(key: string): void{
    this._data[key] = this.scrollEle.scrollTop;
    this.store.set(this.options.store_key, this._data);
  }
  attachPosition(key: string): void{
    const scrollTop = this.getPosition(key);
    if(this._timer_1) clearTimeout(this._timer_1);
    this._timer_1 = setTimeout(() => {
      this.scrollTo(this.scrollEle, 'scrollTop', 0, scrollTop, false)
    })
  }
  scrollTop(){
    if(this._timer_2) clearTimeout(this._timer_2);
    this._timer_2 = setTimeout(() => {
      this.scrollEle.scrollTop = 0;
    });
  }

  scrollTo(el: any, prop: propType, from: number, to: number, animate: boolean = true, duration: number = 500, callback?: Function){
    el.scrollTop = from;

    if (!window.requestAnimationFrame) {
      window.requestAnimationFrame = (
        window.webkitRequestAnimationFrame ||
        function (callback) {
          return window.setTimeout(callback, 1000 / 60);
        }
      );
    }
    const difference = Math.abs(from - to);
    const step = animate ? Math.ceil(difference / duration * 50) : difference;

    function scroll(start, end, step) {
      if (start === end) {
        typeof callback === 'function' && callback();
        return;
      }
      let d = (start + step > end) ? end : start + step;
      if (start > end) {
        d = (start - step < end) ? end : start - step;
      }
      if(el === window){
        window.scrollTo(d, d);
      }else{
        el[prop] = d;
      }
      window.requestAnimationFrame(() => scroll(d, end, step));
    }

    scroll(from, to, step);
  }

}
