/**
 * @internal
 */
export const isBrowser = () => typeof window !== "undefined";

/**
 * @internal
 */
export const isNode = () => !isBrowser();
