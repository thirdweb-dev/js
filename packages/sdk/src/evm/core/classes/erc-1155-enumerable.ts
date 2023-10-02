import type { IERC1155Enumerable } from "@thirdweb-dev/contracts-js";
import { BigNumber, BigNumberish } from "ethers";
import {
  DEFAULT_QUERY_ALL_COUNT,
  QueryAllParams,
} from "../../../core/schema/QueryParams";
import { NFT } from "../../../core/schema/nft";
import { resolveAddress } from "../../common/ens/resolveAddress";
import { FEATURE_EDITION_ENUMERABLE } from "../../constants/erc1155-features";
import { AddressOrEns } from "../../schema/shared/AddressOrEnsSchema";
import { BaseERC1155 } from "../../types/eips";
import { DetectableFeature } from "../interfaces/DetectableFeature";
import { ContractWrapper } from "./contract-wrapper";
import type { Erc1155 } from "./erc-1155";

/**
 * List ERC1155 NFTs
 * @remarks Easily list all the NFTs in a ERC1155 contract.
 * @example
 * ```javascript
 * const contract = await sdk.getContract("{{contract_address}}");
 * const nfts = await contract.edition.query.all();
 * ```
 * @public
 */

export class Erc1155Enumerable implements DetectableFeature {
  featureName = FEATURE_EDITION_ENUMERABLE.name;
  private contractWrapper: ContractWrapper<BaseERC1155 & IERC1155Enumerable>;
  private erc1155: Erc1155;

  constructor(
    erc1155: Erc1155,
    contractWrapper: ContractWrapper<BaseERC1155 & IERC1155Enumerable>,
  ) {
    this.erc1155 = erc1155;
    this.contractWrapper = contractWrapper;
  }

  /**
   * Get All NFTs
   *
   * @remarks Get all the data associated with every NFT in this contract.
   *
   * By default, returns the first 100 NFTs, use queryParams to fetch more.
   *
   * @example
   * ```javascript
   * const nfts = await contract.edition.query.all();
   * ```
   * @param queryParams - optional filtering to only fetch a subset of results.
   * @returns The NFT metadata for all NFTs queried.
   */
  public async all(queryParams?: QueryAllParams): Promise<NFT[]> {
    const start = BigNumber.from(queryParams?.start || 0).toNumber();
    const count = BigNumber.from(
      queryParams?.count || DEFAULT_QUERY_ALL_COUNT,
    ).toNumber();
    const maxId = Math.min((await this.totalCount()).toNumber(), start + count);
    return await Promise.all(
      [...Array(maxId - start).keys()].map((i) =>
        this.erc1155.get((start + i).toString()),
      ),
    );
  }

  /**
   * Get the number of NFTs minted
   * @remarks This returns the total number of NFTs minted in this contract, **not** the total supply of a given token.
   *
   * @returns the total number of NFTs minted in this contract
   * @public
   */
  public async totalCount(): Promise<BigNumber> {
    return await this.contractWrapper.read("nextTokenIdToMint", []);
  }

  /**
   * Get the supply of token for a given tokenId.
   * @remarks This is **not** the sum of supply of all NFTs in the contract.
   *
   * @returns the total number of NFTs minted in this contract
   * @public
   */
  public async totalCirculatingSupply(
    tokenId: BigNumberish,
  ): Promise<BigNumber> {
    return await this.contractWrapper.read("totalSupply", [tokenId]);
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
   * const nfts = await contract.edition.query.owned(address);
   * ```
   *
   * @returns The NFT metadata for all NFTs in the contract.
   */
  public async owned(
    walletAddress?: AddressOrEns,
    queryParams?: QueryAllParams,
  ): Promise<NFT[]> {
    const [address, maxId] = await Promise.all([
      resolveAddress(
        walletAddress || (await this.contractWrapper.getSignerAddress()),
      ),
      this.contractWrapper.read("nextTokenIdToMint", []),
    ]);
    const balances = await this.contractWrapper.read("balanceOfBatch", [
      Array(maxId.toNumber()).fill(address),
      Array.from(Array(maxId.toNumber()).keys()),
    ]);

    let ownedBalances = balances
      .map((b, i) => {
        return {
          tokenId: i,
          balance: b,
        };
      })
      .filter((b) => b.balance.gt(0));
    if (queryParams) {
      const page = queryParams?.start || 0;
      const count = queryParams?.count || DEFAULT_QUERY_ALL_COUNT;
      const startIndex = page * count;
      ownedBalances = ownedBalances.slice(startIndex, startIndex + count);
    }
    const nfts = (
      await Promise.all(
        ownedBalances.map((item) => this.erc1155.get(item.tokenId.toString())),
      )
    ).map((editionMetadata, index) => ({
      ...editionMetadata,
      owner: address,
      quantityOwned: ownedBalances[index].balance.toString(),
    }));
    return nfts;
  }
}
