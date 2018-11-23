import { Component, OnInit, Inject, Injector, Injectable, AfterViewChecked, AfterViewInit, ViewChild, HostBinding } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators, ValidationErrors, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { Observable, Observer, Subject, BehaviorSubject, interval, of, from, throwError, zip, Subscription } from 'rxjs';
import { catchError, map, tap, timeInterval, delay, share, switchMap } from 'rxjs/operators'

import { StartupService } from '@core/startup/startup.service';
import { ACLService, ZN_ACL_SERVICE_TOKEN } from '@shared/modules/acl';
import { MenuService, ZN_MENU_SERVICE_TOKEN } from '@shared/modules/menu';
import { SettingService, ZN_SETTING_SERVICE_TOKEN } from '@shared/modules/setting';
import { AuthService, ZN_AUTH_SERVICE_TOKEN, SocialService, ZN_SOCIAL_SERVICE_TOKEN } from '@shared/modules/auth';
import { CaptchaComponent, ZN_CAPTCHA_EXPIRED, ZN_CAPTCHA_NOT_GET, ZN_CAPTCHA_ERROR } from '@shared/components/captcha';

import { UserHttp } from '@services/user';
import { UtilsHttp } from '@services/utils';


const PHONE_REG = /^1\d{10}$/;
const SOCIAL_CALLBACK =  'http://192.168.0.110:4200/callback/';

interface MessageModel {
  code: number;
  timestamp: number
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
})
export class LoginComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private routeInfo: ActivatedRoute,
    private startup: StartupService,
    @Inject(ZN_ACL_SERVICE_TOKEN) private acl: ACLService,
    @Inject(ZN_AUTH_SERVICE_TOKEN) private auth: AuthService,
    @Inject(ZN_SETTING_SERVICE_TOKEN) private setting: SettingService,
    @Inject(ZN_MENU_SERVICE_TOKEN) private menu: MenuService,
    @Inject(ZN_SOCIAL_SERVICE_TOKEN) private social: SocialService,

    private userHttp: UserHttp,
    private utilsHttp: UtilsHttp
  ) {}

  form: FormGroup;
  type: number = 0;
  interval$: any;
  loading: boolean = false;
  error: Array<string> = [];
  message: MessageModel = {
    code: -1,
    timestamp: Date.now()
  };

  prefix$: Observable<Array<{[key: string]: any}>>;
  mobileWatch$: Subject<any> = new Subject<any>();
  captchaWatch$: Subject<any> = new Subject<any>();
  regSubscription$: Subscription;

  @ViewChild(CaptchaComponent)
  captchaRef: any;

  private createFormModel(){
    this.form = this.fb.group({
      nickname: [
        '',
        {
          updateOn: 'blur',
        }
      ],
      password: [
        '',
        {
          updateOn: 'blur',
        }
      ],
      mobilePrefix: [
        '86',
        {
          updateOn: 'blur',
        }
      ],
      mobile: [
        '',
        {
          updateOn: 'blur',
          validators: [
            Validators.pattern(PHONE_REG),
          ],
        }
      ],
      captcha: [
        '',
        [
          Validators.required
        ]
      ],
      remember: [
        false
      ]
    })
  }

  checkCaptcha(control: AbstractControl): boolean{
    if(this.message.code === Number(control.value) && this.message.code !== -1){
      if(LoginComponent.validateCaptcha(this.message.timestamp)){
        this.error[this.type] = ZN_CAPTCHA_EXPIRED;
        return false;
      }
      return true;
    }else{
      this.error[this.type] = this.message.code === -1 ? ZN_CAPTCHA_NOT_GET: ZN_CAPTCHA_ERROR;
      return false;
    }
  }

  static triggerValidate( ret: AbstractControl | Array<AbstractControl>){
    if(ret instanceof FormControl){
      ret.markAsDirty();
      ret.updateValueAndValidity();
    }else{
      for(let i of <Array<AbstractControl>>ret){
        i.markAsDirty();
        i.updateValueAndValidity();
      }
    }
  }

  static validateCaptcha(time: number, exp:number = 3): boolean{
    const deadline = time + exp*60*1000;
    return Date.now() - deadline > 0;
  }

  getCaptcha(): Observable<Object>{
    if(this.mobile.untouched) LoginComponent.triggerValidate([this.mobilePrefix, this.mobile]);
    if(this.mobilePrefix.invalid || this.mobile.invalid) return throwError(null);
    /*  添加标记以避免点击提交时执行 */
    setTimeout(() => {
      this.captchaWatch$.next(true)
    }, 0);
    const obs$ = this.mobile.valid ? [this.captchaWatch$] : [this.captchaWatch$, this.mobileWatch$];

    return zip(...obs$)
      .pipe(
        delay(10),
        switchMap(v => {
          if(!(this.mobilePrefix.valid && this.mobile.valid)) return throwError(null);
          const data = {
            prefix: this.mobilePrefix.value,
            mobile: this.mobile.value
          };

          return this.utilsHttp.getLoginCaptcha(data)
            .pipe(
              tap(v => {
                console.info(v);
                this.message = {
                  code: (<any>v).code,
                  timestamp: Date.now()
                }
              }),
            );
        })
      );
  }

  private setAppData({ auth, user, acl, menu }){
    // 设置token
    this.auth.set(auth);
    return this.startup.setup()
  }

  submitFrom(){
    this.loading = true;
    let data: any, http: any;

    if(this.type === 0){
      data = {
        nickname: this.nickname.value,
        password: this.password.value
      };
      http = this.userHttp.nameLogin(data);
    }else{
      data = {
        phone: this.mobile.value,
        captcha: this.captcha.value
      };
      http = this.userHttp.phoneLogin(data)
    }
    this.regSubscription$ = http.subscribe(
      v => {
        const res: any = v;
        // console.info(res);
        this.loading = false;
        if(res.errMsg){
          this.error[this.type] = res.errMsg || '帐号或密码错误！';
          return;
        }else{
          this.clearError();
          this.setAppData(res)
            .then(() => this.router.navigate(['/']))
        }
      }
    );
  }

  handleChange(){
    this.form.reset({
      mobilePrefix: 86
    });
    this.captchaRef.reset(true);
    this.clearError()
  }

  handleSubmit(){
    this.clearError();
    if(this.type === 0){
      LoginComponent.triggerValidate([this.nickname, this.password]);
      if (this.nickname.invalid || this.password.invalid) return;
    }else{
      LoginComponent.triggerValidate([this.mobilePrefix, this.mobile, this.captcha]);
      if (this.mobilePrefix.invalid || this.mobile.invalid || this.captcha.invalid) return;

      if(!this.checkCaptcha(this.captcha)) return
    }
    this.submitFrom();
  }

  clearError(){
    this.error = [];
  }

  loadRegionPrefix(){
    this.prefix$ = this.utilsHttp.getRegionPrefix().pipe(
      map(v => (<any>v).data)
    );
  }

  ngOnInit() {
    this.loadRegionPrefix();
    this.createFormModel();

    // console.info(this.auth.get());
    // console.info(this.setting.data);
    // console.info(this.cache.meta)
  }

  get nickname(){
    return this.form.get('nickname');
  }
  get password(){
    return this.form.get('password');
  }
  get mobilePrefix(){
    return this.form.get('mobilePrefix');
  }
  get mobile(){
    return this.form.get('mobile');
  }
  get captcha(){
    return this.form.get('captcha');
  }

  open(type: string, openType?: string) {
    let url = ``;
    let callback = SOCIAL_CALLBACK + type;
    let client_id = '86f8efc0a0c51e127cd3';

    // 注意地址
    switch (type) {
      case 'github':
        url = `https://github.com/login/oauth/authorize?client_id=${client_id}&response_type=code&redirect_uri=${callback}`;
        break;
    }
      this.social.login(url, { type: 'href' });
  }
}
