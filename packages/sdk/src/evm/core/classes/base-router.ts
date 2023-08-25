import type { IBaseRouter } from "@thirdweb-dev/contracts-js";
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
import { FEATURE_DYNAMIC_CONTRACT } from "../../constants/thirdweb-features";
import { ContractInterface } from "ethers";
import { generateExtensionFunctions } from "../../common/plugin/generatePluginFunctions";
import { Abi, AbiSchema } from "../../schema";
import { utils } from "ethers";
import invariant from "tiny-invariant";
import { ExtensionAddedEvent } from "@thirdweb-dev/contracts-js/dist/declarations/src/CoreRouter";
import { fetchContractMetadataFromAddress } from "../../common";
import { joinABIs } from "../../common/plugin/joinABIs";
import { TransactionReceipt } from "@ethersproject/abstract-provider";
import { SmartContract } from "../../contracts/smart-contract";
import { ExtensionRemovedEvent } from "@thirdweb-dev/contracts-js/dist/declarations/src/CoreRouter";
import { ExtensionUpdatedEvent } from "@thirdweb-dev/contracts-js/dist/declarations/src/CoreRouter";

export class BaseRouterClass<TContract extends IBaseRouter>
  implements DetectableFeature
{
  featureName = FEATURE_DYNAMIC_CONTRACT.name;

  private contractWrapper: ContractWrapper<IBaseRouter>;
  private onAbiUpdated: any;

  constructor(
    contractWrapper: ContractWrapper<TContract>,
    contractInstance: any,
    onAbiUpdated: any,
  ) {
    this.contractWrapper = contractWrapper;
    this.onAbiUpdated = onAbiUpdated.bind(contractInstance);
  }

  getAddress(): string {
    return this.contractWrapper.readContract.address;
  }

  // /**
  //  * @internal
  //  */
  // onAbiUpdated(updatedAbi: ContractInterface): void {
  //   this.contractWrapper.updateABI(updatedAbi);
  // }

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
    async (
      extension: Extension,
    ): Promise<Transaction<Promise<TransactionReceipt>>> => {
      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "addExtension",
        args: [extension],

        parse: async (receipt) => {
          const events = this.contractWrapper.parseLogs<ExtensionAddedEvent>(
            "ExtensionAdded",
            receipt.logs,
          );

          if (events.length < 1) {
            throw new Error("No ExtensionAdded event found");
          }

          const extensionAbi = (
            await fetchContractMetadataFromAddress(
              extension.metadata.implementation,
              this.contractWrapper.getProvider(),
              this.contractWrapper.storage,
            )
          ).abi;

          const abiToAdd = this.filterAbiForAdd(extensionAbi, extension);

          const updatedAbi = joinABIs([
            AbiSchema.parse(this.contractWrapper.abi),
            abiToAdd,
          ]);

          await this.onAbiUpdated(updatedAbi);

          return receipt;
        },
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
    async (
      extension: Extension,
    ): Promise<Transaction<Promise<TransactionReceipt>>> => {
      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "updateExtension",
        args: [extension],

        parse: async (receipt) => {
          const events = this.contractWrapper.parseLogs<ExtensionUpdatedEvent>(
            "ExtensionUpdated",
            receipt.logs,
          );

          if (events.length < 1) {
            throw new Error("No ExtensionUpdated event found");
          }

          const extensionAbi = (
            await fetchContractMetadataFromAddress(
              extension.metadata.implementation,
              this.contractWrapper.getProvider(),
              this.contractWrapper.storage,
            )
          ).abi;

          const contractAbi = this.filterAbiForRemove(
            AbiSchema.parse(this.contractWrapper.abi),
            extensionAbi,
          );
          const abiToAdd = this.filterAbiForAdd(extensionAbi, extension);
          const updatedAbi = joinABIs([contractAbi, abiToAdd]);

          await this.onAbiUpdated(updatedAbi);

          return receipt;
        },
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
    async (
      extension: Extension,
    ): Promise<Transaction<Promise<TransactionReceipt>>> => {
      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "removeExtension",
        args: [extension],

        parse: async (receipt) => {
          const events = this.contractWrapper.parseLogs<ExtensionRemovedEvent>(
            "ExtensionRemoved",
            receipt.logs,
          );

          if (events.length < 1) {
            throw new Error("No ExtensionRemoved event found");
          }

          const extensionAbi = (
            await fetchContractMetadataFromAddress(
              extension.metadata.implementation,
              this.contractWrapper.getProvider(),
              this.contractWrapper.storage,
            )
          ).abi;

          const updatedAbi = this.filterAbiForRemove(
            AbiSchema.parse(this.contractWrapper.abi),
            extensionAbi,
          );

          await this.onAbiUpdated(updatedAbi);

          return receipt;
        },
      });
    },
  );

  /** ******************************
   * Internal / private
   *******************************/

  private filterAbiForAdd(extensionAbi: Abi, extension: Extension) {
    const extensionAbiInterface = new utils.Interface(extensionAbi);
    const extensionFunctionSelectors = extension.functions.map(
      (fn) => fn.functionSelector,
    );
    const filtered = extensionAbi.filter((item) => {
      const fnFragment = Object.values(new utils.Interface([item]).functions);
      if (fnFragment.length === 0) {
        return false;
      }

      const fnSigHash = extensionAbiInterface.getSighash(fnFragment[0]);

      return extensionFunctionSelectors.includes(fnSigHash);
    });

    return filtered;
  }

  private filterAbiForRemove(fullAbi: Abi, abiToRemove: Abi) {
    const fullAbiInterface = new utils.Interface(fullAbi);
    const interfaceToRemove = new utils.Interface(abiToRemove);
    const functionsToRemove = Object.values(interfaceToRemove.functions).map(
      (fn) => interfaceToRemove.getSighash(fn),
    );

    const filtered = fullAbi.filter((item) => {
      const fnFragment = Object.values(new utils.Interface([item]).functions);
      if (fnFragment.length === 0) {
        return false;
      }

      const fnSigHash = fullAbiInterface.getSighash(fnFragment[0]);

      return !functionsToRemove.includes(fnSigHash);
    });

    return filtered;
  }
}
