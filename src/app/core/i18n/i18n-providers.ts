import {
  LOCALE_ID,
  MissingTranslationStrategy,
  StaticProvider,
  TRANSLATIONS,
  TRANSLATIONS_FORMAT
} from '@angular/core';
import { CompilerConfig } from '@angular/compiler';
import { Observable, of } from 'rxjs';
import { LOCALE_LANGUAGE } from '@core/i18n/i18n.config'; // 自行定义配置位置

export function getTranslationProviders(): Promise<StaticProvider[]> {
  const locale = LOCALE_LANGUAGE.toString();
  const noProviders: StaticProvider[] = [];

  if (!locale) {
    return Promise.resolve(noProviders);
  }

  // Ex: 'locale/messages.zh-CN.xlf`  别忘了将locales 单独打包
  const translationFile = `./locales/messages.${locale}.xlf`;

  return getTranslationsWithSystemJs(translationFile)
    .then((translations: string) => [
      { provide: TRANSLATIONS, useValue: translations },
      { provide: TRANSLATIONS_FORMAT, useValue: 'xlf' },
      { provide: LOCALE_ID, useValue: locale },
      {
        provide: CompilerConfig,
        useValue: new CompilerConfig({ missingTranslation: MissingTranslationStrategy.Error })
      }
    ])
    .catch(() => {
      return noProviders
    })
}

declare let System: any;
// 获取locale文件
function getTranslationsWithSystemJs(file: string) {
  let text = '';
  const fileRequest = new XMLHttpRequest();
  fileRequest.open('GET', file, false);
  fileRequest.onerror = function (err) {
    console.log(err);
  };
  fileRequest.onreadystatechange = function () {
    if (fileRequest.readyState === 4) {
      if (fileRequest.status === 200 || fileRequest.status === 0) {
        text = fileRequest.responseText;
      }
    }
  };
  fileRequest.send();
  const observable = of(text);
  return observable.toPromise();
}
