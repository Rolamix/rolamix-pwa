import { TestWindow } from '@stencil/core/testing';
import { AppInit } from './app-init';

describe('app-init', () => {

  it('should update', async () => {
    await window.flush();
  });

  // let element: HTMLAppProfileElement;
  let window: TestWindow;
  beforeEach(async () => {
    window = new TestWindow();
    await window.load({
      components: [AppInit],
      html: '<app-init></app-init>'
    });
  });
});
