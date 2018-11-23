import { NgModule, ModuleWithProviders } from '@angular/core';
import { ACLService } from './acl.service';
import { ACLGuard } from './acl-guard';
import { ACLConfig } from './config';
import { ZN_ACL_SERVICE_TOKEN, ZN_ACL_GUARD_TOKEN, ZN_ACL_CONFIG_TOKEN } from './interface';


const MyServices = [{
  provide: ZN_ACL_SERVICE_TOKEN,
  useClass: ACLService
},{
  provide: ZN_ACL_GUARD_TOKEN,
  useClass: ACLGuard
},{
  provide: ZN_ACL_CONFIG_TOKEN,
  useClass: ACLConfig
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
export class AclModule {
  static forRoot(): ModuleWithProviders{
    return {
      ngModule: AclModule,
      providers: [
        ...MyServices
      ]
    }
  }
  static forChild(): ModuleWithProviders{
    return {
      ngModule: AclModule,
    }
  }
}
