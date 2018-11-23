import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { LayoutDefaultComponent } from './default/default.component';
import { LayoutPassportComponent } from './passport/passport.component';
import { LayoutFullScreenComponent } from './fullscreen/fullscreen.component';
import { HeaderComponent } from './default/header/header.component';
import { FooterComponent } from './default/footer/footer.component';
import { SidebarComponent } from './default/sidebar/sidebar.component';
import { TabnavComponent } from './default/tabnav/tabnav.component';


const MyModules = [
  SharedModule
];
const MyComponents = [
  LayoutDefaultComponent,
  LayoutFullScreenComponent,
  LayoutPassportComponent,
  HeaderComponent,
  FooterComponent,
  SidebarComponent,
  TabnavComponent,
];

@NgModule({
  imports: [
    ...MyModules
  ],
  declarations: [
    ...MyComponents,
  ]
})
export class LayoutModule { }
