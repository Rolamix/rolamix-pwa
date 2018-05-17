import { Component, Prop, State } from '@stencil/core';

@Component({
  tag: 'app-home',
  styleUrl: 'app-home.scss',
  host: {
    theme: 'ion-page',
  },
})
export class AppHome {

  @Prop({ context: 'isServer' }) private isServer: boolean;
  @State() id: string;

  componentWillLoad() {
    if (!this.isServer) {
      this.id = Math.random().toString(36).substr(2, 8); // stencil
    }
  }

  render() {

    return [
      <ion-header>
        <ion-toolbar color='primary'>
          <ion-title>Ionic PWA Toolkit</ion-title>
        </ion-toolbar>
      </ion-header>,

      <ion-content>
        <p>
          Welcome to the Ionic PWA Toolkit.
          You can use this starter to build entire PWAs all with
          web components using Stencil and ionic/core! Check out the readme for everything that comes in this starter out of the box and
          Check out our docs on <a href='https://stenciljs.com'>stenciljs.com</a> to get started.
        </p>

        <stencil-route-link url={`/profile/${this.id}`}>
          <ion-button> {/* href={`/profile/${this.id}`} */}
            Profile page
          </ion-button>
        </stencil-route-link>
      </ion-content>
    ];
  }
}
