import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CacheService, ZN_CACHE_SERVICE_TOKEN } from '@shared/modules/cache';
import { ACCOUNT_NICKNAME, ACCOUNT_PHONE, ACCOUNT_CAPTCHA, REGION_PREFIX } from '@services/apis';

@Injectable()
export class UtilsHttp {
  constructor(
    private http: HttpClient,
    @Inject(ZN_CACHE_SERVICE_TOKEN) private cache: CacheService,
  ){}

  checkNickname(value: { nickname: string }){
    return this.http.post(ACCOUNT_NICKNAME, value)
  }

  checkMobile(value: { mobilePrefix: string, mobile: string }){
    return this.http.post(ACCOUNT_PHONE, value)
  }

  getLoginCaptcha(value: { prefix: string, mobile: string }){
    return this.http.post(ACCOUNT_CAPTCHA, value)
  }

  getRegisterCaptcha(value: { prefix: string, mobile: string }){
    return this.http.post(ACCOUNT_CAPTCHA, value)
  }

  getRegionPrefix(){
    return this.cache.get(REGION_PREFIX)
  }
}
