import { Component, Injector, OnInit } from '@angular/core'
import {
  ControlValueAccessor,
  FormControl,
  FormControlDirective,
  FormControlName,
  FormGroupDirective,
  NgControl,
  NgModel,
  Validators,
} from '@angular/forms'

@Component({
  template: '',
})
export abstract class BasicInput<T = any> implements ControlValueAccessor, OnInit {
  //#region ------ PROPERTIES ------

  control?: FormControl<T>

  protected _data?: T
  protected _disabled: boolean = false

  protected onChange: Function = (value: any) => {}
  protected onTouch: Function = (value: any) => {}

  //#endregion

  //#region ------ LIFE CYCLE ------

  constructor(protected injector: Injector) {}

  ngOnInit() {
    this.initControl()
  }

  /**
   * Initializes the control for the basic input component.
   * Tries to inject the NgControl and assigns the appropriate control based on its type.
   * Depending on the type, the control can be a FormControl or an NgModel.
   * If the control is not found, it will be null.
   */
  protected initControl() {
    let injectedControl: NgControl | null = null

    try {
      injectedControl = this.injector.get(NgControl)
    } catch (e: any) {}

    if (!injectedControl) return

    switch (injectedControl.constructor) {
      case NgModel: {
        const { control } = injectedControl as NgModel
        this.control = control
        break
      }
      case FormControlName: {
        try {
          const formGroup = this.injector.get(FormGroupDirective)
          if (formGroup) this.control = formGroup.getControl(injectedControl as FormControlName)
        } catch (e: any) {
          let message =
            "Aucun formGroup n'a été trouvé pour le control " + injectedControl.name + '\n'
          message +=
            "Veuillez ajouter un formGroup au parent du composant ou utiliser l'attribut [formControl]"

          console.warn(message)

          this.control = undefined
        }
        break
      }
      default: {
        this.control = (injectedControl as FormControlDirective).form as FormControl
        break
      }
    }
  }

  //#endregion

  //#region ------ VALUE ACCESSOR ------

  writeValue(value: any): void {
    this.setData(value, false)
  }

  registerOnChange(fn: any): void {
    this.onChange = fn
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled
  }

  setData(value: T | undefined, emitEvent: boolean): void {
    this._data = value
    if (emitEvent) {
      this.onChange(value)
      this.onTouch(value)
    }
  }

  //#endregion

  //#region ------ GETTERS & SETTERS ------

  get data(): T | undefined {
    return this._data
  }

  set data(value: T | undefined) {
    this.setData(value, true)
  }

  get disabled(): boolean {
    return this._disabled
  }

  set disabled(value: boolean) {
    this._disabled = value
  }

  //#endregion

  //#region ------ SPECIAL GETTERS ------

  /**
   * Determines if the value of the input component is valid.
   * Returns true if the control is null, untouched, or has no errors.
   * Returns false if the control has errors.
   */
  get validValue(): boolean {
    return (
      !this.control ||
      this.control.untouched ||
      !this.control?.errors ||
      Object.keys(this.control.errors).reduce((v) => !v, true)
    )
  }

  get required(): boolean {
    if (!this.control) return false
    return this.control.hasValidator(Validators.required)
  }

  //#endregion
}