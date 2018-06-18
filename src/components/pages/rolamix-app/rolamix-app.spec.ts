import { TestWindow } from '@stencil/core/testing';
import { RolamixApp } from './rolamix-app';

describe('rolamix-app', () => {

  it('should update', async () => {
    await window.flush();
  });

  // let element: HTMLAppProfileElement;
  let window: TestWindow;
  beforeEach(async () => {
    window = new TestWindow();
    await window.load({
      components: [RolamixApp],
      html: '<rolamix-app></rolamix-app>'
    });
  });
});
