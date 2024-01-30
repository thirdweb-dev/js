import type { ReadonlyStore } from "./computedStore.js";
import { type Store } from "./store.js";

/**
 * Run a function whenever dependencies change
 * @param effectFn - Side effect function to run
 * @param dependencies - The stores it depends on
 * @example
 * ```ts
 * const foo = computed(() => bar.getValue() + baz.getValue(), [bar, baz]);
 * ```
 */
export function effect<T>(
  // pass the values of the dependencies to the computation function
  effectFn: () => T,
  dependencies: (Store<any> | ReadonlyStore<any>)[],
) {
  // run the effect function on first run
  effectFn();
  // when any of the dependencies change, recompute the value and set it
  dependencies.forEach((store) => {
    store.subscribe(() => {
      effectFn();
    });
  });
}
