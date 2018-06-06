import { Component, Prop, State } from '@stencil/core';
import Lift from './lift';

@Component({
  tag: 'stencil-lift',
})
export class StencilLiftComponent {

  @Prop({ context: 'isServer' }) isServer: boolean;
  @Prop({ context: 'document' }) document!: Document;
  @State() collectedData: any = null;

  componentWillLoad() {
    Lift.initialize(this.isServer);
  }

  componentDidLoad() {
    this.collectedData = Lift.export() || {};
  }

  componentWillUpdate() {
    return Promise.resolve();
  }

  componentDidUpdate() { } // tslint:disable-line no-empty

  render() {
    if (!this.collectedData) { return null; }

    if (this.isServer) {
      const scr = this.document.createElement('script');
      scr.innerHTML = `window._STENCIL_LIFT=${JSON.stringify(this.collectedData)}`;
      scr.id = 'STENCIL_LIFT';
      this.document.head.appendChild(scr);
    }

    return <slot></slot>;
  }
}
