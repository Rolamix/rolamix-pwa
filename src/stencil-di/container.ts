import {
  IConstructor,
  IContainer,
  Injectable,
  InjectionParam,
  RegisterInjectableDecoratorOptions,
} from './interfaces';
import { isSymbol } from './utils';

// On the server, Stencil provides the Context globally on the jsdom Window.
// Keep an eye on if this changes - we will need to ask them for another API to determine this,
// since testing for window won't work (jsdom provides one).
declare var Context: any;
const isServer = typeof Context !== 'undefined' && Context.isServer;

const log = console;
export class DependencyContainer implements IContainer {

  private dependencyRegistry = new Map<symbol, Injectable>();
  private injectionsRegistry = new Map<Function, InjectionParam[]>(); // Function vs object: the eternal struggle

  get isServer() {
    return isServer;
  }

  hasDependency = (type: string | symbol) => {
    const depSymbol = typeof type === 'string' ? Symbol.for(type) : <symbol>type;
    return !!this.dependencyRegistry.get(depSymbol);
  }

  registerDependency = (options: RegisterInjectableDecoratorOptions) => {
    if (this.dependencyRegistry.get(<symbol>options.provides as symbol)) { return false; }

    this.dependencyRegistry.set(<symbol>options.provides, {
      parent: <symbol>options.provides,
      klass: <IConstructor>options.klass,
      requires: options.requires,
      instance: null,
      singleton: options.singleton,
    });

    return true;
  }

  registerInjection = (injection: InjectionParam) => {
    const injections = this.injectionsRegistry.get(injection.target) || [];
    const index = injections.push(injection);
    this.injectionsRegistry.set(injection.target, injections);
    return index - 1;
  }

  registerInstance = (provides: string | symbol, instance: Object) => {
    if (typeof instance !== 'object' && typeof instance !== 'function') {
        throw new Error('The argument passed was an invalid type.');
    }
    const resolvedType = isSymbol(provides) ? <symbol>provides : Symbol.for(<string>provides);
    if (this.hasDependency(resolvedType)) { return false; }
    this.dependencyRegistry.set(resolvedType, {
      parent: resolvedType,
      klass: null,
      requires: null,
      instance,
      singleton: true,
    });
    return true;
  }

  resolve = (type: string | symbol) => {
    const depSymbol = typeof type === 'string' ? Symbol.for(type) : <symbol>type;
    const entry: Injectable = this.findDependencyEntrySymbol(depSymbol);

    if (entry) {
      // Return the singleton entry, unless we are on the server.
      // On the server we always want a new instance.
      if (entry.instance && entry.singleton && !isServer) {
        return entry.instance;
      }

      // If there is an entry for the type in injectionsRegistry
      let instance = this.resolveInjections(entry);

      // Otherwise, use entry.requires, and spread in order provided, and consumer has to
      // store the instances themselves.
      if (!instance) {
        instance = this.resolveRequires(entry);
      }

      entry.instance = instance;
      return entry.instance;
    }

    // Throw an exception here for not being registered. I debated simply logging and returning
    // null, but this is a developer error so failing fast helps fix fast.
    throw new Error(`DependencyContainer: type '${Symbol.keyFor(depSymbol)}' is not known and cannot be injected.`);
  }

  resolveInjections = (entry: Injectable): object => {
    // Here we use entry.klass, but we know that Injectable's entry.klass
    // and InjectionParam's entry.target are the same object.
    const injectionParams = this.injectionsRegistry.get(entry.klass);

    // We don't know this class, no injections were decorated on its constructor.
    if (!injectionParams || !injectionParams.length) {
      return null;
    }

    if (entry.requires && entry.requires.length > 0) {
      // If BOTH injections & requires are provided, log an error, and use entry.requires
      log.warn(
        `DependencyContainer: type '${Symbol.keyFor(entry.parent)}' is decorated with 'requires' and also contains constructor injections. `
        + 'This combination produces undefined behavior and will fall back to using the requires. Please choose one or the other.'
      );
      return null;
    }

    if (entry.klass.length !== injectionParams.length) {
      log.warn(
        `Class '${Symbol.keyFor(entry.parent)}' has been provided ${injectionParams.length} constructor arguments, but the constructor requires ${entry.klass.length}. `
        + 'This will produced undefined behavior, please review your declarations.'
      );
    }

    // resolve the types for the requested class.
    const resolvedRequires = injectionParams
      .sort((l, r) => (l.parameterIndex - r.parameterIndex))
      .map((injection) => {
        injection.instance = isServer ? this.resolve(injection.requires) : injection.instance || this.resolve(injection.requires);
        return injection.instance;
      });

    const instance = new entry.klass(...resolvedRequires);
    // Spread the params into the instance.
    injectionParams.forEach((param) => {
      if (param.propertyKey) {
        instance[param.propertyKey] = resolvedRequires[param.parameterIndex];
      }
    });

    return instance;
  }

  resolveRequires = (entry: Injectable) => {
    const instance = new entry.klass(...this.resolveAll(...(entry.requires || [])));
    return instance;
  }

  resolveAll = (...classes: (string | symbol)[]) => {
    return classes.map(this.resolve);
  }

  findDependencyEntrySymbol = (depSymbol: symbol) => {
    const symbolStr = Symbol.keyFor(depSymbol);
    let entry: Injectable;
    // Standard equality won't work - symbol equality doesn't work like you expect.
    // const entry = this.dependencyRegistry.get(depSymbol);
    // Instead, need to find it by iterating over the symbols and comparing their keys.
    this.dependencyRegistry.forEach((v, k) => {
      if (entry) { return; }
      const entrySymbolStr = Symbol.keyFor(k);
      if (entrySymbolStr === symbolStr) {
        entry = v;
      }
    });
    return entry;
  }

}
