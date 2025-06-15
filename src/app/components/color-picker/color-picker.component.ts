import { AfterViewInit, Component, ElementRef, HostBinding, Input, OnInit, ViewChild } from '@angular/core';
import { hexToHsb, hsbToHex } from '../../utils/colors';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-color-picker',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './color-picker.component.html',
  styleUrl: './color-picker.component.scss'
})
export class ColorPickerComponent implements OnInit, AfterViewInit {

  //#region ------ READ-ONLY ------

  readonly HEX_REGEX = /^#([0-9A-F]{3}){1,2}$/i;

  //#endregion

  //#region ------ PROPERTIES ------

  @Input()
  label ?: string;

  color: string = '#ff0000';

  @HostBinding('style.--hue')
  hue: number = -1;
  saturation: number = -1;
  brightness: number = -1;

  @ViewChild('colorInput') colorInput ?: ElementRef<HTMLInputElement>;
  @ViewChild('gradient') gradient ?: ElementRef<HTMLDivElement>;
  @ViewChild('hueGradient') hueGradient ?: ElementRef<HTMLDivElement>;

  //#endregion

  //#region ------ LIFE CYCLE ------

  constructor() {}

  ngOnInit() {
    this.updateColorAndHSB(this.color);
  }

  ngAfterViewInit() {
    this.updateColorFromHSB();
  }

  //#endregion

  //#region ------ METHODS ------

  private updateColorAndHSB(value: string) {
    value = '#' + value.replace('#', '');

    if(!value.match(this.HEX_REGEX)) return;

    if (value.length === 4) 
      value = value.replace(/([0-9A-F])/gi, '$1$1');

    this.color = value;

    const hsb = hexToHsb(value);
    this.hue = hsb.hue;
    this.saturation = hsb.saturation;
    this.brightness = hsb.brightness;
  }

  updateColorFromInput(event: any) {
    this.updateColorAndHSB(event.target.value);
  }

  updateColorFromGradient(e: Event) {
    const event = e as MouseEvent;
    if (event.buttons !== 1 || event.currentTarget == null) return;

    const element = (event.currentTarget as HTMLElement);
    const rect = element.getBoundingClientRect();

    const cursorPos = {x: event.pageX - rect.left - 3, y: event.pageY - rect.top - 3};
    cursorPos.x = Math.max(0, Math.min(cursorPos.x, element.clientWidth - 8));
    cursorPos.y = Math.max(0, Math.min(cursorPos.y, element.clientHeight - 8));

    this.saturation = cursorPos.x * 100 / (element.clientWidth - 8);
    this.brightness = 100 - cursorPos.y * 100 / (element.clientHeight - 8);

    this.updateColorFromHSB();
  }

  updateColorFromHue(e: Event) {
    const event = e as MouseEvent;
    if (event.buttons !== 1 || event.currentTarget == null) return;

    const element = (event.currentTarget as HTMLElement);
    const rect = element.getBoundingClientRect();
    let position = event.pageX - rect.left;
    position = Math.max(-0.5, Math.min(position, element.clientWidth - 1.5)) + 0.5;

    this.hue = position * 360 / element.clientWidth;

    this.updateColorFromHSB();
  }

  private updateColorFromHSB() {
    this.color = hsbToHex(this.hue, this.saturation, this.brightness);
    if (this.colorInput) this.colorInput.nativeElement.value = this.color;
  }

  //#endregion

  //#region ------ GETTERS ------

  get huePosition() {
    if (!this.hueGradient || !this.hueGradient.nativeElement) return 0;
    return this.hue * this.hueGradient.nativeElement.clientWidth / 360;
  }

  get saturationPosition() {
    if (!this.gradient || !this.gradient.nativeElement) return 0;
    return this.saturation * (this.gradient.nativeElement.clientWidth - 8) / 100;
  }

  get brightnessPosition() {
    if (!this.gradient || !this.gradient.nativeElement) return 0;
    return (100 - this.brightness) * (this.gradient.nativeElement.clientHeight - 8) / 100;
  }

  //#endregion
}
