import { Injectable, Inject } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { share } from 'rxjs/operators';
import { AuthModel, AuthServiceModel, ZN_AUTH_CONFIG_TOKEN } from './interface';
import { AuthConfig } from './config';
import { StorageService, ZN_STORAGE_SERVICE_TOKEN } from '@shared/modules/store';


@Injectable()
export class AuthService implements AuthServiceModel{
  constructor(
    @Inject(ZN_AUTH_CONFIG_TOKEN) private options: AuthConfig,
    @Inject(ZN_STORAGE_SERVICE_TOKEN) private store: StorageService
  ){}

  private _change$: BehaviorSubject<AuthModel>= new BehaviorSubject<AuthModel>(null);
  private _redirect: string;

  get login_url():string{
    return this.options.login_url;
  }
  get redirect():string{
    return this._redirect || '/'
  }
  get change$(){
    return this._change$.pipe(share())
  }

  setRedirect(value: string){
    this._redirect = value || '/';
  }
  set(value: AuthModel):void{
    this.store.set(this.options.store_key, value);
    this._change$.next(value);
  }
  get<T extends AuthModel>(type?: { new():T }):T{
    const data = this.store.get(this.options.store_key);
    return type ? (Object.assign(new type(), data) as T) : (data as T);
  }
  clear():void{
    this.store.remove(this.options.store_key);
    this._change$.next(null);
  }
}
