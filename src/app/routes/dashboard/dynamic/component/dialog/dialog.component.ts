import { Component, Input, Output, EventEmitter } from '@angular/core'

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.less']
})
export class DialogComponent {
  @Input()
  money: string = '';

  @Output()
  onClick = new EventEmitter<string>();

  handleClick(){
    this.onClick.emit(`恭喜您中了${this.money}大奖！`)
  }
}
