import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-color-input',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './color-input.component.html',
  styleUrl: './color-input.component.scss'
})
export class ColorInputComponent {
  //#region ------ READ-ONLY ------

  readonly HEX_REGEX = /^([0-9A-F]{3}){1,2}$/i;

  //#endregion

  //#region ------ PROPERTIES ------

  @Input()
  label ?: string;

  _color: string = 'c0ffee';

  //#endregion

  //#region ------ LIFE CYCLE ------

  constructor() {}

  //#endregion

  //#region ------ METHODS ------

  onBlur() {
    if (this.color.length === 3) 
      this.color = this.color.replace(/([0-9A-F])/gi, '$1$1');
  }

  //#endregion

  //#region ------ GETTERS & SETTERS ------

  set color(value: string) {  
    if(!value.match(this.HEX_REGEX)) return;
    this._color = value;
  }

  get color(): string {
    return this._color;
  }

  //#endregion
}