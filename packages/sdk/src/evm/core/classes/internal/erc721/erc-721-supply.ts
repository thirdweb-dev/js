import type {
  IERC721AQueryableUpgradeable,
  IERC721Enumerable,
  IERC721Supply,
  OpenEditionERC721,
} from "@thirdweb-dev/contracts-js";
import { BigNumber, constants } from "ethers";
import type { QueryAllParams } from "../../../../../core/schema/QueryParams";
import { DEFAULT_QUERY_ALL_COUNT } from "../../../../../core/schema/QueryParams";
import type { NFT } from "../../../../../core/schema/nft";
import { detectContractFeature } from "../../../../common/feature-detection/detectContractFeature";
import { hasFunction } from "../../../../common/feature-detection/hasFunction";
import { FEATURE_NFT_SUPPLY } from "../../../../constants/erc721-features";
import type { BaseERC721 } from "../../../../types/eips";
import { DetectableFeature } from "../../../interfaces/DetectableFeature";
import type { ContractWrapper } from "../contract-wrapper";
import type { Erc721 } from "../../erc-721";
import { Erc721Enumerable } from "./erc-721-enumerable";
import { Erc721AQueryable } from "./erc-721a-queryable";

/**
 * List ERC721 NFTs
 * @remarks Easily list all the NFTs in a ERC721 contract.
 * @example
 * ```javascript
 * const contract = await sdk.getContract("{{contract_address}}");
 * const nfts = await contract.nft.query.all();
 * ```
 * @public
 */

export class Erc721Supply implements DetectableFeature {
  featureName = FEATURE_NFT_SUPPLY.name;
  private contractWrapper: ContractWrapper<BaseERC721 & IERC721Supply>;
  private erc721: Erc721;

  public owned: Erc721Enumerable | Erc721AQueryable | undefined;

  constructor(
    erc721: Erc721,
    contractWrapper: ContractWrapper<BaseERC721 & IERC721Supply>,
  ) {
    this.erc721 = erc721;
    this.contractWrapper = contractWrapper;
    this.owned = this.detectErc721Owned();
  }

  /**
   * Get all NFTs
   *
   * @remarks Get all the data associated with every NFT in this contract.
   *
   * By default, returns the first 100 NFTs, use queryParams to fetch more.
   *
   * @example
   * ```javascript
   * const nfts = await contract.nft.query.all();
   * ```
   * @param queryParams - optional filtering to only fetch a subset of results.
   * @returns The NFT metadata for all NFTs queried.
   */
  public async all(queryParams?: QueryAllParams): Promise<NFT[]> {
    let startTokenId = BigNumber.from(0);
    if (hasFunction<OpenEditionERC721>("startTokenId", this.contractWrapper)) {
      startTokenId = await this.contractWrapper.read("startTokenId", []);
    }
    const start = BigNumber.from(queryParams?.start || 0)
      .add(startTokenId)
      .toNumber();
    const count = BigNumber.from(
      queryParams?.count || DEFAULT_QUERY_ALL_COUNT,
    ).toNumber();

    const maxSupply = await this.erc721.nextTokenIdToMint();
    const maxId = Math.min(
      maxSupply.add(startTokenId).toNumber(),
      start + count,
    );
    return await Promise.all(
      [...Array(maxId - start).keys()].map((i) =>
        this.erc721.get((start + i).toString()),
      ),
    );
  }

  /**
   * Return all the owners of each token id in this contract
   * @returns
   */
  public async allOwners(queryParams?: QueryAllParams) {
    let totalCount: BigNumber;
    let startTokenId = BigNumber.from(0);
    if (hasFunction<OpenEditionERC721>("startTokenId", this.contractWrapper)) {
      startTokenId = await this.contractWrapper.read("startTokenId", []);
    }
    try {
      totalCount = await this.erc721.totalClaimedSupply();
    } catch (e) {
      totalCount = await this.totalCount();
    }

    totalCount = totalCount.add(startTokenId);

    // TODO use multicall3 if available
    // TODO can't call toNumber() here, this can be a very large number
    let arr = [...new Array(totalCount.toNumber()).keys()];
    if (queryParams) {
      const start = queryParams?.start || 0;
      const count = queryParams?.count || DEFAULT_QUERY_ALL_COUNT;
      arr = arr.slice(start, start + count);
    }
    const owners = await Promise.all(
      arr.map((i) => this.erc721.ownerOf(i).catch(() => constants.AddressZero)),
    );
    return arr
      .map((i) => ({
        tokenId: i,
        owner: owners[i],
      }))
      .filter((o) => o.owner !== constants.AddressZero);
  }

  /**
   * Get the number of NFTs minted
   * @remarks This returns the total number of NFTs minted in this contract, **not** the total supply of a given token.
   *
   * @returns The total number of NFTs minted in this contract
   * @public
   */
  public async totalCount(): Promise<BigNumber> {
    return await this.erc721.nextTokenIdToMint();
  }

  /**
   * Get the number of NFTs of this contract currently owned by end users
   * @returns The total number of NFTs of this contract in circulation (minted & not burned)
   * @public
   */
  public async totalCirculatingSupply(): Promise<BigNumber> {
    return await this.contractWrapper.read("totalSupply", []);
  }

  private detectErc721Owned(): Erc721Enumerable | Erc721AQueryable | undefined {
    if (
      detectContractFeature<BaseERC721 & IERC721Enumerable>(
        this.contractWrapper,
        "ERC721Enumerable",
      )
    ) {
      return new Erc721Enumerable(this.erc721, this.contractWrapper);
    } else if (
      detectContractFeature<BaseERC721 & IERC721AQueryableUpgradeable>(
        this.contractWrapper,
        "ERC721AQueryable",
      )
    ) {
      return new Erc721AQueryable(this.erc721, this.contractWrapper);
    }
    return undefined;
  }
}
