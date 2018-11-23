import { Component, Input, OnInit, Output, OnChanges, EventEmitter, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Observable, of, Subscription } from 'rxjs';
import { share, catchError } from 'rxjs/operators';
import { AP } from '@prefix/index';
import { environment } from '@env/environment';

import {
  ZN_CAPTCHA_INITIAL,
  ZN_CAPTCHA_SENDING,
  ZN_CAPTCHA_RESEND,
  ZN_CAPTCHA_RETRY,
} from './config';

@Component({
  selector: `${AP}-captcha`,
  templateUrl: './captcha.component.html',
  styleUrls: ['./captcha.component.less'],
  preserveWhitespaces: false,
  // changeDetection:ChangeDetectionStrategy.OnPush
})
export class CaptchaComponent implements OnDestroy {
  constructor(
    private changeRef:ChangeDetectorRef
  ){}

  @Input(`${AP}Size`)
  size: string = 'large';

  @Input(`${AP}InitialCount`)
  initialCount: number = environment.production ? 60 : 5;

  @Input(`${AP}InitialTpl`)
  initialTpl: string = ZN_CAPTCHA_INITIAL;

  @Input(`${AP}LoadingTpl`)
  loadingTpl: string = ZN_CAPTCHA_SENDING;

  @Input(`${AP}TryingTpl`)
  tryingTpl: string = ZN_CAPTCHA_RESEND;

  @Input(`${AP}RetryTpl`)
  retryTpl: string = ZN_CAPTCHA_RETRY;

  @Input(`${AP}BeforeTryFn`)
  beforeTryFn: Function = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve()
      },1000)
    })
  };

  @Input(`${AP}Disabled`)
  set disabled(value: boolean){
    this.isDisabled = value;
  }
  get disabled(): boolean{
    return this.isDisabled;
  }

  @Input(`${AP}Loading`)
  set loading(value: boolean){
    this.isLoading = value;
  }
  get loading(): boolean{
    return this.isLoading;
  }

  private _initial: boolean = false;
  private _isClicked: boolean = false;
  private _count: number = this.initialCount;
  private _tplReg: RegExp = /\$\{.+?\}/;
  private _interval$: any;
  private _interval: number = 1000;
  private _subscription: Subscription;

  isLoading: boolean = false;
  isDisabled: boolean = false;
  placeholder: string = this.initialTpl;

  private setClickedState(){
    if(this._isClicked) return false;
    this._isClicked = true;
    this.isLoading = true;
    this.placeholder = this.loadingTpl;
    return true
  }

  private setStartedState(){
    if(this._interval$) clearInterval(this._interval$);
    this._initial = true;
    this.isLoading = false;
    this.disabled = true;
    /* 消除大约1s的状态显示空档 */
    this.placeholder = this.tryingTpl.replace(this._tplReg, String(this._count));
  }

  handleClick(){
    if(!this.setClickedState()) return false;
    if(this.beforeTryFn && Object.prototype.toString.call(this.beforeTryFn) === '[object Function]'){
      const result = this.beforeTryFn();
      if(result instanceof Promise){
        result
          .then(() => this.start())
          .catch(() => this.reset())
      }else if(result instanceof Observable){
        this._subscription = result
          .subscribe(
            v => {
              this.start();
              this.unSubscribe();
            },
            error => {
              // console.info(error);
              this.reset()
            },
            () => {
              // console.info('完成！');
              this.reset()
            }
          );
      }else if(result === true){
        this.start();
      }else{
        this.reset();
      }
    }else{
      this.start();
    }
  }

  unSubscribe(){
    if(this._subscription) this._subscription.unsubscribe();
  }

  start(){
    this.setStartedState();
    this._interval$ = setInterval(() => {
      if(this._count > 1){
        this._count--;
        this.placeholder = this.tryingTpl.replace(this._tplReg, String(this._count));
        // this.changeRef.markForCheck();
      }else{
       this.reset();
      }
    }, this._interval)
  }

  reset(value?: boolean){
    clearInterval(this._interval$);
    this._count = this.initialCount;
    this._isClicked = false;
    this.isDisabled = false;
    this.isLoading = false;
    if(value) this._initial = false;
    this.placeholder = this._initial ? this.retryTpl : this.initialTpl;
    this.unSubscribe();
  }

  ngOnDestroy(){
    if(this._interval$) clearInterval(this._interval$);
    if(this._subscription) this._subscription.unsubscribe();
  }
}
