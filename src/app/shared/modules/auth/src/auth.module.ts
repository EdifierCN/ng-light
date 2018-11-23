import { NgModule, ModuleWithProviders } from '@angular/core';
import { AuthService } from './auth.service';
import { SocialService } from './social.service';
import { AuthConfig, SocialConfig } from './config';
import { ZN_AUTH_SERVICE_TOKEN, ZN_SOCIAL_SERVICE_TOKEN, ZN_AUTH_CONFIG_TOKEN, ZN_SOCIAL_CONFIG_TOKEN } from './interface';


const MyServices = [{
  provide: ZN_AUTH_CONFIG_TOKEN,
  useClass: AuthConfig
},{
  provide: ZN_AUTH_SERVICE_TOKEN,
  useClass: AuthService
},{
  provide: ZN_SOCIAL_CONFIG_TOKEN,
  useClass: SocialConfig
},{
  provide: ZN_SOCIAL_SERVICE_TOKEN,
  useClass: SocialService
}];
const MyDirectives = [];


@NgModule({
  declarations: [
    ...MyDirectives
  ],
  exports: [
    ...MyDirectives
  ]
})
export class AuthModule {
  static forRoot(): ModuleWithProviders{
    return {
      ngModule: AuthModule,
      providers: [
        ...MyServices
      ]
    }
  }
  static forChild(): ModuleWithProviders{
    return {
      ngModule: AuthModule,
    }
  }
}
