import { FEATURE_APPURI } from "../../constants/thirdweb-features";
import { DetectableFeature } from "../interfaces/DetectableFeature";
import { TransactionResult } from "../types";
import { ContractWrapper } from "./contract-wrapper";
import type { AppURI } from "@thirdweb-dev/contracts-js";

/**
 * Have an official Application URI for this contract.
 * @remarks Configure an official Application URI for this contract.
 * @example
 * ```javascript
 * const contract = await sdk.getContract("{{contract_address}}");
 * const appURI = await contract.appURI.get();
 * appURI = "ipfs://some_ipfs_hash";
 *
 * await contract.appURI.set(appURI)
 * ```
 * @public
 */
export class ContractAppURI<TContract extends AppURI>
  implements DetectableFeature
{
  featureName = FEATURE_APPURI.name;
  private contractWrapper;

  constructor(contractWrapper: ContractWrapper<TContract>) {
    this.contractWrapper = contractWrapper;
  }

  /**
   * Get the appURI for the contract
   * @returns the appURI object
   */
  public async get() {
    return await this.contractWrapper.readContract.appURI();
  }

  /**
   * Set the appURI for the contract
   * @param appURI - the uri to set (typically an IPFS hash)
   */
  public async set(appURI: string): Promise<TransactionResult> {
    return {
      receipt: await this.contractWrapper.sendTransaction("setAppURI", [
        appURI,
      ]),
    };
  }
}
