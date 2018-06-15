import '@ionic/core'; // tslint:disable-line no-import-side-effect
import { Component, Listen, Prop, State } from '@stencil/core';
// import { State } from '@stencil/core';

@Component({
  tag: 'app-loader',
  styleUrl: 'app-loader.scss'
})
export class AppLoader {

  @Prop({ connect: 'ion-toast-controller' }) toastCtrl: HTMLIonToastControllerElement;
  @Prop({ context: 'document' }) private doc: Document;
  @State() isMenuOpen: boolean = false;
  // @Prop({ context: 'window' }) private window: Window;
  // @State() private isLoading = true;

  // public componentWillLoad(): void {
  //   if ('serviceWorker' in this.window.navigator) {
  //     this.window.navigator.serviceWorker.ready
  //       .then(() => (this.isLoading = false))
  //       .catch(() => (this.isLoading = false));
  //   }
  // }

  @Listen('menuToggle')
  handleMenuToggle(event: CustomEvent) {
    this.toggleBody(event.detail.isOpen as boolean);
  }

  handleBackdropClick = () => {
    this.toggleBody(false);
  }

  toggleBody(isOpen: boolean) {
    this.isMenuOpen = isOpen;
    if (isOpen) {
      this.doc.body.classList.add('with--sidebar');
    } else {
      this.doc.body.classList.remove('with--sidebar');
    }
  }

  /**
   * Handle service worker updates correctly.
   * This code will show a toast letting the user of the PWA know that there is a
   * new version available. When they click the reload button it then reloads the
   * page so that the new service worker can take over and serve the fresh content
   */
  @Listen('window:swUpdate')
  async onSWUpdate(event: CustomEvent) {
    console.log('swUpdate: ', event.detail.type);
    // this.isLoading = false;
    if (event.detail.type === 'refresh') { // also 'cached'
      const toast = await this.toastCtrl.create({
        message: 'New version available',
        showCloseButton: true,
        closeButtonText: 'Update Now!'
      });
      await toast.present();
      await toast.onWillDismiss();
      window.location.reload();
    }
  }

  renderThRouter() {
    return (
      <th-router>
        <th-route url="/" component="app-home" exact={true} />
        <th-route url="/profile/:name" component="app-profile" />
      </th-router>
    );
  }

  // renderStencilRouter() {
  //   return (
  //     <stencil-router>
  //       <stencil-route-switch scrollTopOffset={0}>
  //         <stencil-route url="/" component="app-home" exact={true} />
  //         <stencil-route url="/profile/:name" component="app-profile" />
  //       </stencil-route-switch>
  //     </stencil-router>
  //   );
  // }

  render() {
    // if (this.isLoading) {
    //   return (
    //     <app-splash active={true} />
    //   );
    // }

    return (
      <stencil-lift>

        <site-header isOpen={this.isMenuOpen} />

        <div class="site-container">
          {/* <div class="site-pusher"> */}

            <main class="site-content no-push">
              {/* <div class="container"> */}
                {this.renderThRouter()}
              {/* </div> */}
            </main>

            <div class="backdrop" onClick={this.handleBackdropClick} />

          {/* </div> */}
        </div>
      </stencil-lift>
    );
  }
}
