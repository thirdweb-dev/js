import type { IERC721Enumerable } from "@thirdweb-dev/contracts-js";
import { BigNumber } from "ethers";
import type { NFT } from "../../../../../core/schema/nft";
import { resolveAddress } from "../../../../common/ens/resolveAddress";
import { FEATURE_NFT_ENUMERABLE } from "../../../../constants/erc721-features";
import type { AddressOrEns } from "../../../../schema/shared/AddressOrEnsSchema";
import type { BaseERC721 } from "../../../../types/eips";
import { DetectableFeature } from "../../../interfaces/DetectableFeature";
import type { ContractWrapper } from "../contract-wrapper";
import type { Erc721 } from "../../erc-721";
import {
  DEFAULT_QUERY_ALL_COUNT,
  QueryAllParams,
} from "../../../../../core/schema/QueryParams";

/**
 * List owned ERC721 NFTs
 * @remarks Easily list all the NFTs from a ERC721 contract, owned by a certain wallet.
 * @example
 * ```javascript
 * const contract = await sdk.getContract("{{contract_address}}");
 * const walletAddress = "0x...";
 * const ownedNFTs = await contract.nft.query.owned.all(walletAddress);
 * ```
 * @public
 */

export class Erc721Enumerable implements DetectableFeature {
  featureName = FEATURE_NFT_ENUMERABLE.name;
  private contractWrapper: ContractWrapper<BaseERC721 & IERC721Enumerable>;
  private erc721: Erc721;

  constructor(
    erc721: Erc721,
    contractWrapper: ContractWrapper<BaseERC721 & IERC721Enumerable>,
  ) {
    this.erc721 = erc721;
    this.contractWrapper = contractWrapper;
  }

  /**
   * Get all NFTs owned by a specific wallet
   *
   * @remarks Get all the data associated with the NFTs owned by a specific wallet.
   *
   * @example
   * ```javascript
   * // Address of the wallet to get the NFTs of
   * const address = "{{wallet_address}}";
   * const nfts = await contract.nft.query.owned.all(address);
   * ```
   * @param walletAddress - the wallet address to query, defaults to the connected wallet
   * @param queryParams - optional filtering to only fetch a subset of results.
   * @returns The NFT metadata for all NFTs in the contract.
   */
  public async all(
    walletAddress?: AddressOrEns,
    queryParams?: QueryAllParams,
  ): Promise<NFT[]> {
    let tokenIds = await this.tokenIds(walletAddress);
    if (queryParams) {
      const start = queryParams?.start || 0;
      const count = queryParams?.count || DEFAULT_QUERY_ALL_COUNT;
      tokenIds = tokenIds.slice(start, start + count);
    }
    return await Promise.all(
      tokenIds.map((tokenId) => this.erc721.get(tokenId.toString())),
    );
  }

  /**
   * Get all token ids of NFTs owned by a specific wallet.
   * @param walletAddress - the wallet address to query, defaults to the connected wallet
   */
  public async tokenIds(walletAddress?: AddressOrEns): Promise<BigNumber[]> {
    const address = await resolveAddress(
      walletAddress || (await this.contractWrapper.getSignerAddress()),
    );

    const balance = await this.contractWrapper.read("balanceOf", [address]);
    const indices = Array.from(Array(balance.toNumber()).keys());
    return await Promise.all(
      indices.map((i) =>
        this.contractWrapper.read("tokenOfOwnerByIndex", [address, i]),
      ),
    );
  }
}
