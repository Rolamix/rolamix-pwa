import { Component, State } from '@stencil/core';

import { Lift } from '@engineerapart/stencil-lift/';
import { InjectProp } from '../../stencil-di/inject-prop';
import { AutoUnsubscribe, Post, PostsService, TPostsService } from '../../services';

@Lift({ key: 'AppHome' })
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

  async getInitialProps() { // args = { Lift: LiftService, isServer: boolean }
    return this.postsService.getPosts();
  }

  async componentWillLoad() {
    this.id = Math.random().toString(36).substr(2, 8);
  }

  hostData() {
    return { class: 'rmx-page' };
  }

  renderPost = (p: Post) => {
    return (
      <div class="list-item">
        <div class="item-label">{p.title}</div>
        <p>{p.body}</p>
      </div>
    );
  }

  renderThButton() {
    return (
      <th-route-link url={`/profile/${this.id}`}>
        <rmx-button>
          Profile page
        </rmx-button>
      </th-route-link>
    );
  }

  // renderStencilRouteLink() {
  //   return (
  //     <stencil-route-link url={`/profile/${this.id}`}>
  //       <rmx-button>
  //         Profile page
  //       </rmx-button>
  //     </stencil-route-link>
  //   );
  // }

  render() {
    return [
      <header>
        <h1 ref={(el) => (this.h1 = el)}>Stencil PWA Toolkit</h1>
      </header>,

      <div class="content">
        <p>
          <ion-icon name="heart" color="primary" size="large" />
          Welcome to the Stencil PWA Toolkit.
          You can use this starter to build entire PWAs all with
          web components using Stencil and ionicons! Check out the readme for everything that comes in this starter out of the box and
          Check out our docs on <a href="https://stenciljs.com">stenciljs.com</a> to get started.
        </p>

        {this.renderThButton()}

        <div class="list">
          {this.posts.map(this.renderPost)}
        </div>

        <ion-img src="/assets/images/home/bg.jpg" />
      </div>
    ];
  }
}
