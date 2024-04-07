export type Store<T> = {
  getValue(): T;
  setValue(newValue: T): void;
  subscribe(listener: () => void): () => void;
};

/**
 * Create a reactive value store
 * @param initialValue - The initial value to store
 * @example
 * ```ts
 * const store = createStore(0);
 * ```
 * @returns A store object
 * @internal
 */
export function createStore<T>(initialValue: T): Store<T> {
  type Listener = () => void;
  const listeners = new Set<Listener>();

  let value = initialValue;

  const notify = () => {
    for (const listener of listeners) {
      listener();
    }
  };

  return {
    getValue() {
      return value;
    },
    setValue(newValue: T) {
      value = newValue;
      notify();
    },
    subscribe(listener: Listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
}
