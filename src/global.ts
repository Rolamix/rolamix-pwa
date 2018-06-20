import { initServiceWorker } from './utils/sw-init';
import { TranslateService } from './services/index';

// This is temporarily commented out as the `setupConfig` method has been temporarily removed
// setupConfig({
  // uncomment the following line to force mode to be Material Design
  // mode: 'md'
  // });
initServiceWorker();

declare var Context: any;
Context.TranslateService = new TranslateService(Context.isServer);
