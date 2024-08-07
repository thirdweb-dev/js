import { getThirdwebDomains } from "../utils/domains.js";

export function getChainsawV2Url(): string {
  const domain: string = getThirdwebDomains().chainsaw;
  return `${domain}/v2`;
}

/**
 * Endpoint to get block data
 * @internal
 */
export function getBlockEndpoint(blockNumber: number) {
  return `${getChainsawV2Url()}/blocks/${blockNumber}`;
}

/**
 * Endpoint to get the latest indexed block number
 * @internal
 */
export function getLatestBlockNumberEndpoint() {
  return `${getChainsawV2Url()}/blockNumber/latest`;
}

/**
 * Endpoint to get transactions
 * @internal
 */
export function getTransactionsEndpoint() {
  return `${getChainsawV2Url()}/transactions`;
}

/**
 * Endpoint to get events
 * @internal
 */
export function getEventsEndpoint() {
  return `${getChainsawV2Url()}/events`;
}

/**
 * Endpoint to get NFTs by collection
 * @internal
 */
export function getNftsByCollectionEndpoint() {
  return `${getChainsawV2Url()}/nfts/by-collection`;
}

/**
 * Endpoint to get NFTs by owner
 * @internal
 */
export function getNftsByOwnerEndpoint() {
  return `${getChainsawV2Url()}/nfts/by-owner`;
}
