import { FEATURE_NFT_BURNABLE } from "../../constants/erc721-features";
import { DetectableFeature } from "../interfaces/DetectableFeature";
import { TransactionResult } from "../types";
import { ContractWrapper } from "./contract-wrapper";
import { IBurnableERC721 } from "@thirdweb-dev/contracts-js";
import { BigNumberish } from "ethers";

export class Erc721Burnable implements DetectableFeature {
  featureName = FEATURE_NFT_BURNABLE.name;

  private contractWrapper: ContractWrapper<IBurnableERC721>;

  constructor(contractWrapper: ContractWrapper<IBurnableERC721>) {
    this.contractWrapper = contractWrapper;
  }

  /**
   * Burn NFTs
   *
   * @remarks Burn NFTs held by the connected wallet
   *
   * @example
   * ```javascript
   * // The token ID of the NFT you want to burn
   * const tokenId = 0;
   *
   * await contract.nft.burn.token(tokenId);
   * ```
   */
  public async token(tokenId: BigNumberish): Promise<TransactionResult> {
    return {
      receipt: await this.contractWrapper.sendTransaction("burn", [tokenId]),
    };
  }
}
