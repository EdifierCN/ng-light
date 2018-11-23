import { Component, OnInit, Inject } from '@angular/core';
import { SettingService, ZN_SETTING_SERVICE_TOKEN } from '@shared/modules/setting';
import { I18nService, ZN_I18N_SERVICE_TOKEN } from '@shared/modules/i18n';

@Component({
  selector: 'app-passport',
  templateUrl: './passport.component.html',
  styleUrls: ['./passport.component.less']
})
export class LayoutPassportComponent implements OnInit {

  constructor(
    @Inject(ZN_I18N_SERVICE_TOKEN) private i18nService: I18nService,
    @Inject(ZN_SETTING_SERVICE_TOKEN) private settingService: SettingService
  ) {}

  get appName(){
   return this.settingService.app.nameI18n[this.i18nService.lang];
  }

  ngOnInit() {

  }
}
