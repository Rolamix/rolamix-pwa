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
      <header>
        <h1>Stencil PWA Toolkit</h1>
      </header>,

      <div class='app-home'>
        <p>
          Welcome to the Stencil PWA Toolkit.
          You can use this starter to build entire PWAs all with
          web components using Stencil and ionic/core! Check out the readme for everything that comes in this starter out of the box and
          Check out our docs on <a href='https://stenciljs.com'>stenciljs.com</a> to get started.
        </p>

        <stencil-route-link url={`/profile/${this.id}`}>
          <button>
            Profile page
          </button>
        </stencil-route-link>
      </div>
    ];
  }
}
