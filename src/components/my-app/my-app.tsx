// import '@ionic/core';
import '@stencil/core';
import { Component, Listen } from '@stencil/core';
// import { RouterSwitch } from '@stencil/router';
import { RouterSwitch } from '@engineerapart/stencil-router';

@Component({
  tag: 'my-app',
  styleUrl: 'my-app.scss'
})
export class MyApp {

  // @Prop({ connect: 'ion-toast-controller' }) toastCtrl: HTMLIonToastControllerElement;

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
    // const toast = await this.toastCtrl.create({
    //   message: 'New version available',
    //   showCloseButton: true,
    //   closeButtonText: 'Reload'
    // });
    // await toast.present();
    // await toast.onWillDismiss();
    window.location.reload();
  }

  render() {
    return (
      <main>
        <stencil-router>
          <RouterSwitch>
            <stencil-route url='/' component='app-home' exact={true} />
            <stencil-route url='/profile/:name' component='app-profile' />
          </RouterSwitch>
        </stencil-router>
      </main>
    );
  }
}
