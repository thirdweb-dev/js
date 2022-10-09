/**
 * Makes a parameter required to be passed, but still allowes it to be null or undefined.
 *
 * @beta
 */
export type RequiredParam<T> = T | null | undefined;
