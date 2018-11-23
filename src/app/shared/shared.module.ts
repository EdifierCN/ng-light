import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule, RouteReuseStrategy } from '@angular/router';

/* NG-ZORRO */
import { NgZorroAntdModule } from 'ng-zorro-antd';

/* 插件 */
import { SortablejsModule } from 'angular-sortablejs';

/* 国际化 */
import { TranslateModule } from '@ngx-translate/core';

/* 组件 */
import { CaptchaComponent } from './components/captcha';

/*  测试 */
import { AppTestComponent } from './components/app-test/app-test.component';

/* 指令 */
import { InputBanSpaceDirective, InputNumberOnly, InputFocusDirective, InputRequiredDirective } from './directives/input';
import { DragDirective } from './directives/drag';


const CommonModules = [
  CommonModule,
  RouterModule,
  FormsModule,
  ReactiveFormsModule,
];

const ThirdModules = [
  NgZorroAntdModule,
  TranslateModule,
  SortablejsModule,
];

const MyModules = [];

const MyComponents = [
  CaptchaComponent,
  AppTestComponent
];

const MyDirectives = [
  InputBanSpaceDirective,
  InputFocusDirective,
  InputNumberOnly,
  InputRequiredDirective,
  DragDirective,
];

const MyPipes = [];

@NgModule({
  imports: [
    ...CommonModules,
    ...ThirdModules,
    ...MyModules
  ],
  declarations: [
    ...MyComponents,
    ...MyDirectives,
    ...MyPipes,
  ],
  exports: [
    ...CommonModules,
    ...ThirdModules,
    ...MyComponents,
    ...MyDirectives,
    ...MyPipes,
  ]
})
export class SharedModule {}
