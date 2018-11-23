import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router';
import { SortableComponent } from './sortable/sortable.component';


const routes: Routes = [{
    path: '',
    redirectTo: 'sortable',
    pathMatch: 'full',
  },{
    path: 'sortable',
    component: SortableComponent,
    data:{
      breadcrumb: 'sortable',
      title: 'sortable',
      titleI18n:{
        'zh-CN': 'sortable',
        'en-US': 'sortable'
      },
      guard: {
        role: ['role_1']
      },
      scroll: {
        zIndex: 1,
        restore: false
      }
    }
  }];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ]
})
export class PluginsRoutingModule {

}
