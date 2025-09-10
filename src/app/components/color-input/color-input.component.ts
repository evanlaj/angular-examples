import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule, ControlValueAccessor, AbstractControl } from '@angular/forms';
import { BasicInput } from '../../models/misc/basic-input';

@Component({
  selector: 'app-color-input',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './color-input.component.html',
  styleUrl: './color-input.component.scss',
  providers: [
      {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => ColorInputComponent),
        multi: true,
      },
    ],
})
export class ColorInputComponent extends BasicInput<string> implements ControlValueAccessor, OnInit  {
  //#region ------ READ-ONLY ------

  readonly HEX_REGEX = /^([0-9A-F]{3}){1,2}$/i;

  //#endregion

  //#region ------ PROPERTIES ------

  @Input()
  label ?: string;

  //#endregion

  //#region ------ LIFE CYCLE ------

  override ngOnInit() {
    super.ngOnInit();

    if (this.control) {
      this.control.addValidators(this.hexValidator.bind(this));
    }
  }

  //#region ------ METHODS ------

  hexValidator(control: AbstractControl): { [key: string]: any } | null {
    if (!this.HEX_REGEX.test(control.value)) {
      return { 'invalidHex': { value: control.value } };
    }
    return null;
  }

  onBlur() {
    if (this.data && this.data.length === 3) 
      this.data = this.data.replace(/([0-9A-F])/gi, '$1$1');
  }

  //#endregion
}