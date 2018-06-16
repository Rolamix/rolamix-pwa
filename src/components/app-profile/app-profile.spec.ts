import { TestWindow } from '@stencil/core/testing';
import { AppProfile } from './app-profile';

describe('app-profile', () => {
  it('should build', () => {
    expect(new AppProfile()).toBeTruthy();
  });

  describe('rendering', () => {
    // beforeEach(async () => { });

    it('should not render any content if there is not a match', async () => {
      const window = new TestWindow();
      const element = await window.load({
        components: [AppProfile],
        html: '<app-profile></app-profile>'
      });
      expect(element.textContent).toEqual('');
    });

    it('should work with a name passed', async () => {
      const window = new TestWindow();
      const element = await window.load({
        components: [AppProfile],
        html: '<app-profile></app-profile>',
      });
      element.match = {
        params: {
          name: 'stencil'
        }
      };

      await window.flush();
      // you can also..
      // element.dispatchEvent(new window.Event('click')); // no need to wait for this.
      const pElement = element.querySelector('.content p');
      expect(pElement.textContent).toEqual('Hello! My name is stencil. My name was passed in through a route param!');
    });
  });
});
