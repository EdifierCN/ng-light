import { NgModule, CUSTOM_ELEMENTS_SCHEMA, APP_INITIALIZER, TRANSLATIONS, TRANSLATIONS_FORMAT, LOCALE_ID, MissingTranslationStrategy } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { RouterModule } from '@angular/router';

/*
 BrowserModule 提供了启动和运行浏览器应用的那些基本的服务提供商,
 还从 @angular/common 中重新导出了 CommonModule.
 其它任何模块中都不要导入BrowserModule
* */
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
/*
 纯服务模块没有公开（导出）的声明，
 所以不用重新导出 HttpClientModule，
 唯一的用途是一起把 http 的那些服务提供商添加到应用中。
* */
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';

import { LayoutModule } from '@layout/layout.module';
import { RoutesModule } from '@routes/routes.module';

/* 全局服务模块 */
import { StorageModule } from '@shared/modules/store';
import { CacheModule } from '@shared/modules/cache';
import { AclModule } from '@shared/modules/acl';
import { AuthModule } from '@shared/modules/auth';
import { I18nModule } from '@shared/modules/i18n';
import { MenuModule } from '@shared/modules/menu';
import { SettingModule } from '@shared/modules/setting';
import { TitleModule } from '@shared/modules/title';
import { ScrollModule } from '@shared/modules/scroll';
import { ReuseModule } from '@shared/modules/reuse';

/* 启动 */
import { AppComponent } from './app.component';

/* 初始化 */
import { StartupService } from '@core/startup/startup.service';
import { InitialService } from '@core/startup/initial.service';
import { DefaultInterceptor } from '@core/net/default.interceptor';
import { PrimaryInterceptor } from '@shared/modules/auth';


/* 国际化：全局配置（angular 自身的国际化支持 和 ng-zorro。注意：ng-zorro部分组件依赖于前者） */
/* 关键：ng-zorro 提供了一个服务 NzI18nService 用于动态修改国际化文案。this.nzI18nService.setLocale(en_US); */
import { LOCALE_LANGUAGE } from '@core/i18n/i18n.config';

/* 国际化：angular */
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import en from '@angular/common/locales/en';
registerLocaleData(LOCALE_LANGUAGE === 'zh-CN' ? zh : en, LOCALE_LANGUAGE);

/* 国际化：ng-zorro */
import { NZ_I18N, zh_CN, en_US } from 'ng-zorro-antd';
const ThirdLocales = [{
  provide: NZ_I18N,
  useValue: LOCALE_LANGUAGE === 'zh-CN' ? zh_CN : en_US,
}];

/* 国际化：ngx-translate 用于ts 动态文案翻译 */
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader((<any>http), './assets/i18n/', '.json');
}

/* APP Initial */
const InitialServiceFactory = (initialService: InitialService): Function => () => initialService.setup();
const StartServiceFactory = (startupService: StartupService): Function => () => startupService.setup();

/* 插件 */
import { SortablejsModule } from 'angular-sortablejs';


import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule, RouterStateSerializer } from '@ngrx/router-store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '@env/environment'
import { reducers, metaReducers } from '@store';
import { CustomSerializer } from '@store/router-serializer';
import { ArticleEffects } from  '@store/article';

const staticState = {};
const dynamicState = {};
function getInitialState(){
  return {
    ...staticState,
    ...dynamicState
  }
}


/* Http 服务 */
import { SetupHttp } from '@services/setup';
import { ArticleHttp } from '@services/article';
import { UserHttp } from '@services/user';
import { UtilsHttp } from '@services/utils';


const CommonModules = [
  BrowserModule,
  BrowserAnimationsModule,
  HttpClientModule,
  RouterModule,
  OverlayModule,
  StoreModule.forRoot(reducers, { metaReducers, initialState: getInitialState }),
  EffectsModule.forRoot([ ArticleEffects ]),
  StoreRouterConnectingModule.forRoot({
    serializer: CustomSerializer
  }),
  StoreDevtoolsModule.instrument({
    maxAge: 25, // Retains last 25 states
    logOnly: environment.production, // Restrict extension to log-only mode
  }),
];

const ThirdModules = [
  TranslateModule.forRoot({
    loader: {
      provide: TranslateLoader,
      useFactory: (createTranslateLoader),
      deps: [HttpClient]
    }
  }),
  SortablejsModule.forRoot({ animation: 150 }),
];

const MyModules = [
  StorageModule.forRoot(),
  CacheModule.forRoot(),
  AclModule.forRoot(),
  AuthModule.forRoot(),
  I18nModule.forRoot(),
  MenuModule.forRoot(),
  SettingModule.forRoot(),
  TitleModule.forRoot(),
  ScrollModule.forRoot(),
  ReuseModule.forRoot(),
  RoutesModule,
  LayoutModule,
];

const MyComponents = [
  AppComponent,
];

const MyInterceptors = [{
  provide: HTTP_INTERCEPTORS,
  useClass: PrimaryInterceptor,
  multi: true
},{
  provide: HTTP_INTERCEPTORS,
  useClass: DefaultInterceptor,
  multi: true
}];

const MyServices = [
  StartupService,
  {
    provide: APP_INITIALIZER,
    useFactory: StartServiceFactory,
    deps: [StartupService],
    multi: true
  },
  InitialService,
  {
    provide: APP_INITIALIZER,
    useFactory: InitialServiceFactory,
    deps: [InitialService],
    multi: true
  }
];

const MyHttpServices = [
  SetupHttp,
  ArticleHttp,
  UserHttp,
  UtilsHttp,
];


@NgModule({
  declarations: [
    ...MyComponents,
  ],
  imports: [
    ...CommonModules,
    ...ThirdModules,
    ...MyModules,
  ],
  providers: [
    ...ThirdLocales,
    ...MyInterceptors,
    ...MyServices,
    ...MyHttpServices
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
