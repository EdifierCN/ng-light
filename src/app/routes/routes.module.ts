import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';

import { RoutesRoutingModule } from './routes-routing.module';

import { I18nComponent } from './dashboard/i18n/i18n.component';
import { DynamicComponent } from './dashboard/dynamic/dynamic.component';
import { AnimationComponent } from './dashboard/animation/animation.component';
import { DialogComponent } from './dashboard/dynamic/component/dialog/dialog.component';
import { NgrxComponent } from './dashboard/ngrx/ngrx.component';
import { RxjsComponent } from './dashboard/rxjs/rxjs.component';

import { LoginComponent } from './passport/login/login.component';
import { RegisterComponent } from './passport/register/register.component';

import { CallbackComponent } from './callback/callback.component';
import { Exception403Component } from './exception/403.component';
import { Exception404Component } from './exception/404.component';
import { Exception500Component } from './exception/500.component';

const MyModules = [
  SharedModule,
  RoutesRoutingModule,
];
const MyCOMPONENTS = [
  I18nComponent,
  DynamicComponent,
  AnimationComponent,
  DialogComponent,
  NgrxComponent,
  RxjsComponent,
  // passport routes
  LoginComponent,
  RegisterComponent,
  // single routes
  CallbackComponent,
  Exception403Component,
  Exception404Component,
  Exception500Component
];


@NgModule({
  imports: [
    ...MyModules,
  ],
  declarations: [
    ...MyCOMPONENTS,
  ],
  entryComponents: [DialogComponent],
})
export class RoutesModule {}
