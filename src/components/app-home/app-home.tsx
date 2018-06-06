import { Component, State } from '@stencil/core';

import { Lift } from '../../stencil-lift';
import { InjectProp } from '../../stencil-di/inject-prop';

import { AutoUnsubscribe, Post, PostsService, TPostsService } from '../../services';

@AutoUnsubscribe()
@Component({
  tag: 'app-home',
  styleUrl: 'app-home.scss',
})
export class AppHome {

  @InjectProp(TPostsService) postsService: PostsService;
  @State() id: string;
  @State() posts: Post[] = [];

  h1: HTMLElement;

  async componentWillLoad() {
    this.id = Math.random().toString(36).substr(2, 8);

    if (Lift.isServer) {
      const { data, error } = await this.postsService.getPosts();
      if (!error) {
        this.posts = data;
        Lift.set({ key: 'APPHOME_POSTS', payload: data });
      }
    } else {
      this.posts = Lift.get('APPHOME_POSTS');
    }
  }

  hostData() {
    return { class: 'ion-page' };
  }

  render() {
    return [
      // <header>
      //   <h1 ref={(el) => (this.h1 = el)}>Stencil PWA Toolkit</h1>
      // </header>,

      <ion-header>
        <ion-toolbar color="primary">
          <ion-title ref={(el) => (this.h1 = el)}>Stencil PWA Toolkit</ion-title>
        </ion-toolbar>
      </ion-header>,

      <ion-content padding>
        <main>
          <div class="app-home">
            <p>
              Welcome to the Stencil PWA Toolkit.
              You can use this starter to build entire PWAs all with
              web components using Stencil and ionicons! Check out the readme for everything that comes in this starter out of the box and
              Check out our docs on <a href="https://stenciljs.com">stenciljs.com</a> to get started.
            </p>

            <th-route-link url={`/profile/${this.id}`}>
              <ion-button>
                Profile page
              </ion-button>
            </th-route-link>

            <ion-list>
              {this.posts.map((p) => (
                <ion-item text-wrap>
                  <ion-label>{p.title}</ion-label>
                  <p>{p.body}</p>
                </ion-item>
              ))}
            </ion-list>
          </div>
        </main>
      </ion-content>
    ];
  }
}
