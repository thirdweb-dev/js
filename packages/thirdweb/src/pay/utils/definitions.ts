import { getThirdwebDomains } from "../../utils/domains.js";

const getPayBaseUrl = () => {
  const payDomain: string = getThirdwebDomains().pay;
  return payDomain.startsWith("localhost")
    ? `http://${payDomain}`
    : `https://${payDomain}`;
};

/**
 * Endpoint to get the status of a "Buy with Crypto" quote.
 * @internal
 */
export const getPayBuyWithCryptoStatusUrl = () =>
  `${getPayBaseUrl()}/buy-with-crypto/status/v1`;

/**
 * Endpoint to get a "Buy with Fiat" quote.
 * @internal
 */
export const getPayBuyWithFiatQuoteEndpoint = () =>
  `${getPayBaseUrl()}/buy-with-fiat/quote/v1`;

/**
 * Endpoint to get the status of a "Buy with Fiat" transaction status.
 * @internal
 */
export const getPayBuyWithFiatStatusEndpoint = () =>
  `${getPayBaseUrl()}/buy-with-fiat/status/v1`;

/**
 * Endpoint to get history of "Buy with Fiat" transactions for given wallet address.
 * @internal
 */
export const getPayBuyWithFiatHistoryEndpoint = () =>
  `${getPayBaseUrl()}/buy-with-fiat/history/v1`;

/**
 * Endpoint to get a "Buy with Crypto" transaction history for a given wallet address.
 * @internal
 */
export const getPayBuyWithCryptoHistoryEndpoint = () =>
  `${getPayBaseUrl()}/buy-with-crypto/history/v1`;

/**
 * Endpoint to get buy history for a given wallet address.
 * This includes both "Buy with Crypto" and "Buy with Fiat" transactions.
 * @internal
 */
export const getPayBuyHistoryEndpoint = () =>
  `${getPayBaseUrl()}/wallet/history/v1`;

export const getPayConvertFiatToCryptoEndpoint = () =>
  `${getPayBaseUrl()}/convert/fiat-to-crypto/v1`;

export const getPayConvertCryptoToFiatEndpoint = () =>
  `${getPayBaseUrl()}/convert/crypto-to-fiat/v1`;
