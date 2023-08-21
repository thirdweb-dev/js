import type { BaseRouter } from "@thirdweb-dev/contracts-js";
import { DetectableFeature } from "../interfaces/DetectableFeature";
import { ContractWrapper } from "./contract-wrapper";
import { buildTransactionFunction } from "../../common/transactions";
import { Transaction } from "./transactions";
import {
  Extension,
  ExtensionFunction,
  ExtensionMetadata,
  FunctionInput,
} from "../../types/extension";
import { FEATURE_BASE_ROUTER } from "../../constants/thirdweb-features";
import { ContractInterface } from "ethers";
import { generateExtensionFunctions } from "../../common/plugin/generatePluginFunctions";
import { AbiSchema } from "../../schema";
import { utils } from "ethers";
import invariant from "tiny-invariant";

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

  public async getAll(): Promise<Extension[]> {
    const extensions: Extension[] =
      await this.contractWrapper.readContract.getAllExtensions();

    return extensions;
  }

  public async get(extensionName: string): Promise<Extension> {
    const extension: Extension =
      await this.contractWrapper.readContract.getExtension(extensionName);

    return extension;
  }

  public async getExtensionAddress(extensionName: string): Promise<string> {
    const extensionAddress: string =
      await this.contractWrapper.readContract.getExtensionImplementation(
        extensionName,
      );

    return extensionAddress;
  }

  public async getAllFunctions(
    extensionName: string,
  ): Promise<ExtensionFunction[]> {
    const extensionFunctions: ExtensionFunction[] =
      await this.contractWrapper.readContract.getAllFunctionsOfExtension(
        extensionName,
      );

    return extensionFunctions;
  }

  public async getExtensionForFunction(
    functionInput: FunctionInput,
  ): Promise<ExtensionMetadata> {
    let selector = functionInput.functionSelector;
    if (!selector) {
      invariant(
        functionInput.functionSignature,
        "Atleast one of function selector and signature must be provided",
      );

      selector = utils.id(functionInput.functionSignature).substring(0, 10);
    }

    const extensionMetadata: ExtensionMetadata =
      await this.contractWrapper.readContract.getExtensionForFunction(selector);

    return extensionMetadata;
  }

  public async getExtensionAddressForFunction(
    functionInput: FunctionInput,
  ): Promise<string> {
    const extensionMetadata = await this.getExtensionForFunction(functionInput);

    return extensionMetadata.implementation;
  }

  /** ******************************
   * WRITE FUNCTIONS
   *******************************/

  add = /* @__PURE__ */ buildTransactionFunction(
    async (extension: Extension): Promise<Transaction> => {
      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "addExtension",
        args: [extension],
      });
    },
  );

  addWithAbi = /* @__PURE__ */ buildTransactionFunction(
    async (
      extensionName: string,
      extensionAddress: string,
      extensionAbi?: ContractInterface,
      extensionMetadataUri: string = "",
    ): Promise<Transaction> => {
      const extensionFunctions: ExtensionFunction[] =
        generateExtensionFunctions(AbiSchema.parse(extensionAbi));

      const extension: Extension = {
        metadata: {
          name: extensionName,
          metadataURI: extensionMetadataUri,
          implementation: extensionAddress,
        },
        functions: extensionFunctions,
      };

      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "addExtension",
        args: [extension],
      });
    },
  );

  update = /* @__PURE__ */ buildTransactionFunction(
    async (extension: Extension): Promise<Transaction> => {
      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "updateExtension",
        args: [extension],
      });
    },
  );

  updateWithAbi = /* @__PURE__ */ buildTransactionFunction(
    async (
      extensionName: string,
      extensionAddress: string,
      extensionAbi?: ContractInterface,
      extensionMetadataUri: string = "",
    ): Promise<Transaction> => {
      const extensionFunctions: ExtensionFunction[] =
        generateExtensionFunctions(AbiSchema.parse(extensionAbi));

      const extension: Extension = {
        metadata: {
          name: extensionName,
          metadataURI: extensionMetadataUri,
          implementation: extensionAddress,
        },
        functions: extensionFunctions,
      };

      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "updateExtension",
        args: [extension],
      });
    },
  );

  remove = /* @__PURE__ */ buildTransactionFunction(
    async (extensionName: string): Promise<Transaction> => {
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
