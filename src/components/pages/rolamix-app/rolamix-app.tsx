import 'ionicons';
import '@ionic/core';
import { Component, Listen, Prop, State } from '@stencil/core';

@Component({
  tag: 'rolamix-app',
  styleUrl: 'rolamix-app.scss'
})
export class RolamixApp {

  @Prop({ context: 'window' }) private window: Window;
  @Prop({ context: 'document' }) private doc: Document;
  @Prop({ connect: 'ion-toast-controller' }) toastCtrl: HTMLIonToastControllerElement;
  @State() private isMenuOpen: boolean = false;
  // @State() private isLoading = true; // only set to true if on client.

  /**
   * Handle service worker updates correctly.
   * This code will show a toast letting the user of the PWA know that there is a
   * new version available. When they click the reload button it then reloads the
   * page so that the new service worker can take over and serve the fresh content
   * Alternatively you can watch this.window.navigator.serviceWorker.ready
   */
  @Listen('window:swUpdate')
  async onSWUpdate(event: CustomEvent) {
    // this.isLoading = false;
    if (event.detail.type === 'refresh') { // also 'cached'
      const toast = await this.toastCtrl.create({
        message: 'New version available',
        showCloseButton: true,
        closeButtonText: 'Update Now!'
      });
      await toast.present();
      await toast.onWillDismiss();
      this.window.location.reload();
    }
  }

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
          <main class="site-content no-push">
            {this.renderThRouter()}
          </main>

          <div class="backdrop" onClick={this.handleBackdropClick} />
        </div>
      </stencil-lift>
    );
  }
}
