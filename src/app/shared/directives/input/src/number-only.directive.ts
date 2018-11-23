import { Directive, ElementRef, HostListener, Input, forwardRef, Attribute } from '@angular/core';
import { FormGroup, FormControl, NgControl, AbstractControl, Validator, NG_VALIDATORS } from '@angular/forms';

/*
 * number-only
 * 注意：设置blur，依旧会触发校验;if( !control.dirty ) return;
 * 解决：暂无（更新值的方式，setValue 会触发校验）。
 * */
@Directive({
  selector: '[zn-number-only]'
})
export class InputNumberOnly {
  constructor (
    private control: NgControl,
  ){}

  @HostListener('keyup', ['$event', '$event.target'])
  onKeyup(e, target){
    // !(e.keyCode >= 48 && e.keyCode <= 57) && e.preventDefault();
    target.value !== null && this.control.control.setValue(target.value.replace(/\D*/g, ''))
  }
  @HostListener('paste', ['$event', '$event.target'])
  onPaste(e, target){
    target.value !== null && this.control.control.setValue(target.value.replace(/\D*/g, ''))
  }
}
