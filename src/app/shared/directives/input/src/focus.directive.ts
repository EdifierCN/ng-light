import { Directive, ElementRef, HostListener, Input, Output, forwardRef, Attribute, EventEmitter, OnInit } from '@angular/core';
import { FormGroup, FormControl, NgControl, AbstractControl, Validator, NG_VALIDATORS } from '@angular/forms';

/*
 * focus
 * */
@Directive({
  selector: '[zn-focus]'
})
export class InputFocusDirective {
  constructor (
    private control: NgControl,
  ){}

  focused: Boolean = false;
  private errors: object = {};
  private isChange: boolean = false;
  private _value: string = this.control.value;

  @Output()
  private znFocus = new EventEmitter();
  @Output()
  private znBlur = new EventEmitter();

  @HostListener('focus')
  onFocus(){
    const control = this.control.control;
    this.focused = true;
    this._value = control.value;
    control['focused'] = true;
    control.markAsPristine();
    this.errors = control.errors;
    control.setErrors({});
    this.znFocus.emit();
  }
  @HostListener('blur')
  onBlur(){
    const control = this.control.control;
    this.focused = false;
    control['focused'] = false;
    control.markAsDirty();

    /*  注意校验次数 */
    if(this._value === control.value){
     control.setErrors(this.errors);
    }
    this.znBlur.emit();
  }

}
