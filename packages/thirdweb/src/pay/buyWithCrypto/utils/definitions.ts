import { getThirdwebDomains } from "../../../utils/domains.js";

/**
 * Constructs the endpoint to get the status of a quote.
 * @param client - The Thirdweb client containing the baseUrl config
 * @internal
 */
export const getPayQuoteStatusUrl = () =>
  `https://${getThirdwebDomains().pay}/buy-with-crypto/status/v1`;
/**
 * Constructs the endpoint to get a pay quote.
 * @param client - The Thirdweb client containing the baseUrl config
 * @internal
 */
export const getPayQuoteEndpoint = () =>
  `https://${getThirdwebDomains().pay}/buy-with-crypto/quote/v1`;

/**
 * Constructs the endpoint to get a wallet address swap history.
 * @param client - The Thirdweb client containing the baseUrl config
 * @internal
 */
export const getPaySwapHistoryEndpoint = () =>
  `https://${getThirdwebDomains().pay}/buy-with-crypto/history/v1`;
