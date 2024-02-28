import { startTokenId } from "./startTokenId.js";
import { nextTokenIdToMint } from "./nextTokenIdToMint.js";
import { getNFT } from "./getNFT.js";
import { totalSupply } from "./totalSupply.js";
import type { NFT } from "../../../utils/nft/parseNft.js";
import { min } from "../../../utils/bigint.js";
import type { BaseTransactionOptions } from "../../../transaction/types.js";

const DEFAULT_QUERY_ALL_COUNT = 100n;

/**
 * Parameters for retrieving NFTs.
 */
export type GetNFTsParams = {
  /**
   * Which tokenId to start at.
   */
  start?: number;
  /**
   * The number of NFTs to retrieve.
   */
  count?: number;
  /**
   * Whether to include the owner of each NFT.
   */
  includeOwners?: boolean;
};

/**
 * Retrieves an array of NFTs ("ERC721") based on the provided options.
 * @param options - The options for retrieving the NFTs.
 * @returns A promise that resolves to an array of NFTs.
 * @throws An error if the contract requires either `nextTokenIdToMint` or `totalSupply` function to determine the next token ID to mint.
 * @extension ERC721
 * @example
 * ```ts
 * import { getNFTs } from "thirdweb/extensions/erc721";
 * const nfts = await getNFTs({
 *  contract,
 *  start: 0,
 *  count: 10,
 * });
 * ```
 */
export async function getNFTs(
  options: BaseTransactionOptions<GetNFTsParams>,
): Promise<NFT[]> {
  const [startTokenId_, maxSupply] = await Promise.allSettled([
    startTokenId(options),
    nextTokenIdToMint(options),
    totalSupply(options),
  ]).then(([_startTokenId, _next, _total]) => {
    // default to 0 if startTokenId is not available
    const startTokenId__ =
      _startTokenId.status === "fulfilled" ? _startTokenId.value : 0n;
    let maxSupply_;
    // prioritize nextTokenIdToMint
    if (_next.status === "fulfilled") {
      // because we always default the startTokenId to 0 we can safely just always subtract here
      maxSupply_ = _next.value - startTokenId__;
    }
    // otherwise use totalSupply
    else if (_total.status === "fulfilled") {
      maxSupply_ = _total.value;
    } else {
      throw new Error(
        "Contract requires either `nextTokenIdToMint` or `totalSupply` function available to determine the next token ID to mint",
      );
    }
    return [startTokenId__, maxSupply_] as const;
  });
  const start = BigInt(options.start ?? 0) + startTokenId_;
  const count = BigInt(options.count ?? DEFAULT_QUERY_ALL_COUNT);

  const maxId = min(maxSupply + startTokenId_, start + count);

  const promises: ReturnType<typeof getNFT>[] = [];

  for (let i = start; i < maxId; i++) {
    promises.push(
      getNFT({
        ...options,
        tokenId: i,
        includeOwner: options.includeOwners ?? false,
      }),
    );
  }

  return await Promise.all(promises);
}
