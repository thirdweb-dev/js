import { type Store } from "./store.js";

export type ReadonlyStore<T> = {
  getValue(): T;
  subscribe(listener: () => void): () => void;
};

/**
 * Create a readonly store whose value is computed from other stores
 * @param computation - The function to compute the value of the store
 * @param dependencies - The stores it depends on
 * @example
 * ```ts
 * const foo = computed(() => bar.getValue() + baz.getValue(), [bar, baz]);
 * ```
 * @returns A store object
 */
export function computedStore<T>(
  // pass the values of the dependencies to the computation function
  computation: () => T,
  dependencies: (Store<any> | ReadonlyStore<any>)[],
): ReadonlyStore<T> {
  type Listener = () => void;
  const listeners = new Set<Listener>();

  let value = computation();

  const notify = () => {
    for (const listener of listeners) {
      listener();
    }
  };

  const setValue = (newValue: T) => {
    value = newValue;
    notify();
  };

  // when any of the dependencies change, recompute the value and set it
  dependencies.forEach((store) => {
    store.subscribe(() => {
      setValue(computation());
    });
  });

  return {
    getValue() {
      return value;
    },
    subscribe(listener: Listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
}
