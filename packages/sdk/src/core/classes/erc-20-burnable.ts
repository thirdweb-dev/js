import { FEATURE_TOKEN_BURNABLE } from "../../constants/erc20-features";
import { Amount } from "../../types/currency";
import { DetectableFeature } from "../interfaces/DetectableFeature";
import { TransactionResult } from "../types";
import { ContractWrapper } from "./contract-wrapper";
import { Erc20 } from "./erc-20";
import type { IBurnableERC20 } from "@thirdweb-dev/contracts-js";

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
  public async tokens(amount: Amount): Promise<TransactionResult> {
    return {
      receipt: await this.contractWrapper.sendTransaction("burn", [
        await this.erc20.normalizeAmount(amount),
      ]),
    };
  }

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
  public async from(
    holder: string,
    amount: Amount,
  ): Promise<TransactionResult> {
    return {
      receipt: await this.contractWrapper.sendTransaction("burnFrom", [
        holder,
        await this.erc20.normalizeAmount(amount),
      ]),
    };
  }
}
