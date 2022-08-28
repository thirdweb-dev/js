import { ContractWrapper } from "./contract-wrapper";
import { IERC721Enumerable } from "@thirdweb-dev/contracts-js";
import { BigNumber } from "ethers";
import { NFTMetadataOwner } from "../../schema";
import { Erc721 } from "./erc-721";
import { BaseERC721 } from "../../types/eips";
import { FEATURE_NFT_ENUMERABLE } from "../../constants/erc721-features";
import { DetectableFeature } from "../interfaces/DetectableFeature";

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
   * Get Owned NFTs
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
   * @returns The NFT metadata for all NFTs in the contract.
   */
  public async all(walletAddress?: string): Promise<NFTMetadataOwner[]> {
    const tokenIds = await this.tokenIds(walletAddress);
    return await Promise.all(
      tokenIds.map((tokenId) => this.erc721.get(tokenId.toString())),
    );
  }

  /**
   * Get all token ids of NFTs owned by a specific wallet.
   * @param walletAddress - the wallet address to query, defaults to the connected wallet
   */
  public async tokenIds(walletAddress?: string): Promise<BigNumber[]> {
    const address =
      walletAddress || (await this.contractWrapper.getSignerAddress());

    const balance = await this.contractWrapper.readContract.balanceOf(address);
    const indices = Array.from(Array(balance.toNumber()).keys());
    return await Promise.all(
      indices.map((i) =>
        this.contractWrapper.readContract.tokenOfOwnerByIndex(address, i),
      ),
    );
  }
}
