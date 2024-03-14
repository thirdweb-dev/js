import { getThirdwebDomainOverrides } from "../../../utils/domains.js";

const THIRDWEB_PAY_BASE_URL = "interstate.thirdweb.com";

/**
 * Constructs the endpoint to get the status of a quote.
 * @param client - The Thirdweb client containing the baseUrl config
 * @internal
 */
export const getPayQuoteStatusUrl = () =>
  `https://${
    getThirdwebDomainOverrides()?.pay ?? THIRDWEB_PAY_BASE_URL
  }/quote/status`;
/**
 * Constructs the endpoint to get a pay quote.
 * @param client - The Thirdweb client containing the baseUrl config
 * @internal
 */
export const getPayQuoteEndpoint = () =>
  `https://${getThirdwebDomainOverrides()?.pay ?? THIRDWEB_PAY_BASE_URL}/quote`;
