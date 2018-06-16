// We avoid importing EventEmitter from @stencil/core here
// since this goes down as embedded JS in the initial response.
// Instead we invoke window.dispatchEvent directly.
const log = console;

function swSupported() {
  return Boolean(
    typeof window !== 'undefined' &&
    window.location.protocol === 'https:' ||
      window.location.hostname === 'localhost' ||
      window.location.hostname === '[::1]' ||
      window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/),
  );
}

function unregisterSW() {
  navigator.serviceWorker.ready.then((registration) => {
    registration.unregister();
    log.log('ServiceWorker has been unregistered');
  });
  return;
}

const setupServiceWorker = async (src: string, scope: string) => {
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
            window.dispatchEvent(new CustomEvent('swUpdate', { detail: { type: 'refresh' } }));
          } else {
            log.info('Content is cached for offline use.');
            window.dispatchEvent(new CustomEvent('swUpdate', { detail: { type: 'cached' } }));
          }
        }
      };
    };
  } catch (error) {
    log.warn('service worker error', error);
  }
};

export function initServiceWorker({ src = '/sw.js', scope = '/', unregister = false } = {}) {
  const allowsSW = swSupported();

  if (allowsSW && 'serviceWorker' in navigator) {
    if (unregister) {
      return unregisterSW();
    }
    window.addEventListener('load', () => setupServiceWorker(src, scope));
  }
}
