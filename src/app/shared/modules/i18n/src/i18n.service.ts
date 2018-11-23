import { Injectable, Inject, OnInit, Injector } from '@angular/core';
import { Observable, BehaviorSubject, of, zip, combineLatest } from 'rxjs';
import { tap, catchError, map, mergeMap, shareReplay, filter, share } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { ZN_I18N_CONFIG_TOKEN } from './interface';
import { I18nConfig } from './config';

/*
* 注意：如果已设 setTranslation 则，use 不会去加载翻译文件
* */

@Injectable()
export class I18nService{
  constructor(
    public translateService: TranslateService,
    @Inject(ZN_I18N_CONFIG_TOKEN) private options: I18nConfig,
  ){}

  private initial: boolean = false;
  private _defaultLang: string = this.options.lang || this.getBrowserLang();
  private _lang: string = this._defaultLang;
  private _change$: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  private _translator$: any;

  get lang(){
    return this._lang;
  }
  get langs(){
    return this.options.langs
  }
  get change$(){
    return combineLatest(this._change$.asObservable(), this._translator$).pipe(share())
  }

  use(lang: string): Observable<any>{
    lang = lang || this._defaultLang;
    if(!this.initial){
      this.initial = true;
    }else{
      if(lang === this._lang){
        return of(null)
      }
    }
    this._translator$ = this.translateService.use(lang).pipe(share());
    this._translator$.subscribe(() => {
      this._lang = lang;
      this._change$.next(lang);
    });
    return this._translator$
  }

  translate(key: string){
    return this.translateService.instant(key);
  }

  // 代理 Properties
  currentLang = this.translateService.currentLang;
  currentLoader = this.translateService.currentLoader;
  onLangChange = this.translateService.onLangChange;
  onTranslationChange = this.translateService.onTranslationChange;
  onDefaultLangChange = this.translateService.onDefaultLangChange;

  // 代理 Methods
  setDefaultLang(lang: string){
    this.translateService.setDefaultLang(lang || this._defaultLang)
  }
  getDefaultLang(): string{
    return this.translateService.getDefaultLang() || this._defaultLang;
  }
  getTranslation(lang: string): Observable<any>{
    return this.translateService.getTranslation(lang);
  };
  setTranslation(lang: string, translations: Object, shouldMerge: boolean = false){
    this.translateService.setTranslation(lang, translations, shouldMerge)
  };
  addLangs(langs: Array<string>){
    this.translateService && this.translateService.addLangs(langs);
  }
  getLangs(){
    return this.translateService.getLangs();
  }
  get(key: string|Array<string>, interpolateParams?: Object): Observable<string|Object>{
    return this.translateService.get(key, interpolateParams);
  }
  stream(key: string|Array<string>, interpolateParams?: Object): Observable<string|Object>{
    return this.translateService.stream(key, interpolateParams);
  }
  instant(key: string|Array<string>, interpolateParams?: Object): string|Object{
    return this.translateService.instant(key, interpolateParams)
  }
  set(key: string, value: string, lang?: string){
    return this.translateService.set(key, value, lang)
  }
  reloadLang(lang: string): Observable<string|Object>{
    return this.translateService.reloadLang(lang)
  }
  resetLang(lang: string){
    return this.translateService.resetLang(lang)
  }
  getBrowserLang(): string | undefined{
    return this.translateService.getBrowserLang()
  }
  getBrowserCultureLang(): string | undefined{
    return this.translateService.getBrowserCultureLang()
  }
}
