import { enableProdMode, TRANSLATIONS, TRANSLATIONS_FORMAT, LOCALE_ID } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from '@env/environment';
import { getTranslationProviders } from '@core/i18n/i18n-providers';
import { preloader } from '@core/preloader/preloader';


if (environment.production) {
  enableProdMode();
}

/*platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));*/

/* 方式一：动态获取 xlf 文件，配置提供商 */
getTranslationProviders().then(providers => {
  const options = { providers };
  platformBrowserDynamic().bootstrapModule(AppModule, options)
    .then((res) => {
      preloader.close();
      return res
    })
    .catch(err => console.log(err))
});


/*  方式二：通过编译后，xlf文件里面的内容将添加到ts文件里面，可在 AppModule 中静态配置  */
/* PS：可使用 xml2.js 将翻译后的文件转为 json文件 */
/*const MyLocales = [{
 provide: TRANSLATIONS, useValue: translations
 },{
 provide: TRANSLATIONS_FORMAT, useValue: 'xlf'
 },{
 provide: LOCALE_ID, useValue: LOCALE_LANGUAGE
 },{
 provide: CompilerConfig,
 useValue: new CompilerConfig({ missingTranslation: MissingTranslationStrategy.Error })
 }];*/


/*
方式二： 静态导入，需要将 xlf 文件编译为ts文件再导入到main.js，余下操作如下。或在 app.module.js 中配置提供商
platformBrowserDynamic().bootstrapModule(
  AppModule,
  {providers: [
    {provide: TRANSLATIONS, useValue: TRANSLATION},
    {provide:TRANSLATIONS_FORMAT, useValue:'xlf'},
    {provide:LOCALE_ID, useValue:'fr'}
  ]});*/


/* 方式三：build不同语言版本的项目文件，通过在后端配置，根据 Accept-Language 重定向 */

