import { getThirdwebDomains } from "../utils/domains.js";

export const getChainsawBaseUrl = (): string => {
  const domain: string = getThirdwebDomains().chainsaw;
  return `${domain}/v2`;
};

/**
 * Endpoint to get block data
 * @internal
 */
export const getBlockEndpoint = (blockNumber: number) =>
  `${getChainsawBaseUrl()}/blocks/${blockNumber}`;

/**
 * Endpoint to get the latest indexed block number
 * @internal
 */
export const getLatestBlockNumberEndpoint = () =>
  `${getChainsawBaseUrl()}/blockNumber/latest`;

/**
 * Endpoint to get transactions
 * @internal
 */
export const getTransactionsEndpoint = () =>
  `${getChainsawBaseUrl()}/transactions`;

/**
 * Endpoint to get events
 * @internal
 */
export const getEventsEndpoint = () => `${getChainsawBaseUrl()}/events`;

/**
 * Endpoint to get NFTs by collection
 * @internal
 */
export const getNftsByCollectionEndpoint = () =>
  `${getChainsawBaseUrl()}/nfts/by-collection`;

/**
 * Endpoint to get NFTs by owner
 * @internal
 */
export const getNftsByOwnerEndpoint = () =>
  `${getChainsawBaseUrl()}/nfts/by-owner`;
