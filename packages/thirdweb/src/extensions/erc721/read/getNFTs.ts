import type { ThirdwebContract } from "../../../contract/index.js";
import { startTokenId } from "./startTokenId.js";
import { nextTokenIdToMint } from "./nextTokenIdToMint.js";
import { min } from "../../../utils/bigint.js";
import { getNFT } from "./getNFT.js";
import type { NFT } from "../../../utils/nft/parseNft.js";

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
export async function getNFTs(
  contract: ThirdwebContract,
  params: GetNFTsParams,
): Promise<NFT[]> {
  const [startTokenId_, maxSupply] = await Promise.all([
    startTokenId(contract).catch(() => {
      // this method only exists on some contracts
      // if it does not exist we can safely assume the start token ID is 0
      return 0n;
    }),
    nextTokenIdToMint(contract),
  ]);
  const start = BigInt(params.start ?? 0) + startTokenId_;
  const count = BigInt(params.count ?? DEFAULT_QUERY_ALL_COUNT);

  const maxId = min(maxSupply + startTokenId_, start + count);

  return await Promise.all(
    Array(maxId - start).map((_, i) =>
      getNFT(contract, {
        tokenId: BigInt(i),
        includeOwner: params.includeOwners ?? false,
      }),
    ),
  );
}
