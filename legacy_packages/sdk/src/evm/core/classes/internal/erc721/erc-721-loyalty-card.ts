import { buildTransactionFunction } from "../../../../common/transactions";
import { FEATURE_NFT_LOYALTY_CARD } from "../../../../constants/erc721-features";
import { DetectableFeature } from "../../../interfaces/DetectableFeature";
import { ContractWrapper } from "../contract-wrapper";
import { Transaction } from "../../transactions";
import type { ILoyaltyCard } from "@thirdweb-dev/contracts-js";
import { BigNumberish } from "ethers";

export class Erc721LoyaltyCard implements DetectableFeature {
  featureName = FEATURE_NFT_LOYALTY_CARD.name;

  private contractWrapper: ContractWrapper<ILoyaltyCard>;

  constructor(contractWrapper: ContractWrapper<ILoyaltyCard>) {
    this.contractWrapper = contractWrapper;
  }

  /**
   * Cancel loyalty card NFTs
   *
   * @remarks Cancel loyalty card NFTs held by the connected wallet
   *
   * @example
   * ```javascript
   * // The token ID of the loyalty card you want to cancel
   * const tokenId = 0;
   *
   * await contract.nft.loyaltyCard.cancel(tokenId);
   * ```
   */
  cancel = /* @__PURE__ */ buildTransactionFunction(
    async (tokenId: BigNumberish) => {
      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "cancel",
        args: [tokenId],
      });
    },
  );

  /**
   * Revoke loyalty card NFTs
   *
   * @remarks Revoke loyalty card NFTs held by some owner.
   *
   * @example
   * ```javascript
   * // The token ID of the loyalty card you want to revoke
   * const tokenId = 0;
   *
   * await contract.nft.loyaltyCard.revoke(tokenId);
   * ```
   */
  revoke = /* @__PURE__ */ buildTransactionFunction(
    async (tokenId: BigNumberish) => {
      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "revoke",
        args: [tokenId],
      });
    },
  );
}
