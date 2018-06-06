import 'ionicons'; // tslint:disable-line
import '@ionic/core'; // tslint:disable-line
import { Mode } from '@ionic/core';
import { Component } from '@stencil/core';

/**
 * This is an exact duplicate of the `<ion-app>` component inside `@ionic/core`.
 * It is here because there is currently a compiled module bug in @ionic/core <= 4.0.0-beta.7
 * that does not allow it to be used for SSR. When that bug is fixed, we can eliminate
 * this component. It truly does nothing special, in fact several pieces of functionality,
 * like polyfills and browser shims, are left out, because including them here would
 * have been too arduous.
 */
@Component({
  tag: 'pwa-ion-app',
  styleUrl: 'pwa-ion-app.scss',
})
export class PwaIonApp {

  mode!: Mode;

  // @Element() el!: HTMLElement;
  // @Prop({ context: 'window' }) win!: Window;
  // @Prop({ context: 'config' }) config!: Config;

  hostData() {
    return {
      class: {
        [this.mode]: true,
        app: true,
      }
    };
  }

  render() {
    return [
      <ion-tap-click></ion-tap-click>,
      <slot></slot>
    ];
  }
}
