import {
  InjectDecoratorOptions,
} from './interfaces';
import Injector from './injector';
import { resolveInjectDep } from './utils';

export function Inject(depOrOpts: InjectDecoratorOptions | string | symbol, propertyKey?: string | symbol): ParameterDecorator {
  const dep = resolveInjectDep(depOrOpts);
  const resolvedPropertyKey = typeof depOrOpts === 'object' ? depOrOpts.propertyKey : propertyKey;

  // Until this issue is fixed, we cannot properly get propertyKey from the parameter list.
  // We will use our own stand-in instead.
  // https://github.com/Microsoft/TypeScript/issues/20931
  return function InjectDecorator(target: Function, _bad_propertyKey: string, parameterIndex: number): void {
    const container = Injector.container;
    container.registerInjection({
      target,
      propertyKey: resolvedPropertyKey,
      parameterIndex,
      requires: dep,
    });

    if (resolvedPropertyKey) {
      let val = target[resolvedPropertyKey];
      const getter = () => {
        if (!val) {
          val = Injector.container.resolve(dep);
        }
        return val;
      };

      Object.defineProperty(target, resolvedPropertyKey, {
        get: getter,
      });
    }
  };
}

export const Import = Inject;
