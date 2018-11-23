import { NgModule } from '@angular/core'
import { PluginsRoutingModule } from './plugins-routing.module';
import { SharedModule } from '@shared/shared.module';

import { SortableComponent } from './sortable/sortable.component';
import { PlayerComponent } from './player/player.component';

@NgModule({
  imports: [
    SharedModule,
    PluginsRoutingModule,
  ],
  declarations: [SortableComponent, PlayerComponent]
})
export class PluginsModule {

}
