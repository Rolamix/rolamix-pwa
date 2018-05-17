import '@ionic/core';
import '@stencil/core';
import { Component, State, Prop, Listen } from '@stencil/core';
import { ToastController } from '@ionic/core';

@Component({
  tag: 'my-app',
  styleUrl: 'my-app.scss'
})
export class MyApp {

  @Prop({ connect: 'ion-toast-controller' }) toastCtrl: ToastController;
  @Prop({ context: 'isServer' }) private isServer: boolean;
  @State() id: string;

  componentWillLoad() {
    if (!this.isServer) {
      this.id = Math.random().toString(36).substr(2, 8); // stencil
    }
  }

  componentDidLoad() {
    /*
      Handle service worker updates correctly.
      This code will show a toast letting the
      user of the PWA know that there is a
      new version available. When they click the
      reload button it then reloads the page
      so that the new service worker can take over
      and serve the fresh content
    */
    window.addEventListener('swUpdate', () => {
      this.toastCtrl.create({
        message: 'New version available',
        showCloseButton: true,
        closeButtonText: 'Reload'
      }).then((toast) => {
        toast.present();
      });
    });
  }

  @Listen('body:ionToastWillDismiss')
  reload() {
    window.location.reload();
  }

  render() {
    return (
      <ion-app>
        <main>
          <stencil-router>
            <stencil-route url='/' component='app-home' exact={true} componentProps={{id: this.id}}>
            </stencil-route>

            <stencil-route url='/profile/:name' component='app-profile'>
            </stencil-route>
          </stencil-router>
        </main>
      </ion-app>
    );
  }
}
