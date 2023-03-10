import { resolveAddress } from "../../common/ens";
import { buildTransactionFunction } from "../../common/transactions";
import { FEATURE_OWNER } from "../../constants/thirdweb-features";
import { AddressOrEns } from "../../schema";
import { DetectableFeature } from "../interfaces/DetectableFeature";
import { ContractWrapper } from "./contract-wrapper";
import { Transaction } from "./transactions";
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
  set = buildTransactionFunction(
    async (address: AddressOrEns): Promise<Transaction> => {
      const resolvedAddress = await resolveAddress(address);

      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper as ContractWrapper<Ownable>,
        method: "setOwner",
        args: [resolvedAddress],
      });
    },
  );
}
