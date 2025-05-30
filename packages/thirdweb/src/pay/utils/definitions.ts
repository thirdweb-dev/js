import { getThirdwebDomains } from "../../utils/domains.js";

const getPayBaseUrl = () => {
  const payDomain: string = getThirdwebDomains().pay;
  return payDomain.startsWith("localhost")
    ? `http://${payDomain}`
    : `https://${payDomain}`;
};

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
