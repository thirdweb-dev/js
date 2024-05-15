import { resolveAddress } from "../../../../common/ens/resolveAddress";
import { buildTransactionFunction } from "../../../../common/transactions";
import { FEATURE_EDITION_BURNABLE } from "../../../../constants/erc1155-features";
import { AddressOrEns } from "../../../../schema/shared/AddressOrEnsSchema";
import { DetectableFeature } from "../../../interfaces/DetectableFeature";
import { ContractWrapper } from "../contract-wrapper";
import { Transaction } from "../../transactions";
import type { IBurnableERC1155 } from "@thirdweb-dev/contracts-js";
import { BigNumberish } from "ethers";

export class Erc1155Burnable implements DetectableFeature {
  featureName = FEATURE_EDITION_BURNABLE.name;

  private contractWrapper: ContractWrapper<IBurnableERC1155>;

  constructor(contractWrapper: ContractWrapper<IBurnableERC1155>) {
    this.contractWrapper = contractWrapper;
  }

  /**
   * Burn a specified amount of a NFTs
   *
   * @remarks Burn the specified NFTs from the connected wallet
   *
   * @param tokenId - the token Id to burn
   * @param amount - amount to burn
   *
   * @example
   * ```javascript
   * // The token ID to burn NFTs of
   * const tokenId = 0;
   * // The amount of the NFT you want to burn
   * const amount = 2;
   *
   * const result = await contract.edition.burn.tokens(tokenId, amount);
   * ```
   */
  tokens = /* @__PURE__ */ buildTransactionFunction(
    async (tokenId: BigNumberish, amount: BigNumberish) => {
      const account = await this.contractWrapper.getSignerAddress();
      return this.from.prepare(account, tokenId, amount);
    },
  );

  /**
   * Burn a specified amount of a NFTs
   *
   * @remarks Burn the specified NFTs from a specified wallet
   *
   * @param account - the address to burn NFTs from
   * @param tokenId - the tokenId to burn
   * @param amount - amount to burn
   *
   * @example
   * ```javascript
   * // The address of the wallet to burn NFTS from
   * const account = "0x...";
   * // The token ID to burn NFTs of
   * const tokenId = 0;
   * // The amount of this NFT you want to burn
   * const amount = 2;
   *
   * const result = await contract.edition.burn.from(account, tokenId, amount);
   * ```
   */
  from = /* @__PURE__ */ buildTransactionFunction(
    async (
      account: AddressOrEns,
      tokenId: BigNumberish,
      amount: BigNumberish,
    ) => {
      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "burn",
        args: [await resolveAddress(account), tokenId, amount],
      });
    },
  );

  /**
   * Burn a batch of NFTs
   *
   * @remarks Burn the batch NFTs from the connected wallet
   *
   * @param tokenIds - the tokenIds to burn
   * @param amounts - amount of each token to burn
   *
   * @example
   * ```javascript
   * // The token IDs to burn NFTs of
   * const tokenIds = [0, 1];
   * // The amounts of each NFT you want to burn
   * const amounts = [2, 2];
   *
   * const result = await contract.edition.burn.batch(tokenIds, amounts);
   * ```
   */
  batch = /* @__PURE__ */ buildTransactionFunction(
    async (tokenIds: BigNumberish[], amounts: BigNumberish[]) => {
      const account = await this.contractWrapper.getSignerAddress();
      return this.batchFrom.prepare(account, tokenIds, amounts);
    },
  );

  /**
   * Burn a batch of NFTs
   *
   * @remarks Burn the batch NFTs from the specified wallet
   *
   * @param account - the address to burn NFTs from
   * @param tokenIds - the tokenIds to burn
   * @param amounts - amount of each token to burn
   *
   * @example
   * ```javascript
   * // The address of the wallet to burn NFTS from
   * const account = "0x...";
   * // The token IDs to burn NFTs of
   * const tokenIds = [0, 1];
   * // The amounts of each NFT you want to burn
   * const amounts = [2, 2];
   *
   * const result = await contract.edition.burn.batchFrom(account, tokenIds, amounts);
   * ```
   */
  batchFrom = /* @__PURE__ */ buildTransactionFunction(
    async (
      account: AddressOrEns,
      tokenIds: BigNumberish[],
      amounts: BigNumberish[],
    ) => {
      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "burnBatch",
        args: [await resolveAddress(account), tokenIds, amounts],
      });
    },
  );
}
