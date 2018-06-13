const noop = (..._args) => {}; // tslint:disable-line no-empty
const log = console;

export function initServiceWorker({ src = '/sw.js', scope = '/', unregister = false, onUpdate = noop } = {}) {
  const allowsSW = Boolean(
    typeof window !== 'undefined' &&
    window.location.protocol === 'https:' ||
      window.location.hostname === 'localhost' ||
      window.location.hostname === '[::1]' ||
      window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/),
  );

  if (allowsSW && 'serviceWorker' in navigator) {

    if (unregister) {
      return navigator.serviceWorker.ready.then((registration) => {
        registration.unregister();
        log.log('ServiceWorker has been unregistered');
      });
    }

    const completeSetup = async () => {
      try {
        const registration = await navigator.serviceWorker.register(src, { scope });
        log.log('service worker registered', registration);

        registration.onupdatefound = function () {
          const sw = registration.installing;
          sw.onstatechange = function () {
            // ServiceWorkerState = "installing" | "installed" | "activating" | "activated" | "redundant";
            if (sw.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                log.info('New content is available; please refresh.');
                typeof onUpdate === 'function' && onUpdate('refresh');
                window.dispatchEvent(new Event('swUpdate'));
              } else {
                log.info('Content is cached for offline use.');
                typeof onUpdate === 'function' && onUpdate('cached');
              }

            }
          };
        };
      } catch (error) {
        log.warn('service worker error', error);
      }
    };

    window.addEventListener('load', completeSetup);
  }
}
