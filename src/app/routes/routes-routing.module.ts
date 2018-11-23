import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { environment } from '@env/environment';
import { ZN_ACL_GUARD_TOKEN } from '@shared/modules/acl'

import { LayoutDefaultComponent } from '../layout/default/default.component';
import { LayoutFullScreenComponent } from '../layout/fullscreen/fullscreen.component';
import { LayoutPassportComponent } from '../layout/passport/passport.component';

import { I18nComponent } from './dashboard/i18n/i18n.component';
import { DynamicComponent } from './dashboard/dynamic/dynamic.component';
import { AnimationComponent } from './dashboard/animation/animation.component';
import { NgrxComponent } from './dashboard/ngrx/ngrx.component';
import { RxjsComponent } from './dashboard/rxjs/rxjs.component';

import { LoginComponent } from './passport/login/login.component';
import { RegisterComponent } from './passport/register/register.component';

import { Exception403Component } from './exception/403.component';
import { Exception404Component } from './exception/404.component';
import { Exception500Component } from './exception/500.component';
import { CallbackComponent } from './callback/callback.component';

/*
  role_1 普通会员
  role_2 VIP 客户
* */

// router
const routes: Routes = [{
  path: '',
  component: LayoutDefaultComponent,
  canActivateChild: [ZN_ACL_GUARD_TOKEN],
  children: [{
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },{
    path: 'dashboard',
    data: {
      breadcrumb: 'dashboard',
    },
    children: [{
      path: '',
      redirectTo: 'i18n',
      pathMatch: 'full'
    },{
      path: 'i18n',
      component: I18nComponent,
      data: {
        breadcrumb: 'i18n',
        animation: 'I18nPage',
        title: 'i18n',
        titleI18n:{
          'zh-CN': 'i18n',
          'en-US': 'i18n'
        },
        guard: {
          role: ['role_1']
        },
        scroll: {
          zIndex: 1,
          restore: false
        }
      },
    },{
      path: 'dynamic',
      component: DynamicComponent,
      data: {
        breadcrumb: 'dynamic',
        animation: 'DynamicPage',
        title: 'dynamic',
        titleI18n:{
          'zh-CN': 'dynamic',
          'en-US': 'dynamic'
        },
        guard: {
          role: ['role_1']
        },
        scroll: {
          zIndex: 1,
          restore: false
        }
      },
    },{
      path: 'animation',
      component: AnimationComponent,
      data: {
        breadcrumb: 'animation',
        animation: 'AnimationPage',
        title: 'animation',
        titleI18n:{
          'zh-CN': 'animation',
          'en-US': 'animation'
        },
        guard: {
          role: ['role_1']
        },
        scroll: {
          zIndex: 1,
          restore: false
        }
      }
    },{
      path: 'ngrx',
      component: NgrxComponent,
      data: {
        breadcrumb: 'ngrx',
        title: 'ngrx',
        titleI18n:{
          'zh-CN': 'ngrx',
          'en-US': 'ngrx'
        },
        guard: {
          role: ['role_1']
        },
        scroll: {
          zIndex: 1,
          restore: false
        }
      }
    },{
      path: 'rxjs',
      component: RxjsComponent,
      data: {
        breadcrumb: 'rxjs',
        title: 'ngrx',
        titleI18n:{
          'zh-CN': 'rxjs',
          'en-US': 'rxjs'
        },
        guard: {
          role: ['role_1']
        },
        scroll: {
          zIndex: 1,
          restore: false
        }
      }
    }]
  },{
  path: 'plugins',
  data: {
    breadcrumb: 'plugins',
  },
  loadChildren: './plugins/plugins.module#PluginsModule',   // 特性模块
 }]
},{
  path: 'fullscreen',
  component: LayoutFullScreenComponent
},{
  path: 'passport',
  component: LayoutPassportComponent,
  children: [{
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },{
    path: 'login',
    component: LoginComponent,
    data: {
      title: '登录',
      titleI18n:{
        'zh-CN': '登录',
        'en-US': 'login'
      },
    }
  },{
    path: 'register',
    component: RegisterComponent,
    data: {
      title: '注册',
      titleI18n:{
        'zh-CN': '注册',
        'en-US': 'register'
      },
    }
  }]
},{
  path: 'callback/:type',
  component: CallbackComponent,
  data: {
    title: '反馈',
    titleI18n:{
      'zh-CN': '反馈',
      'en-US': 'callback'
    },
  }
},{
  path: '403',
  component: Exception403Component,
  data: {
    title: '403',
    titleI18n: '403'
  }
},{
  path: '404',
  component: Exception404Component,
  data: {
    title: '404',
    titleI18n: '404'
  }
},{
  path: '500',
  component: Exception500Component,
  data: {
    title: '500',
    titleI18n: '500'
  }
},{
  path: '**',
  redirectTo: 'dashboard'
}];


const CommonModules = [
  RouterModule.forRoot(routes, { useHash: environment.useHash, scrollPositionRestoration: 'enabled' }),
];

@NgModule({
  imports: [
    ...CommonModules,
  ],
  exports: [RouterModule]
})
export class RoutesRoutingModule { }
