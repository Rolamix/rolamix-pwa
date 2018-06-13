import { Component, Listen, Prop } from '@stencil/core';

@Component({
  tag: 'app-loader',
  styleUrl: 'app-loader.scss'
})
export class AppLoader {

  @Prop({ connect: 'ion-toast-controller' }) toastCtrl: HTMLIonToastControllerElement;

  /**
   * Handle service worker updates correctly.
   * This code will show a toast letting the
   * user of the PWA know that there is a
   * new version available. When they click the
   * reload button it then reloads the page
   * so that the new service worker can take over
   * and serve the fresh content
   */
  @Listen('window:swUpdate')
  async onSWUpdate() {
    const toast = await this.toastCtrl.create({
      message: 'New version available',
      showCloseButton: true,
      closeButtonText: 'Update Now!'
    });
    await toast.present();
    await toast.onWillDismiss();
    window.location.reload();
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
    return (
      <stencil-lift>
          {this.renderThRouter()}
      </stencil-lift>
    );
  }
}
