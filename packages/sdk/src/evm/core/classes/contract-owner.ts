import { FEATURE_OWNER } from "../../constants/thirdweb-features";
import { DetectableFeature } from "../interfaces/DetectableFeature";
import { TransactionResult } from "../types";
import { ContractWrapper } from "./contract-wrapper";
import type { Ownable } from "@thirdweb-dev/contracts-js";

/**
 * Encodes and decodes Contract functions
 * @public
 */
export class ContractOwner<TContract extends Ownable>
  implements DetectableFeature
{
  featureName = FEATURE_OWNER.name;
  private contractWrapper;

  constructor(contractWrapper: ContractWrapper<TContract>) {
    this.contractWrapper = contractWrapper;
  }

  /**
   * Get the current owner of the contract
   * @example
   * ```javascript
   * await contract.owner.get();
   * console.log("Owner address: ", ownerAddress);
   * ```
   * @returns the owner address
   * @twfeature Ownable
   */
  public async get(): Promise<string> {
    return this.contractWrapper.readContract.owner();
  }

  /**
   * Set the new owner of the contract
   * @remarks Can only be called by the current owner.
   *
   * @param address - the address of the new owner
   *
   * @example
   * ```javascript
   * const newOwnerAddress = "{{wallet_address}}";
   * await contract.owner.set(newOwnerAddress);
   * ```
   * @twfeature Ownable
   */
  public async set(address: string): Promise<TransactionResult> {
    return {
      receipt: await this.contractWrapper.sendTransaction("setOwner", [
        address,
      ]),
    };
  }
}
