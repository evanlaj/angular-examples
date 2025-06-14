import { AfterViewInit, Component, ElementRef, HostBinding, OnInit, ViewChild } from '@angular/core';
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

  readonly HEX_REGEX = /^#([0-9A-F]{3}){1,2}$/i;

  color: string = '#ff0000';

  @HostBinding('style.--hue')
  hue: number = -1;
  saturation: number = -1;
  brightness: number = -1;

  // Positions for the draggable sliders, only used for display purposes
  huePosition: number = 0;
  saturationPosition: number = 0;
  brightnessPosition: number = 0;

  @ViewChild('colorInput') colorInput: ElementRef<HTMLInputElement> | undefined;

  constructor() {}

  ngOnInit() {
    this.updateColorAndHSB(this.color);
  }

  ngAfterViewInit() {
    this.updateColorFromHSB();
  }

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

  updateColor(event: any) {
    this.updateColorAndHSB(event.target.value);
  }

  updateColorFromHue(e: Event) {
    const event = e as MouseEvent;
    if (event.buttons !== 1 || event.currentTarget == null) return;

    const element = (event.currentTarget as HTMLElement);
    const rect = element.getBoundingClientRect();
    let position = event.pageX - rect.left;
    position = Math.max(-0.5, Math.min(position, element.clientWidth - 1.5)) + 0.5;

    this.huePosition = position;
    this.hue = position * 360 / element.clientWidth;

    this.updateColorFromHSB();
  }

  private updateColorFromHSB() {
    this.color = hsbToHex(this.hue, this.saturation, this.brightness);
    if (this.colorInput) this.colorInput.nativeElement.value = this.color;
  }
}
