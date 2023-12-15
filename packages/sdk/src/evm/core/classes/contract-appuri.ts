import type { IAppURI } from "@thirdweb-dev/contracts-js";
import {
  replaceGatewayUrlWithScheme,
  ThirdwebStorage,
} from "@thirdweb-dev/storage";
import { BaseContract } from "ethers";
import { detectContractFeature } from "../../common/feature-detection/detectContractFeature";
import { buildTransactionFunction } from "../../common/transactions";
import { FEATURE_APPURI } from "../../constants/thirdweb-features";
import { DetectableFeature } from "../interfaces/DetectableFeature";
import { TransactionResult } from "../types";
import { ContractMetadata } from "./contract-metadata";
import { ContractWrapper } from "./internal/contract-wrapper";
import { Transaction } from "./transactions";

/**
 * Have an official Application URI for this contract.
 * @remarks Configure an official Application URI for this contract.
 * @example
 * ```javascript
 * const contract = await sdk.getContract("{{contract_address}}");
 * const appURI = await contract.app.get();
 * appURI = "ipfs://some_ipfs_hash";
 *
 * await contract.app.set(appURI)
 * ```
 * @public
 */
export class ContractAppURI<TContract extends BaseContract>
  implements DetectableFeature
{
  featureName = FEATURE_APPURI.name;
  private contractWrapper;
  metadata: ContractMetadata<BaseContract, any>;
  storage: ThirdwebStorage;

  constructor(
    contractWrapper: ContractWrapper<TContract>,
    metadata: ContractMetadata<BaseContract, any>,
    storage: ThirdwebStorage,
  ) {
    this.contractWrapper = contractWrapper;
    this.metadata = metadata;
    this.storage = storage;
  }

  /**
   * Get App URI
   * @returns the appURI (typically an IPFS hash)
   * @example
   * ```javascript
   * const appURI = await contract.app.get();
   * console.log(appURI) // "ipfs://some_ipfs_hash";
   * ```
   * @twfeature AppURI
   */
  public async get(): Promise<string> {
    if (detectContractFeature<IAppURI>(this.contractWrapper, "AppURI")) {
      return await this.contractWrapper.read("appURI", []);
    }

    return replaceGatewayUrlWithScheme(
      (await this.metadata.get()).app_uri || "",
      this.storage.getGatewayUrls(),
    );
  }

  /**
   * Set App URI
   * @param appURI - the uri to set (typically an IPFS hash)
   * @example
   * ```javascript
   * const appURI = "ipfs://some_ipfs_hash";
   * await contract.app.set(appURI);
   * ```
   * @twfeature AppURI
   */
  set = /* @__PURE__ */ buildTransactionFunction(
    async (appURI: string): Promise<Transaction<TransactionResult>> => {
      if (detectContractFeature<IAppURI>(this.contractWrapper, "AppURI")) {
        return Transaction.fromContractWrapper({
          contractWrapper: this.contractWrapper as ContractWrapper<IAppURI>,
          method: "setAppURI",
          args: [appURI],
        });
      }

      return await this.metadata.update.prepare({ app_uri: appURI });
    },
  );
}
