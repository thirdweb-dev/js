import { detectContractFeature } from "../../common";
import { FEATURE_APPURI } from "../../constants/thirdweb-features";
import { DetectableFeature } from "../interfaces/DetectableFeature";
import { TransactionResult } from "../types";
import { ContractMetadata } from "./contract-metadata";
import { ContractWrapper } from "./contract-wrapper";
import type { AppURI } from "@thirdweb-dev/contracts-js";
import { BaseContract } from "ethers";

/**
 * Have an official Application URI for this contract.
 * @remarks Configure an official Application URI for this contract.
 * @example
 * ```javascript
 * const contract = await sdk.getContract("{{contract_address}}");
 * const appURI = await contract.appuri.get();
 * appURI = "ipfs://some_ipfs_hash";
 *
 * await contract.appuri.set(appURI)
 * ```
 * @public
 */
export class ContractAppURI<TContract extends BaseContract>
  implements DetectableFeature
{
  featureName = FEATURE_APPURI.name;
  private contractWrapper;
  metadata: ContractMetadata<BaseContract, any>;

  constructor(
    contractWrapper: ContractWrapper<TContract>,
    metadata: ContractMetadata<BaseContract, any>,
  ) {
    this.contractWrapper = contractWrapper;
    this.metadata = metadata;
  }

  /**
   * Get the appURI for the contract
   * @returns the appURI object
   */
  public async get() {
    if (detectContractFeature<AppURI>(this.contractWrapper, "AppURI")) {
      return await this.contractWrapper.readContract.appURI();
    }

    return (await this.metadata.get()).appURI || "";
  }

  /**
   * Set the appURI for the contract
   * @param appURI - the uri to set (typically an IPFS hash)
   */
  public async set(appURI: string): Promise<TransactionResult> {
    if (detectContractFeature<AppURI>(this.contractWrapper, "AppURI")) {
      return {
        receipt: await this.contractWrapper.sendTransaction("setAppURI", [
          appURI,
        ]),
      };
    }

    return await this.metadata.update({ appURI });
  }
}
