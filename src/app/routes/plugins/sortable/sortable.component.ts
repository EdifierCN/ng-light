import { Component } from '@angular/core';

@Component({
  selector: 'app-sortable',
  templateUrl: './sortable.component.html',
  styleUrls: ['./sortable.component.less']
})
export class SortableComponent {
  items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
}
