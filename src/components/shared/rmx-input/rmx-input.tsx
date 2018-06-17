import { Component, Prop, State } from '@stencil/core';
import cx from 'classnames';

import { noop } from '~utils/index';

let labelWarned: boolean = false;
@Component({
  tag: 'rmx-input',
  styleUrl: 'rmx-input.scss'
})
export class AppTextInput {
  @Prop()
  public name: string = '';

  @Prop()
  public label: string = '';

  @Prop()
  public icon: string | JSX.Element = null;

  @Prop()
  public fieldType: 'text' | 'password' = 'text';

  @Prop()
  public inputClass: string = '';

  @Prop()
  public message: string = '';

  @Prop()
  public placeholder: string = '';

  @Prop({ mutable: true, reflectToAttr: true })
  public value: string = '';

  @Prop()
  public disabled: boolean = false;

  @Prop()
  public hasError: boolean = false;

  @Prop()
  public onValueChange: (evt: KeyboardEvent, value: string) => void = noop;

  @Prop()
  public onInputChange: (evt: KeyboardEvent, value: string) => void = noop;

  @Prop()
  public onFocusChange: () => void = noop;

  @Prop()
  public onBlurChange: () => void = noop;

  @State()
  private focused: boolean = false;

  get isActive() {
    return this.value.length > 0 || this.focused;
  }

  private renderLabel(): JSX.Element {
    if (!this.label) { return null; }

    if (this.placeholder && !labelWarned) {
      labelWarned = true;
      console.warn(`rmx-input[${this.name}]: You have specified a label and a placeholder. Only one is needed. Falling back to label`);
    }

    const labelClass = cx('label', { active: this.isActive, 'has-icon': !!this.icon });
    return (
      <label class={labelClass} htmlFor={this.name}>
        {/* <app-translate entry={this.label} /> */}
        {this.label}
      </label>
    );
  }

  private renderIcon() {
    if (!this.icon) { return null; }
    if (typeof this.icon === 'string') {
      return <ion-icon name={this.icon} size="small" />;
    }
    return this.icon;
  }

  private inputFocusHandler = (): void => {
    this.focused = true;
    this.onFocusChange();
  }

  private inputBlurHandler = (): void => {
    this.focused = false;
    this.onBlurChange();
  }

  private valueChangeHandler = (evt: KeyboardEvent): void => {
    const newValue = (evt.currentTarget as HTMLInputElement).value;
    this.value = newValue; // not sure this has the intended effect (so you can read it back out).
    this.onValueChange(evt, newValue);
  }

  private keypressHandler = (evt: KeyboardEvent): void => {
    const newValue = (evt.currentTarget as HTMLInputElement).value;
    if (evt.key === 'Enter' || evt.keyCode === 13) {
      this.value = newValue;
      this.onInputChange(evt, newValue);
    }
  }

  private renderInput(): JSX.Element {
    const props = {
      name: this.name,
      onFocus: this.inputFocusHandler,
      onBlur: this.inputBlurHandler,
      onInput: this.valueChangeHandler,
      onChange: this.valueChangeHandler,
      onKeyPress: this.keypressHandler,
      class: cx('input', { active: this.isActive }, this.inputClass),
      type: this.fieldType,
      value: this.value,
      placeholder: this.label ? undefined : this.placeholder ? this.placeholder : undefined,
      disabled: this.disabled,
      maxLength: 128
    };

    return (
      <input {...props} />
    );
  }

  private renderMessageBox(): JSX.Element {
    if (this.message.length === 0) {
      return null;
    }

    // return (
    //   <app-translate class="message-container" entry={this.message} />
    // );
    return this.message;
  }

  public hostData() {
    return {
      class: {
        active: this.isActive,
        'has-icon': !!this.icon,
        disabled: this.disabled,
        error: this.hasError
      }
    };
  }

  public render(): JSX.Element[] {
    return [
      this.renderLabel(),
      <div class="input-wrap">{this.renderIcon()}{this.renderInput()}</div>,
      this.renderMessageBox()
    ];
  }
}
