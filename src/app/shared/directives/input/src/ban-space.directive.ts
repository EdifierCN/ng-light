import { Directive, ElementRef, HostListener, Input, forwardRef, Attribute } from '@angular/core';
import { FormGroup, FormControl, NgControl, AbstractControl, Validator, NG_VALIDATORS } from '@angular/forms';

/*
 * ban space
 * 缺陷：设置blur，依旧会触发校验;if( !control.dirty ) return;
 * 解决：暂无（更新值的方式，setValue 会触发校验）。
 * */
@Directive({
  selector: '[zn-ban-space]'
})
export class InputBanSpaceDirective {
  constructor(
    private control: NgControl,
  ){}
  @HostListener('keydown', ['$event', '$event.target'])
  onKeydown(e, target){
    e.keyCode === 32 && e.preventDefault();
  }
  @HostListener('keyup', ['$event','$event.target'])
  onKeyup(e, target){
    target.value !== null && this.control.control.patchValue(target.value.replace(/\s+/g, ''), {
      /* 没啥用啊 */
      // onlySelf: true,
      // emitEvent: false,
      // emitModelToViewChange: false,
      // emitViewToModelChange: false,
    });
  }
  // 无效
  @HostListener('paste', ['$event', '$event.target'])
  onPaste(e, target){
    // 貌似没有 afterpaste 事件，必须加延时
    setTimeout(() => {
      target.value !== null && this.control.control.setValue(target.value.replace(/\s+/g, ''));
    }, 0);
  }
}
