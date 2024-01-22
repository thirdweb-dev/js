import { buildTransactionFunction } from "../../../../common/transactions";
import { FEATURE_NFT_BURNABLE } from "../../../../constants/erc721-features";
import { DetectableFeature } from "../../../interfaces/DetectableFeature";
import { ContractWrapper } from "../contract-wrapper";
import { Transaction } from "../../transactions";
import type { IBurnableERC721 } from "@thirdweb-dev/contracts-js";
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
  token = /* @__PURE__ */ buildTransactionFunction(
    async (tokenId: BigNumberish) => {
      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "burn",
        args: [tokenId],
      });
    },
  );
}
