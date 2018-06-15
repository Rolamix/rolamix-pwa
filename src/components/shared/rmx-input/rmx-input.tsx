import { Component, Prop, State } from '@stencil/core';
import cx from 'classnames';

import { noop } from '~utils/index';

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

  @Prop()
  public value: string = '';

  @Prop()
  public disabled: boolean = false;

  @Prop()
  public hasError: boolean = false;

  @Prop()
  public onValueChange: (value: string, evt: KeyboardEvent) => void = noop;

  @Prop()
  public onFocusChange: () => void = noop;

  @Prop()
  public onBlurChange: () => void = noop;

  @State()
  private focused: boolean = false;

  private renderLabel(): JSX.Element {
    if (!this.label) { return null; }

    return (
      <label class="label" htmlFor={this.name}>
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

  private inputChangeHandler = (evt: KeyboardEvent): void => {
    const newValue = (evt.currentTarget as HTMLInputElement).value;
    this.value = newValue; // not sure this has the intended effect (so you can read it back out).
    this.onValueChange(newValue, evt);
  }

  private renderInput(): JSX.Element {
    return (
      <input
        name={this.name}
        onFocus={this.inputFocusHandler}
        onBlur={this.inputBlurHandler}
        onInput={this.inputChangeHandler}
        onChange={this.inputChangeHandler}
        class={cx('input', this.inputClass)}
        type={this.fieldType}
        value={this.value}
        placeholder={this.placeholder}
        disabled={this.disabled}
      />
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
        active: this.value.length > 0 || this.focused,
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
