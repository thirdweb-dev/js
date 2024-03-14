import type { ThirdwebClient } from "../../../client/client.js";

const THIRDWEB_PAY_BASE_URL = "interstate.thirdweb.com";

/**
 * Constructs the endpoint to get the status of a quote.
 * @param client - The Thirdweb client containing the baseUrl config
 * @internal
 */
export const getPayQuoteStatusUrl = (client: ThirdwebClient) =>
  `https://${
    client.config?.baseUrls?.pay ?? THIRDWEB_PAY_BASE_URL
  }/quote/status`;
/**
 * Constructs the endpoint to get a pay quote.
 * @param client - The Thirdweb client containing the baseUrl config
 * @internal
 */
export const getPayQuoteEndpoint = (client: ThirdwebClient) =>
  `https://${client.config?.baseUrls?.pay ?? THIRDWEB_PAY_BASE_URL}/quote`;
