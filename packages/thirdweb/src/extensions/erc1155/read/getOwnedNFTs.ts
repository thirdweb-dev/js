import { nextTokenIdToMint } from "./nextTokenIdToMint.js";
import { getNFT } from "./getNFT.js";
import { balanceOfBatch } from "./balanceOfBatch.js";
import type { Address } from "abitype";
import type { NFT } from "../../../utils/nft/parseNft.js";
import type { Account } from "../../../wallets/interfaces/wallet.js";
import type { BaseTransactionOptions } from "../../../transaction/types.js";

const DEFAULT_QUERY_ALL_COUNT = 100;

/**
 * Parameters for retrieving NFTs.
 */
export type GetOwnedNFTsParams = {
  /**
   * Which tokenId to start at.
   */
  start?: number;
  /**
   * The number of NFTs to retrieve.
   */
  count?: number;
  /**
   * The address of the wallet to get the NFTs of.
   */
  account: Pick<Account, "address">;
};

/**
 * Retrieves the owned ERC1155 NFTs for a given wallet address.
 * @param options - The transaction options and parameters.
 * @returns A promise that resolves to an array of ERC1155 NFTs owned by the wallet address, along with the quantity owned.
 * @extension ERC1155
 * @example
 * ```ts
 * import { getOwnedNFTs } from "thirdweb/extensions/erc1155";
 * const nfts = await getOwnedNFTs({
 *  contract,
 *  start: 0,
 *  count: 10,
 *  account: { address: "0x123..." },
 * });
 * ```
 */
export async function getOwnedNFTs(
  options: BaseTransactionOptions<GetOwnedNFTsParams>,
): Promise<(NFT<"ERC1155"> & { quantityOwned: bigint })[]> {
  const maxId = await nextTokenIdToMint(options);

  // approach is naieve, likely can be improved
  const owners: Address[] = [];
  const tokenIds: bigint[] = [];
  for (let i = 0n; i < maxId; i++) {
    owners.push(options.account.address);
    tokenIds.push(i);
  }

  const balances = await balanceOfBatch({
    ...options,
    owners,
    tokenIds,
  });

  let ownedBalances = balances
    .map((b, i) => {
      return {
        tokenId: i,
        balance: b,
      };
    })
    .filter((b) => b.balance > 0);

  if (options.start || options.count) {
    const start = options?.start || 0;
    const count = options?.count || DEFAULT_QUERY_ALL_COUNT;
    ownedBalances = ownedBalances.slice(start, start + count);
  }

  const nfts = await Promise.all(
    ownedBalances.map((ob) =>
      getNFT({ ...options, tokenId: BigInt(ob.tokenId) }),
    ),
  );

  return nfts.map((nft, index) => ({
    ...nft,
    owner: options.account.address,
    quantityOwned: ownedBalances[index]?.balance || 0n,
  }));
}
