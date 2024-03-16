import { getThirdwebDomains } from "../../../utils/domains.js";

/**
 * Constructs the endpoint to get the status of a quote.
 * @param client - The Thirdweb client containing the baseUrl config
 * @internal
 */
export const getPayQuoteStatusUrl = () =>
  `https://${getThirdwebDomains().pay}/quote/status`;

/**
 * Constructs the endpoint to get a pay quote.
 * @param client - The Thirdweb client containing the baseUrl config
 * @internal
 */
export const getPayQuoteEndpoint = () =>
  `https://${getThirdwebDomains().pay}/quote`;
