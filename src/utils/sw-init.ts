export function initServiceWorker() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator && 'file:' !== location.protocol) {

    const completeSetup = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('service worker registered', registration);

        registration.onupdatefound = function () {
          const sw = registration.installing;
          sw.onstatechange = function () {
            sw.state === 'installed' && window.dispatchEvent(new Event('swUpdate'));
          };
        };
      } catch (error) {
        console.log('service worker error', error);
      }
    };

    window.addEventListener('load', completeSetup);
  }
}
