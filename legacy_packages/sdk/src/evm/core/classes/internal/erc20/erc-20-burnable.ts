import { resolveAddress } from "../../../../common/ens/resolveAddress";
import { buildTransactionFunction } from "../../../../common/transactions";
import { FEATURE_TOKEN_BURNABLE } from "../../../../constants/erc20-features";
import type { AddressOrEns } from "../../../../schema/shared/AddressOrEnsSchema";
import type { Amount } from "../../../../types/currency";
import type { DetectableFeature } from "../../../interfaces/DetectableFeature";
import type { ContractWrapper } from "../contract-wrapper";
import { Transaction } from "../../transactions";
import type { IBurnableERC20 } from "@thirdweb-dev/contracts-js";
import type { Erc20 } from "../../erc-20";

/**
 * @internal
 */
export class Erc20Burnable implements DetectableFeature {
  featureName = FEATURE_TOKEN_BURNABLE.name;

  private erc20: Erc20;
  private contractWrapper: ContractWrapper<IBurnableERC20>;

  constructor(erc20: Erc20, contractWrapper: ContractWrapper<IBurnableERC20>) {
    this.erc20 = erc20;
    this.contractWrapper = contractWrapper;
  }

  /**
   * Burn Tokens
   *
   * @remarks Burn tokens held by the connected wallet
   *
   * @example
   * ```javascript
   * // The amount of this token you want to burn
   * const amount = 1.2;
   *
   * await contract.token.burn.tokens(amount);
   * ```
   */
  tokens = /* @__PURE__ */ buildTransactionFunction(async (amount: Amount) => {
    return Transaction.fromContractWrapper({
      contractWrapper: this.contractWrapper,
      method: "burn",
      args: [await this.erc20.normalizeAmount(amount)],
    });
  });

  /**
   * Burn Tokens
   *
   * @remarks Burn tokens held by the specified wallet
   *
   * @example
   * ```javascript
   * // Address of the wallet sending the tokens
   * const holderAddress = "{{wallet_address}}";
   *
   * // The amount of this token you want to burn
   * const amount = 1.2;
   *
   * await contract.token.burn.from(holderAddress, amount);
   * ```
   */
  from = /* @__PURE__ */ buildTransactionFunction(
    async (holder: AddressOrEns, amount: Amount) => {
      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "burnFrom",
        args: await Promise.all([
          resolveAddress(holder),
          this.erc20.normalizeAmount(amount),
        ]),
      });
    },
  );
}
