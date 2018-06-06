export interface AutoUnsubscribeOptions {
  blacklist: string[];
  verbose: boolean;
}

export function AutoUnsubscribe(options?: AutoUnsubscribeOptions): ClassDecorator {
  const { blacklist = [], verbose = true } = options || {};
  // Return the actual decorator
  return function (constructor: any) {
    const original = constructor.prototype.componentWillUnload;

    // if (original === undefined) {
    //   const message = `@AutoUnsubscribe requires the target component '${constructor.name}' to have defined the 'componentWillUnload' method so that the compiler does not optimize it away`;
    //   console.error(`%c${message}`, 'font-weight: bold; color: red');
    //   throw new Error(message);
    // }

    constructor.prototype.componentWillUnload = function () {
      for (const prop in this) {
        const property = this[prop];
        if (blacklist.indexOf(prop) < 0) {
          if (property && (typeof property.unsubscribe === 'function')) {
            verbose && console.info(`${constructor.name}.${prop} is unsubscribing`);
            property.unsubscribe();
            this[prop] = null; // Not sure this is desirable...
          }
        }
      }

      original && typeof original === 'function' && original.apply(this, arguments);
    };
  };
}
