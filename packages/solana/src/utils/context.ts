/**
 * @internal
 */
export const isBrowser = () => typeof (global as any).window !== "undefined";

/**
 * @internal
 */
export const isNode = () => !isBrowser();
