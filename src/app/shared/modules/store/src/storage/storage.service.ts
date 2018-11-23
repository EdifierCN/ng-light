import { Injectable, Inject } from '@angular/core';
import { StorageOptionModel, StorageServiceModel, StoreType, DateType, ZN_STORAGE_CONFIG_TOKEN } from './interface';
import { StorageConfig } from './config';

const _maxExpireDate = new Date('Fri, 31 Dec 9999 23:59:59 UTC');
const PREFIX = 'd';   // 默认按天

const _extend = (source, target) => {
  return Object.assign({}, source, target);
};

const _validateKey = (key: string): void => {
  if(!key || typeof key !== "string" || (typeof key === "string" && key.trim() === '')){
    throw new Error('key is missing or not a string!')
  }
};

const jString = JSON.stringify;
const jParse = JSON.parse;
const encode = encodeURIComponent;
const decode = decodeURIComponent;

const CacheAPI = {
  set: function (key, value, options) {},
  get: function (key) {},
  remove: function (key) {},
  removeAllExpires: function() {},
  add: function (key, options) {},
  update: function (key, value, options) {},
  touch: function (key, exp) {},
  clear: function () {},
};

class StorageItem {
  constructor(value, exp){
    this.c = new Date().getTime();
    this.e = StorageService.transformDateToMs(exp === Infinity ? _maxExpireDate : exp);
    this.v = encode(value);
  }
  c: number;
  e: number;
  v: string;
}

const _isQuotaExceeded = (e): boolean => {
  let quotaExceeded = false;
  if (e) {
    if (e.code) {
      switch (e.code) {
        case 22:
          quotaExceeded = true;
          break;
        case 1014:
          // Firefox
          if (e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
            quotaExceeded = true;
          }
          break;
      }
    } else if (e.number === -2147024882) {
      // Internet Explorer 8
      quotaExceeded = true;
    }
  }
  return quotaExceeded;
};

const _isCacheItem = (item: any): boolean =>{
  if (typeof item !== 'object') {
    return false;
  }
  if(item) {
    if('c' in item && 'e' in item && 'v' in item) {
      return true;
    }
  }
  return false;
};

const _checkCacheItemIfEffective = (cacheItem: StorageItem) => {
  let timeNow = new Date().getTime();
  return timeNow < cacheItem.e;
};

@Injectable()
export class StorageService implements StorageServiceModel {

  constructor(
    @Inject(ZN_STORAGE_CONFIG_TOKEN) private options: StorageConfig
  ){
    const expires = this.options.expires;
    if(expires && typeof expires !== 'number' && Object.prototype.toString.call(expires) !== '[object Date]'){
      throw new Error('Constructor `expires` parameter cannot be converted to a valid Date instance');
    }
    const storage = StorageService.getInstance(this.options.storage);
    this.isSupported = StorageService.isSupport(storage);

    if(this.isSupported){
      this.storage = storage;
      this.quotaExceedHandler = function (key, val, options) {
        console.warn('Quota exceeded!');
        if (options && options.force === true) {
          let deleteKeys = this.removeAllExpires();
          console.warn('delete all expires CacheItem : [' + deleteKeys + '] and try execute `set` method again!');
          try {
            options.force = false;
            this.set(key, val, options);
          } catch (err) {
            console.warn(err);
          }
        }
      };
    }else{
      _extend(this, CacheAPI);
    }
  }

  private quotaExceedHandler: any;
  private isSupported: boolean;
  private storage: Storage;

  static getInstance(storage: StoreType): Storage{
    if(typeof storage === 'string' && window[storage] instanceof Storage){
      return window[storage];
    }
    throw new Error('storage instance is not existed!')
  }
  static isSupport(storage: Storage): boolean{
    let supported = false;
    if (storage && (<Storage>storage).setItem ) {
      supported = true;
      let key = '__' + Math.round(Math.random() * 1e7);
      try {
        (<Storage>storage).setItem(key, key);
        (<Storage>storage).removeItem(key);
      } catch (err) {
        supported = false;
      }
    }
    return supported;
  }
  static transformDateToMs(date: DateType, prefix: string = PREFIX){
    const now = Date.now();
    let d = date;

    if(typeof d === 'number'){
      d = prefix + date
    }

    if(typeof d === 'string'){
      const isMap = /^([smhd])(\d+)$/.test(d);
      if(isMap){
        const desc: string = RegExp.$1;
        const time: any =  RegExp.$2;
        switch (desc.toLowerCase()){
          case 's':
            d = time * 1000;
            break;
          case 'm':
            d = time * 60 * 1000;
            break;
          case 'h':
            d = time * 60 * 60 * 1000;
            break;
          case 'd':
            d = time * 24 * 60 * 60 * 1000;
            break;
          default:
            throw new Error('the expires must be start width s|m|h|d!');
        }
      }else{
        throw new Error('date format error!');
      }
      d = (new Date()).setTime(now + d);
    }

    if(d instanceof Date){
      return d.getTime();
    }else{
      throw new Error('date format error!');
    }
  }

  set(key:string, value: any, options?: StorageOptionModel){
    _validateKey(key);

    let opts = this.options;
    if(options){
      opts = _extend(opts, options)
    }

    if(typeof value === "undefined"){
      return this.remove(key);
    }

    let value_str = jString(value);
    const cacheItem = new StorageItem(value_str, opts.expires);

    try{
      this.storage.setItem(key, jString(cacheItem));
    }catch(e){
      if (_isQuotaExceeded(e)) {
        //data wasn't successfully saved due to quota exceed so throw an error
        this.quotaExceedHandler(key, value_str, opts, e);
      } else {
        console.error(e);
      }
    }
    return value;
  }

  get(key: string){
    _validateKey(key);
    let cacheItem = null;

    try{
      cacheItem = jParse(this.storage.getItem(key));
      cacheItem.v = decode(cacheItem.v);
    }catch(e){
      return null;
    }
    if(_isCacheItem(cacheItem)){
      if(_checkCacheItemIfEffective(cacheItem)) {
        let value = cacheItem.v;
        return jParse(value);
      } else {
        this.remove(key);
      }
    }
    return null;
  }

  remove(key: string){
    _validateKey(key);

    try {
      this.storage.removeItem(key);
    }catch (e){
      return false
    }
    return true
  }

  /* 存在且未失效，更新数据 */
  update(key: string, value: any, options?: StorageOptionModel){
    _validateKey(key);

    let cacheItem = null;
    try{
      cacheItem = jParse(this.storage.getItem(key));
      cacheItem.v = decode(cacheItem.v);
    }catch(e){
      return false;
    }
    if(_isCacheItem(cacheItem)){
      if(_checkCacheItemIfEffective(cacheItem)) {
        this.set(key, value, options);
        return true;
      } else {
        this.remove(key);
      }
    }
    return false;
  }

  /* 存在且未失效，延期 */
  touch(key: string, expires: DateType){
    _validateKey(key);

    let cacheItem = null;
    try{
      cacheItem = jParse(this.storage.getItem(key));
      cacheItem.v = decode(cacheItem.v);
    }catch(e){
      return false;
    }
    if(_isCacheItem(cacheItem)){
      if(_checkCacheItemIfEffective(cacheItem)) {
        this.set(key, this.get(key), {expires: expires});
        return true;
      } else {
        this.remove(key);
      }
    }
    return false;
  }

  /* 不存在或已失效,添加 */
  add(key: string, value: any, options?: StorageOptionModel){
    _validateKey(key);
    try {
      let cacheItem = jParse(this.storage.getItem(key));
      cacheItem.v = decode(cacheItem.v);
      if (!_isCacheItem(cacheItem) || !_checkCacheItemIfEffective(cacheItem)) {
        this.set(key, value, options);
        return true
      }
    } catch (e) {
      this.set(key, value, options);
      return true
    }
  }

  removeAllExpires(){
    let length = this.storage.length;
    let deleteKeys = [];
    const _this = this;
    for (let i = 0; i < length; i++) {
      let key = this.storage.key(i);
      let cacheItem = null;
      try {
        cacheItem = jParse(this.storage.getItem(key));
        cacheItem.v = decode(cacheItem.v);
      } catch (e) {}

      if(_isCacheItem(cacheItem)) {
        let timeNow = (new Date()).getTime();
        if(timeNow >= cacheItem.e) {
          deleteKeys.push(key);
        }
      }
    }
    deleteKeys.forEach(function(key) {
      _this.remove(key);
    });
    return deleteKeys;
  }

  clear(){
    try{
      this.storage.clear();
    }catch(e){
      return false
    }
    return true
  }
}


// 默认为localStorage，新建sessionStorage factory
export const SessionStorageFactory = () => {
  /* 注意若使用 deps 获取的config是注入器中的实例，而不是新创建 */
  return new StorageService(Object.assign(new StorageConfig(), {storage: 'sessionStorage'}))
};
