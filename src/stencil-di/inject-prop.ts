import {
  InjectDecoratorOptions,
} from './interfaces';
import Injector from './injector';
import { resolveInjectDep } from './utils';

export function InjectProp(depOrOpts: InjectDecoratorOptions | string | symbol): PropertyDecorator {
  const dep = resolveInjectDep(depOrOpts);

  return function InjectPropDecorator(target: Function, propertyKey: string): void {
    let val = target[propertyKey];
    const getter = () => {
      if (!val) {
        val = Injector.container.resolve(dep);
      }
      return val;
    };

    Object.defineProperty(target, propertyKey, {
      get: getter,
    });
  };
}

export const ImportProp = InjectProp;
