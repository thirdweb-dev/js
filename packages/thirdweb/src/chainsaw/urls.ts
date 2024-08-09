import { getThirdwebBaseUrl } from "../utils/domains.js";

export function getChainsawV2Url(): string {
  const domain: string = getThirdwebBaseUrl("chainsaw");
  return `${domain}/v2`;
}

/**
 * Endpoint to get block data
 * @internal
 */
export function getBlockEndpoint(blockNumber: bigint): URL {
  return new URL(`${getChainsawV2Url()}/blocks/${blockNumber}`);
}

/**
 * Endpoint to get the latest indexed block number
 * @internal
 */
export function getLatestBlockNumberEndpoint(): URL {
  return new URL(`${getChainsawV2Url()}/blockNumber/latest`);
}

/**
 * Endpoint to get transactions
 * @internal
 */
export function getTransactionsEndpoint(): URL {
  return new URL(`${getChainsawV2Url()}/transactions`);
}

/**
 * Endpoint to get events
 * @internal
 */
export function getEventsEndpoint(): URL {
  return new URL(`${getChainsawV2Url()}/events`);
}

/**
 * Endpoint to get NFTs by collection
 * @internal
 */
export function getNftsByCollectionEndpoint(): URL {
  return new URL(`${getChainsawV2Url()}/nfts/by-collection`);
}

/**
 * Endpoint to get NFTs by owner
 * @internal
 */
export function getNftsByOwnerEndpoint(): URL {
  return new URL(`${getChainsawV2Url()}/nfts/by-owner`);
}
