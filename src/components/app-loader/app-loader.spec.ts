import { TestWindow } from '@stencil/core/testing';
import { AppLoader } from './app-loader';

describe('my-app', () => {

  it('should update', async () => {
    await window.flush();
  });

  // let element: HTMLAppProfileElement;
  let window: TestWindow;
  beforeEach(async () => {
    window = new TestWindow();
    await window.load({
      components: [AppLoader],
      html: '<my-app></my-app>'
    });
  });
});
