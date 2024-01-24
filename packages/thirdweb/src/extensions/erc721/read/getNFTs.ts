import { startTokenId } from "./startTokenId.js";
import { nextTokenIdToMint } from "./nextTokenIdToMint.js";
import { min } from "../../../utils/bigint.js";
import { getNFT } from "./getNFT.js";
import {
  extractTXOpts,
  type ThirdwebClientLike,
  type TxOpts,
} from "../../../transaction/transaction.js";
import { totalSupply } from "./totalSupply.js";

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
 * Retrieves a list of NFTs from the contract.
 *
 * @param contract - TThe {@link ThirdwebContract} instance representing the ERC721 contract.
 * @param params - The {@link GetNFTsParams} object containing the token ID and additional options.
 * @returns A promise that resolves to an array of {@link NFT}s.
 */
export async function getNFTs<client extends ThirdwebClientLike>(
  options: TxOpts<client, GetNFTsParams>,
) {
  const [opts, params] = extractTXOpts(options);
  const [startTokenId_, maxSupply] = await Promise.allSettled([
    startTokenId(opts),
    nextTokenIdToMint(opts),
    totalSupply(opts),
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
  const start = BigInt(params.start ?? 0) + startTokenId_;
  const count = BigInt(params.count ?? DEFAULT_QUERY_ALL_COUNT);

  const maxId = min(maxSupply + startTokenId_, start + count);

  console.log({
    start,
    count,
    maxId,
    maxSupply,
    startTokenId_,
    params,
  });

  const promises: ReturnType<typeof getNFT>[] = [];

  for (let i = start; i < maxId; i++) {
    promises.push(
      getNFT({
        ...opts,
        tokenId: i,
        includeOwner: params.includeOwners ?? false,
      }),
    );
  }

  return await Promise.all(promises);
}
