import { Component, OnInit, OnDestroy, Inject, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators, ValidationErrors, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable, Observer, empty, Subject, BehaviorSubject, forkJoin, combineLatest, zip, throwError, from, of, Subscription } from 'rxjs';
import { map, tap, switchMap, delay } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { CaptchaComponent, ZN_CAPTCHA_EXPIRED, ZN_CAPTCHA_NOT_GET, ZN_CAPTCHA_ERROR } from '@shared/components/captcha';

import { UserHttp } from '@services/user';
import { UtilsHttp } from '@services/utils';

interface MessageModel {
  code: number;
  timestamp: number
}

/*
* 注意：由于required和number-only指令，谨慎校验函数的触发时机
* */

//强：字母+数字+特殊字符
// ^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&*]+$)(?![a-zA-z\d]+$)(?![a-zA-z!@#$%^&*]+$)(?![\d!@#$%^&*]+$)[a-zA-Z\d!@#$%^&*]+$
//中：字母+数字，字母+特殊字符，数字+特殊字符
// ^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&*]+$)[a-zA-Z\d!@#$%^&*]+$
// //弱：纯数字，纯字母，纯特殊字符
// ^(?:\d+|[a-zA-Z]+|[!@#$%^&*]+)$

const NAME_TYPE_REG = /(?!^\d+$)^[a-zA-Z0-9_\u4e00-\u9fa5]+$/;
const CN_REG = /^[\u4e00-\u9fa5]$/;
const PHONE_REG = /^1\d{10}$/;
const PASSWORD_REG = /(?!^([0-9]+|[a-z]+|[A-Z]+|[!@#$%^&*`~()+=_\-]+)$)^\w{6,12}$/;
const PASSWORD_STRONG_REG = /^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&*]+$)(?![a-zA-z\d]+$)(?![a-zA-z!@#$%^&*]+$)(?![\d!@#$%^&*]+$)[a-zA-Z\d!@#$%^&*]+$/;
const PASSWORD_NORMAL_REG = /^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&*]+$)[a-zA-Z\d!@#$%^&*]+$/;
const PASSWORD_WEEK_REG = /^(?:\d+|[a-zA-Z]+|[!@#$%^&*]+)$/;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.less']
})
export class RegisterComponent implements OnInit,OnDestroy {

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private routeInfo:ActivatedRoute,

    private userHttp: UserHttp,
    private utilsHttp: UtilsHttp
  ) {}

  form: FormGroup;
  error: string = '';
  visible: boolean = false;
  status: string = 'pool';
  progress: number = 0;
  passwordProgressMap = {
    ok: 'success',
    pass: 'normal',
    pool: 'exception',
  };
  timeout$: any;
  loading: boolean = false;
  prefix$: Observable<Array<{[key: string]: any}>>;
  message: MessageModel = {
    code: -1,
    timestamp: Date.now()
  };

  nameWatch$: Subject<any> = new Subject<any>();
  mobileWatch$: Subject<any> = new Subject<any>();
  captchaWatch$: Subject<any> = new Subject<any>();

  subSubscription: Subscription;
  regSubscription: Subscription;

  @ViewChild(CaptchaComponent)
  captchaRef: CaptchaComponent;

  // 表单模型
  /*  value 改变才会触发变更 */
  createForm(){
    this.form = this.fb.group({
      nickname: [
        '',
        {
          updateOn: 'blur',
          validators: [
            this.checkNicknamePattern,
          ],
          asyncValidators: [
            this.checkNicknameExisted,
          ]
        }
      ],
      mobilePrefix: [
        86,
        [
          Validators.required
        ]
      ],
      mobile: [
        '',
        {
          updateOn: 'blur',
          validators: [
            Validators.pattern(PHONE_REG),
          ],
          asyncValidators: this.checkMobileExisted,
        }
      ],
      password: [
        '',
        {
          updateOn: 'blur',
          validators: [
            this.checkPassword,
          ],
        }
      ],
      confirm: [
        '',
        {
          updateOn: 'blur',
          validators: [
            this.checkConfirm,
          ],
        },
      ],
      captcha: [
        '',
        [
          Validators.required
        ]
      ],
      agree: [
        false,
        [
          Validators.required
        ]
      ]
    })
  }

  // 自定义验证器（通过返回null， 不通过返回错误对象）
  checkNicknamePattern = (control: FormControl): ValidationErrors => {
    if(!control || !control.value) return null;
    // 用户名仅支持中英文、数字和下划线,且不能为纯数字(汉字两个字节)
    const isMapType = (str) => {
      return NAME_TYPE_REG.test(str);
    };
    const isMapLen = (str: string, limit: {[key: string]: any} = { min:4,max:14 }) => {
      let len = 0;
      for(let i=0; i<str.length; i++){
        if(CN_REG.test(str.charAt(i))){
          len += 2;
        }else{
          len++
        }
      }
      return len >= limit.min && len <= limit.max;
    };
    const v = control.value;
    if(!isMapType(v)) return { pattern: true };
    if(!isMapLen(v)) return { length: true };
    return null;
  };

  checkNicknameExisted = (control: FormControl): Observable<ValidationErrors> => Observable.create((observer: Observer<ValidationErrors>) => {
    /* 此处必须 */
    if( !control.dirty ) return;
    const data = {
      nickname: control.value
    };
    this.utilsHttp.checkNickname(data)
      .subscribe(v => {
        console.info(v);
        if((<any>v).isIllegal){
          observer.next({ illegal: true });
        }else if((<any>v).isExists){
          observer.next({ existed: true });
        }else{
          observer.next(null);
        }
        this.nameWatch$.next(true);
        observer.complete();
      })
  });

  checkMobileExisted = (control: FormControl): Observable<ValidationErrors> => Observable.create((observer: Observer<ValidationErrors>) => {
    /* 此处必须 */
    if( !control.dirty ) return;
    const data = {
      mobilePrefix: control.parent.get('mobilePrefix').value,
      mobile: control.value
    };
    this.utilsHttp.checkMobile(data)
      .subscribe(v => {
        console.info(v);
        if((<any>v).isExists){
          observer.next({ existed: true });
        }else{
          observer.next(null);
        }
        this.mobileWatch$.next(true);
        observer.complete();
      })
  });

  checkPassword = (control: FormControl): ValidationErrors => {
    if(!control || !control.parent) return null;
    const v = control.value;
    this.visible = !!v;
    this.checkStrength(v);
    const limit = {
      min: 6,
      max: 12
    };
    if(!v) return null;
    if(!PASSWORD_REG.test(v)) return { pattern: true };
    if(v.length < limit.min || v.length > limit.max) return { length: true };

    // 监测确认密码
    const confirmCtrl = control.parent.get('confirm');
    if(confirmCtrl.dirty){
      confirmCtrl.markAsDirty();
      confirmCtrl.updateValueAndValidity();
    }
    return null;
  };

  checkStrength = (str: string) => {
    if(PASSWORD_STRONG_REG.test(str)){
      this.status = 'ok';
    }else if(PASSWORD_NORMAL_REG.test(str)){
      this.status = 'pass';
    }else{
      this.status = 'pool';
    }
    if(this.visible){
      this.progress = str.length * 10 > 100 ? 100 : str.length * 10;
    }
  };

  checkConfirm = (control: FormControl): ValidationErrors => {
    if(!control || !control.parent || control.pristine) return null;
    const passwordCtrl = control.parent.get('password');
    // 注意：必须判断是否有值，否则多个错误反馈同时出现。
    if(control.value && control.value !== passwordCtrl.value) return { equal: true };
  };

  checkCaptcha = (control: AbstractControl): boolean =>{
    // 检测短信验证码有效性
    if(this.message.code === Number(control.value) && this.message.code !== -1){
      /*  默认：三分钟内有效 */
      if(RegisterComponent.validateCaptcha(this.message.timestamp)){
        this.error = ZN_CAPTCHA_EXPIRED;
        this.captcha.setErrors({ expired: true });
        return false;
      }
      return true;
    }else{
      this.error = this.message.code === -1 ? ZN_CAPTCHA_NOT_GET: ZN_CAPTCHA_ERROR;
      this.captcha.setErrors({ wrong: true });
      return false;
    }
  };

  static triggerValidate( ret: AbstractControl | Array<AbstractControl>){
    if(ret instanceof AbstractControl){
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

  private resetSubState(){
    if(this.subSubscription) this.subSubscription.unsubscribe();
    this.loading = false;
  }

  private resetRegState(){
    if(this.regSubscription) this.regSubscription.unsubscribe();
  }

  private httpRegister(){
    this.regSubscription = this.userHttp.register(this.form.value).subscribe(
      v => {
        console.info(v);
        this.resetSubState();
        this.form.reset({
          mobilePrefix: this.mobilePrefix.value
        });
        this.captchaRef.reset(true);
        this.resetRegState();
        this.router.navigate(['../login'], { relativeTo: this.routeInfo });
      },
      error => this.resetRegState(),
      () => this.resetRegState()
    );
  }

  submitFrom(){
    this.loading = true;
    this.subSubscription = zip(this.nameWatch$, this.mobileWatch$)
      .pipe(
        delay(30) // 必须：valid状态变更
      )
      .subscribe(
        v => {
          if (!this.form.valid) {
            this.resetSubState();
            return
          }
          if(!this.checkCaptcha(this.captcha)){
            this.resetSubState();
            return
          }
          this.httpRegister();
          this.resetSubState();
        },
        error => this.resetSubState(),
        () => this.resetSubState()
      );
  }

  getCaptcha(): Observable<Object>{
    if(this.mobile.untouched) RegisterComponent.triggerValidate([this.mobilePrefix, this.mobile]);
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
          return this.utilsHttp.getRegisterCaptcha(data)
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

  handleCDK(){
    this.timeout$ = setTimeout(() => {
      this.visible = false;
      clearTimeout(this.timeout$)
    }, 10);
  }

  handleConfirmBlur(){
   if(this.password.hasError('required')){
     this.password.markAsDirty();
     this.password.updateValueAndValidity();
   }
  }

  handleSubmit(){
    RegisterComponent.triggerValidate(Object.values(this.form.controls).filter(item => item.dirty !== true));
    this.error = '';
    this.visible = false;
    if(this.form.invalid || !this.agree.value) return;
    this.submitFrom()
  }

  loadRegionPrefix(){
    this.prefix$ = this.utilsHttp.getRegionPrefix().pipe(
      map((v) => {
        return (<any>v).data
      })
    );
  }

  ngOnInit() {
    this.loadRegionPrefix();
    this.createForm();
  }

  ngOnDestroy(){
    if (this.timeout$) clearTimeout(this.timeout$);
    this.subSubscription && this.subSubscription.unsubscribe();
  }

  // 读取器
  get nickname(){
    return this.form.get('nickname');
  }
  get mobilePrefix(){
    return this.form.get('mobilePrefix');
  }
  get mobile(){
    return this.form.get('mobile');
  }
  get password(){
    return this.form.get('password');
  }
  get confirm(){
    return this.form.get('confirm');
  }
  get captcha(){
    return this.form.get('captcha');
  }
  get agree(){
    return this.form.get('agree');
  }

}
