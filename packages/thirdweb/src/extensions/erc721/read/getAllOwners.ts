import { ADDRESS_ZERO } from "../../../constants/addresses.js";
import type { BaseTransactionOptions } from "../../../transaction/types.js";
import { min } from "../../../utils/bigint.js";
import { ownerOf } from "../__generated__/IERC721A/read/ownerOf.js";
import { startTokenId } from "../__generated__/IERC721A/read/startTokenId.js";
import { totalSupply } from "../__generated__/IERC721A/read/totalSupply.js";
import { nextTokenIdToMint } from "../__generated__/IERC721Enumerable/read/nextTokenIdToMint.js";

const DEFAULT_QUERY_ALL_COUNT = 100n;

/**
 * Parameters for retrieving NFTs.
 */
export type GetAllOwnersParams = {
  /**
   * Which tokenId to start at.
   * @default 0
   */
  start?: number;
  /**
   * The number of NFTs to retrieve.
   * @default 100
   */
  count?: number;
};

/**
 * Retrieves the owners of all ERC721 tokens within a specified range.
 * @param options - The options for retrieving the owners.
 * @returns A promise that resolves to an array of objects containing the token ID and owner address.
 * @throws An error if the contract does not have either `nextTokenIdToMint` or `totalSupply` function available.
 * @extension ERC721
 * @example
 * ```ts
 * import { getAllOwners } from "thirdweb/extensions/erc721";
 * const owners = await getAllOwners({
 *  contract,
 *  start: 0,
 *  count: 10,
 * });
 * ```
 */
export async function getAllOwners(
  options: BaseTransactionOptions<GetAllOwnersParams>,
): Promise<{ tokenId: bigint; owner: string }[]> {
  const [startTokenId_, maxSupply] = await Promise.allSettled([
    startTokenId(options),
    nextTokenIdToMint(options),
    totalSupply(options),
  ]).then(([_startTokenId, _next, _total]) => {
    // default to 0 if startTokenId is not available
    const startTokenId__ =
      _startTokenId.status === "fulfilled" ? _startTokenId.value : 0n;
    let maxSupply_: bigint;
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

  const promises: Promise<{ tokenId: bigint; owner: string }>[] = [];

  for (let i = start; i < maxId; i++) {
    promises.push(
      ownerOf({ contract: options.contract, tokenId: i })
        .catch(() => ADDRESS_ZERO)
        .then((owner) => ({
          tokenId: i,
          owner,
        })),
    );
  }

  return await Promise.all(promises);
}
