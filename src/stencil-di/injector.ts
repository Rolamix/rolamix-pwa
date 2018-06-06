import { IContainer } from './interfaces';
import { DependencyContainer } from './container';

export class Injector {
  private _diContainer: IContainer;

  constructor(container?: IContainer) {
    this._diContainer = container;
  }

  get container() {
    return this._diContainer;
  }

  set container(v: IContainer) {
    this._diContainer = v;
  }
}

// Export a singleton for managing the global container.
// Set the default global container to DependencyContainer.
// Consumers can override this behavior.
export default new Injector(new DependencyContainer());
