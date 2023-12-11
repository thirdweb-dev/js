import invariant from "tiny-invariant";

/**
 * Makes a parameter required to be passed, but still allows it to be null or undefined.
 * @internal
 */
export type RequiredParam<T> = T | null | undefined;

export function requiredParamInvariant<TValue>(
  condition: RequiredParam<TValue>,
  message?: string,
): asserts condition {
  invariant(condition !== null || condition !== undefined, message);
}
