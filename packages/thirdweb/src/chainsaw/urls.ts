import { getThirdwebBaseUrl } from "../utils/domains.js";

export function getChainsawV2Url(): URL {
  const domain = getThirdwebBaseUrl("chainsaw");
  return new URL(`${domain}/v2`);
}

/**
 * Endpoint to get block data
 * @internal
 */
export function getBlockEndpoint(blockNumber: bigint): URL {
  const url = getChainsawV2Url();
  url.pathname += `/blocks/${blockNumber}`;
  return url;
}

/**
 * Endpoint to get the latest indexed block number
 * @internal
 */
export function getLatestBlockNumberEndpoint(): URL {
  const url = getChainsawV2Url();
  url.pathname += "/blockNumber/latest";
  return url;
}

/**
 * Endpoint to get transactions
 * @internal
 */
export function getTransactionsEndpoint(): URL {
  const url = getChainsawV2Url();
  url.pathname += "/transactions";
  return url;
}

/**
 * Endpoint to get events
 * @internal
 */
export function getEventsEndpoint(): URL {
  const url = getChainsawV2Url();
  url.pathname += "/events";
  return url;
}

/**
 * Endpoint to get NFTs by collection
 * @internal
 */
export function getNftsByCollectionEndpoint(): URL {
  const url = getChainsawV2Url();
  url.pathname += "/nfts/by-collection";
  return url;
}

/**
 * Endpoint to get NFTs by owner
 * @internal
 */
export function getNftsByOwnerEndpoint(): URL {
  const url = getChainsawV2Url();
  url.pathname += "/nfts/by-owner";
  return url;
}
