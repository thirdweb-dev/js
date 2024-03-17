import { getThirdwebDomainOverrides } from "../../../utils/domains.js";

const THIRDWEB_PAY_BASE_URL = "interstate.thirdweb.com";
// const THIRDWEB_PAY_BASE_URL = "localhost:3008";
/**
 * Constructs the endpoint to get the status of a quote.
 * @param client - The Thirdweb client containing the baseUrl config
 * @internal
 */
export const getPayQuoteStatusUrl = () =>
  `http://${
    getThirdwebDomainOverrides()?.pay ?? THIRDWEB_PAY_BASE_URL
  }/swap/status`;
/**
 * Constructs the endpoint to get a pay quote.
 * @param client - The Thirdweb client containing the baseUrl config
 * @internal
 */
export const getPayQuoteEndpoint = () =>
  `http://${getThirdwebDomainOverrides()?.pay ?? THIRDWEB_PAY_BASE_URL}/swap/quote`;

/**
 * Constructs the endpoint to get a wallet address swap history.
 * @param client - The Thirdweb client containing the baseUrl config
 * @internal
 */
export const getPaySwapHistoryEndpoint = () =>
  `http://${getThirdwebDomainOverrides()?.pay ?? THIRDWEB_PAY_BASE_URL}/swap/history`;
