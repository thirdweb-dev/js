import { getThirdwebDomains } from "../../utils/domains.js";

/**
 * Constructs the endpoint to get the status of a quote.
 * @param client - The Thirdweb client containing the baseUrl config
 * @internal
 */
export const getPayBuyWithCryptoStatusUrl = () =>
  `https://${getThirdwebDomains().pay}/buy-with-crypto/status/v1`;
/**
 * Constructs the endpoint to get a pay quote.
 * @param client - The Thirdweb client containing the baseUrl config
 * @internal
 */
export const getPayBuyWithCryptoQuoteEndpoint = () =>
  `https://${getThirdwebDomains().pay}/buy-with-crypto/quote/v1`;

/**
 * Constructs the endpoint to get a fiat quote.
 * @param client - The Thirdweb client containing the baseUrl config
 * @internal
 */
export const getPayBuyWithFiatQuoteEndpoint = () =>
  `https://${getThirdwebDomains().pay}/buy-with-fiat/quote/v1`;

/**
 * Constructs the endpoint to get fiat status.
 * @param client - The Thirdweb client containing the baseUrl config
 * @internal
 */
export const getPayBuyWithFiatStatusEndpoint = () =>
  `https://${getThirdwebDomains().pay}/buy-with-fiat/status/v1`;

/**
 * Constructs the endpoint to get a wallet address BuyWithFiat history.
 * @param client - The Thirdweb client containing the baseUrl config
 * @internal
 */
export const getPayBuyWithFiatHistoryEndpoint = () =>
  `https://${getThirdwebDomains().pay}/buy-with-fiat/history/v1`;

/**
 * Constructs the endpoint to get a wallet address BuyWithCrypto history.
 * @param client - The Thirdweb client containing the baseUrl config
 * @internal
 */
export const getPayBuyWithCryptoHistoryEndpoint = () =>
  `https://${getThirdwebDomains().pay}/buy-with-crypto/history/v1`;

/**
 * Constructs the endpoint to get the pay endpoint
 * @internal
 */
export const getPayChainsEndpoint = () =>
  `https://${getThirdwebDomains().pay}/chains`;

/**
 * Constructs the endpoint to get the pay endpoint
 * @internal
 */
export const getFiatCurrenciesEndpoint = () =>
  `https://${getThirdwebDomains().pay}/buy-with-fiat/currency/v1`;

/**
 * Constructs the endpoint to get the Buy history that includes both buy with crypto and buy with fiat
 * @param client - The Thirdweb client containing the baseUrl config
 * @internal
 */
export const getPayBuyHistoryEndpoint = () =>
  `https://${getThirdwebDomains().pay}/wallet/history/v1`;
