import { Directive, ElementRef, HostListener, Input, forwardRef, Attribute } from '@angular/core';
import { FormGroup, FormControl, NgControl, AbstractControl, Validator, NG_VALIDATORS, ValidatorFn, ValidationErrors } from '@angular/forms';

export const requiredValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  return (!control.value || control.value.trim() === '') ? { required: true } : null;
};

/*
  required
*/
@Directive({
  selector: '[zn-required]',
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: InputRequiredDirective,
    multi: true
  }]
})
export class InputRequiredDirective implements Validator{
  validate(control: AbstractControl): { [key: string]: any }{
    /* 无法执行 */
    // console.info('test');
    return requiredValidator(control)
  }
}
