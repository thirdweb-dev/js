import { FEATURE_PRIMARY_SALE } from "../../constants/thirdweb-features";
import { DetectableFeature } from "../interfaces/DetectableFeature";
import { TransactionResult } from "../types";
import { ContractWrapper } from "./contract-wrapper";
import { IPrimarySale } from "@thirdweb-dev/contracts-js";

/**
 * Handle primary sales recipients
 * @remarks Configure primary sale recipients for an entire contract.
 * @example
 * ```javascript
 * const contract = await sdk.getContract("{{contract_address}}");
 * const salesRecipient = await contract.sales.getRecipient();
 * await contract.sales.setRecipient(recipientWalletAddress);
 * ```
 * @public
 */
export class ContractPrimarySale<TContract extends IPrimarySale>
  implements DetectableFeature
{
  featureName = FEATURE_PRIMARY_SALE.name;
  private contractWrapper;

  constructor(contractWrapper: ContractWrapper<TContract>) {
    this.contractWrapper = contractWrapper;
  }

  /**
   * Get the primary sale recipient.
   * @returns the wallet address.
   * @example
   * ```javascript
   * const salesRecipient = await contract.sales.getRecipient();
   * ```
   * @public
   * @twfeature PrimarySale
   */
  public async getRecipient(): Promise<string> {
    return await this.contractWrapper.readContract.primarySaleRecipient();
  }

  /**
   * Set the primary sale recipient
   * @param recipient - the wallet address
   * @example
   * ```javascript
   * await contract.sales.setRecipient(recipientWalletAddress);
   * ```
   * @public
   * @twfeature PrimarySale
   */
  public async setRecipient(recipient: string): Promise<TransactionResult> {
    return {
      receipt: await this.contractWrapper.sendTransaction(
        "setPrimarySaleRecipient",
        [recipient],
      ),
    };
  }
}
