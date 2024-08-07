import { getThirdwebDomains } from "../utils/domains.js";

export function getChainsawV2Url(): string {
  const domain: string = getThirdwebDomains().chainsaw;
  return `${domain}/v2`;
};

/**
 * Endpoint to get block data
 * @internal
 */
export const getBlockEndpoint = (blockNumber: number) =>
  `${getChainsawV2Url()}/blocks/${blockNumber}`;

/**
 * Endpoint to get the latest indexed block number
 * @internal
 */
export const getLatestBlockNumberEndpoint = () =>
  `${getChainsawV2Url()}/blockNumber/latest`;

/**
 * Endpoint to get transactions
 * @internal
 */
export const getTransactionsEndpoint = () =>
  `${getChainsawV2Url()}/transactions`;

/**
 * Endpoint to get events
 * @internal
 */
export const getEventsEndpoint = () => `${getChainsawV2Url()}/events`;

/**
 * Endpoint to get NFTs by collection
 * @internal
 */
export function getNftsByCollectionEndpoint() {
  `${getChainsawV2Url()}/nfts/by-collection`;

/**
 * Endpoint to get NFTs by owner
 * @internal
 */
export const getNftsByOwnerEndpoint = () =>
  `${getChainsawV2Url()}/nfts/by-owner`;
