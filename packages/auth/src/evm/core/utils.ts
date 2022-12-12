/**
 * @internal
 */
// @ts-expect-error window is not defined
export const isBrowser = () => typeof window !== "undefined";

/**
 * @internal
 */
export const isNode = () => !isBrowser();
