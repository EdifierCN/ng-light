import { Component,Input, OnInit, Inject, ChangeDetectionStrategy } from '@angular/core';
import { SettingService, ZN_SETTING_SERVICE_TOKEN } from '@shared/modules/setting';
import { I18nService, ZN_I18N_SERVICE_TOKEN } from '@shared/modules/i18n';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.less']
})
export class FooterComponent implements OnInit {
  constructor(
    @Inject(ZN_I18N_SERVICE_TOKEN) private i18nService: I18nService,
    @Inject(ZN_SETTING_SERVICE_TOKEN) private settingService: SettingService,
  ) {}

  get appDescription(){
    return this.settingService.app.descriptionI18n[this.i18nService.lang] || this.settingService.app.description
  };

  ngOnInit() {

  }

}
