import type { IPrimarySale } from "@thirdweb-dev/contracts-js";
import { buildTransactionFunction } from "../../common/transactions";
import { FEATURE_PRIMARY_SALE } from "../../constants/thirdweb-features";
import { Address } from "../../schema/shared/Address";
import { DetectableFeature } from "../interfaces/DetectableFeature";
import { ContractWrapper } from "./internal/contract-wrapper";
import { Transaction } from "./transactions";

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
export class ContractPrimarySale implements DetectableFeature {
  featureName = FEATURE_PRIMARY_SALE.name;
  private contractWrapper;

  constructor(contractWrapper: ContractWrapper<IPrimarySale>) {
    this.contractWrapper = contractWrapper;
  }

  /**
   * Get the primary sale recipient
   * @returns the wallet address.
   * @example
   * ```javascript
   * const salesRecipient = await contract.sales.getRecipient();
   * ```
   * @public
   * @twfeature PrimarySale
   */
  public async getRecipient(): Promise<Address> {
    const result = await this.contractWrapper.read("primarySaleRecipient", []);
    return result;
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
  setRecipient = /* @__PURE__ */ buildTransactionFunction(
    async (recipient: string): Promise<Transaction> => {
      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "setPrimarySaleRecipient",
        args: [recipient],
      });
    },
  );
}
