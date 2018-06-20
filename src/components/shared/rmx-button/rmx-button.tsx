import { Component, Element, Listen, Prop } from '@stencil/core';

import { noop } from '~utils/index';

@Component({
  tag: 'rmx-button',
  styleUrl: 'rmx-button.scss'
})
export class RmxButton {
  // @Prop()
  // public label: string = '';

  // @Prop()
  // public icon: string | JSX.Element = '';

  @Element() hostEl: Element;

  @Prop()
  public raiseClick: (evt: UIEvent) => void = noop;

  @Prop()
  public disabled: boolean = false;

  @Prop()
  public loading: boolean = false;

  @Prop()
  public swap: boolean = false;

  @Prop()
  public center: boolean = false;

  @Prop()
  public full: boolean = false;

  @Listen('click')
  protected clickHandler(evt: UIEvent): void {
    evt.preventDefault();

    this.raiseClick(evt);
  }

  protected hostData() {
    return {
      class: {
        disabled: this.disabled || this.loading,
        loading: this.loading,
        swap: this.swap,
        center: this.center,
        full: this.full
      }
    };
  }

  // private renderIcon(): JSX.Element {
  //   if (!this.icon) {
  //     return null;
  //   }

  //   if (typeof this.icon === 'string') {
  //     return (
  //       <svg-icon class="icon" name={this.icon} />
  //     );
  //   }

  //   return this.icon;
  // }

  // private renderLabel(): JSX.Element {
  //   // return (
  //   //   <app-translate class="label" entry={this.label} />
  //   // );
  //   return <div class="label">{this.label}</div>;
  // }

  protected render(): JSX.Element | JSX.Element[] {
    if (this.loading) {
      return (
        <rmx-spinner backgroundColor="white" active={true} />
      );
    }

    // return [
    //   this.renderIcon(),
    //   this.renderLabel()
    // ];

    return <slot />;
  }
}
