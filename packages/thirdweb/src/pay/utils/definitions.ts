import { getThirdwebDomains } from "../../utils/domains.js";

/**
 * Endpoint to get the status of a "Buy with Crypto" quote.
 * @internal
 */
export const getPayBuyWithCryptoStatusUrl = () =>
  `https://${getThirdwebDomains().pay}/buy-with-crypto/status/v1`;
/**
 * Endpoint to get "Buy with Crypto" quote.
 * @internal
 */
export const getPayBuyWithCryptoQuoteEndpoint = () =>
  `https://${getThirdwebDomains().pay}/buy-with-crypto/quote/v1`;

/**
 * Endpoint to get a "Buy with Fiat" quote.
 * @internal
 */
export const getPayBuyWithFiatQuoteEndpoint = () =>
  `https://${getThirdwebDomains().pay}/buy-with-fiat/quote/v1`;

/**
 * Endpoint to get the status of a "Buy with Fiat" transaction status.
 * @internal
 */
export const getPayBuyWithFiatStatusEndpoint = () =>
  `https://${getThirdwebDomains().pay}/buy-with-fiat/status/v1`;

/**
 * Endpoint to get history of "Buy with Fiat" transactions for given wallet address.
 * @internal
 */
export const getPayBuyWithFiatHistoryEndpoint = () =>
  `https://${getThirdwebDomains().pay}/buy-with-fiat/history/v1`;

/**
 * Endpoint to get a "Buy with Crypto" transaction history for a given wallet address.
 * @internal
 */
export const getPayBuyWithCryptoHistoryEndpoint = () =>
  `https://${getThirdwebDomains().pay}/buy-with-crypto/history/v1`;

/**
 * Endpoint to get a list of supported destination chains and tokens for thirdweb pay.
 * @internal
 */
export const getPaySupportedDestinations = () =>
  `https://${getThirdwebDomains().pay}/destination-tokens/v1`;

/**
 * Endpoint to get a list of supported source chains + tokens for thirdweb pay.
 * @internal
 */
export const getPaySupportedSources = () =>
  `https://${getThirdwebDomains().pay}/buy-with-crypto/source-tokens/v1`;

/**
 * Endpoint to get buy history for a given wallet address.
 * This includes both "Buy with Crypto" and "Buy with Fiat" transactions.
 * @internal
 */
export const getPayBuyHistoryEndpoint = () =>
  `https://${getThirdwebDomains().pay}/wallet/history/v1`;
