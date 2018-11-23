import { Injectable, Inject } from '@angular/core';
import { CookieOptionsModel, PREFIX, CacheApi, ZN_COOKIE_CONFIG_TOKEN } from './interface';
import { CookieConfig } from './config';

const jString = JSON.stringify;
const jParse = JSON.parse;
const decode = decodeURIComponent;
const encode = encodeURIComponent;

const _isNonEmptyString = (str: any):boolean => {
  return typeof str === 'string' && str.trim() !== ''
};

const _validateCookieName = (name) => {
  if (!_isNonEmptyString(name)) {
    throw new TypeError('Cookie name must be a non-empty string');
  }
};

const isJson = (str: string):boolean => {
  if (typeof str == 'string') {
    try {
      const obj = jParse(str);
      return typeof obj == 'object' && obj;
    } catch(e) {
      return false;
    }
  }
  console.warn('It is not a string!')
};


@Injectable()
export class CookieService {
  constructor(
    @Inject(ZN_COOKIE_CONFIG_TOKEN) private options: CookieConfig
  ){
    if(!CookieService.isSupport){
      Object.assign({}, this, CacheApi)
    }
  }

  static isSupport(){
    if(!navigator.cookieEnabled){
      console.warn('please enable cookie!');
      return false
    }
    return true
  };
  static transformDateToMs(str: string):number{
    const isMap = /^([smhd])(\d+)$/.test(str);
    if(isMap){
      const desc: string = RegExp.$1 ? RegExp.$1 : '';
      const time: any =  RegExp.$2;
      switch (desc.toLowerCase()){
        case 's':
          return time * 1000;
        case 'm':
          return time * 60 * 1000;
        case 'h':
          return time * 60 * 60 * 1000;
        case 'd':
          return time * 24 * 60 * 60 * 1000;
        default:
          throw new Error('the expires must be start width s|m|h|d.');
      }
    }else{
      throw new Error('date error!');
    }
  }

  set(name: string, value: any, extra?: CookieOptionsModel): string{
    _validateCookieName(name);
    const opts = Object.assign({}, this.options, extra);
    const expires = opts['expires'];
    const domain = opts['expires'];
    const path = opts['expires'];
    let content: string = '';

    // value
    if(opts['raw']){
      value = encode(jString(value));
    }
    content = name + '=' + jString(value);

    // expires
    let date = expires;
    if(typeof expires === "number"){
      if(date === 0){
        date = (new Date).setDate(Date.now() - 1);
      }else if(date > 0){
        date = (new Date).setTime(Date.now() + CookieService.transformDateToMs(PREFIX + expires));
      }else{
        date = ''
      }
    }else if(typeof expires === 'string'){
      date = (new Date).setTime(Date.now() + CookieService.transformDateToMs(expires));
    }
    if(date instanceof Date){
      content += '; expires=' + date.toUTCString();
    }

    // domain
    if(_isNonEmptyString(domain)){
      content += '; domain=' + domain;
    }

    // path
    if (_isNonEmptyString(path)) {
      content += '; path=' + path;
    }

    // secure
    if (opts['secure']) {
      content += '; secure';
    }

    document.cookie = content;
    return content;
  }

  get(name: string): any{
    _validateCookieName(name);

    const opts = this.options;
    const cookies = document.cookie;
    const CookReg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    let arr = [];

    if(arr = cookies.match(CookReg)){
      let result = arr[2];
      if(opts['raw']){
        return jParse(decode(result))
      }else if(isJson(result)){
        return jParse(result)
      }else{
        return result
      }
    }else{
      return null
    }
  };

  remove(name: string){
    this.set(name, '', { expires: 0 })
  }

  clear() {
    const keys = document.cookie.match(/[^ =;]+(?=\=)/g);
    if (keys) {
      keys.forEach((item) => {
        this.remove(item);
      });
    }
  }
}
