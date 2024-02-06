let baseUrl = "https://embedded-wallet-v2.thirdweb.com";

/**
 * Method to set the base url to point to other environments
 * @param url - The base url
 * @example
 * ```ts
 * setBaseUrl("https://embedded-wallet-v2.thirdweb.com");
 * ```
 */
export const setBaseUrl = (url: string) => {
  baseUrl = url;
};
/**
 * @internal
 */
export const getBaseUrl = () => {
  return baseUrl;
};
