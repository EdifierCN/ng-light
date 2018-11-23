import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { LOGIN_NICKNAME, LOGIN_MOBILE, REGISTER } from '@services/apis';


/*
* 可控制用户操作频率
* 登入、登出的流程控制
* */

@Injectable()
export class UserHttp {
  constructor(
    private http: HttpClient
  ){}

  isFetching:boolean = false;

  // 分开，减少非必要类型判断
  nameLogin(value: { nickname: string, password: string }){
    this.isFetching = true;
    return this.http.post(LOGIN_NICKNAME, value).pipe(tap(v => this.isFetching = false))
  }

  phoneLogin(value: { phone: string, captcha: string }){
    this.isFetching = true;
    return this.http.post(LOGIN_MOBILE, value).pipe(tap(v => this.isFetching = false))
  }

  register(value: object){
    this.isFetching = true;
    return this.http.post(REGISTER, value).pipe(tap(v => this.isFetching = false))
  }

  logout(){

  }
}
