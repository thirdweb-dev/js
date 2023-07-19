import type { BaseRouter } from "@thirdweb-dev/contracts-js";
import { DetectableFeature } from "../interfaces/DetectableFeature";
import { ContractWrapper } from "./contract-wrapper";
import { buildTransactionFunction } from "../../common/transactions";
import { Transaction } from "./transactions";
import { Extension, ExtensionMetadata } from "../../types/extension";
import { FEATURE_BASE_ROUTER } from "../../constants/thirdweb-features";

export class BaseRouterClass<TContract extends BaseRouter>
  implements DetectableFeature
{
  featureName = FEATURE_BASE_ROUTER.name;

  private contractWrapper: ContractWrapper<BaseRouter>;

  constructor(contractWrapper: ContractWrapper<TContract>) {
    this.contractWrapper = contractWrapper;
  }

  getAddress(): string {
    return this.contractWrapper.readContract.address;
  }

  /** ******************************
   * READ FUNCTIONS
   *******************************/

  //   getAllExtensions;
  public async getAllExtensions(): Promise<ExtensionMetadata[]> {
    const extensions: Extension[] =
      await this.contractWrapper.readContract.getAllExtensions();

    return extensions.map((extension) => extension.metadata);
  }

  //   getDefaultExtensionSetAddress;

  //   getExtension;

  //   getExtensionImplementation;

  //   getAllFunctionsOfImplementation;

  //   getAllFunctionsOfExtension;

  //   getExtensionForFunction;

  //   getImplementationForFunction;

  /** ******************************
   * WRITE FUNCTIONS
   *******************************/

  addExtension = /* @__PURE__ */ buildTransactionFunction(
    async (extension: Extension): Promise<Transaction> => {
      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "addExtension",
        args: [extension],
      });
    },
  );

  updateExtension = /* @__PURE__ */ buildTransactionFunction(
    async (extension: Extension): Promise<Transaction> => {
      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "updateExtension",
        args: [extension],
      });
    },
  );

  removeExtension = /* @__PURE__ */ buildTransactionFunction(
    async (extensionName: String): Promise<Transaction> => {
      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "removeExtension",
        args: [extensionName],
      });
    },
  );

  /** ******************************
   * Internal / private
   *******************************/
}
