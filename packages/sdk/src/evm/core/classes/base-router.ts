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
import { FEATURE_DYNAMIC_CONTRACT } from "../../constants/thirdweb-features";
import { ContractInterface } from "ethers";
import { generateExtensionFunctions } from "../../common/plugin/generatePluginFunctions";
import { Abi, AbiSchema, CommonContractSchema } from "../../schema";
import { utils } from "ethers";
import invariant from "tiny-invariant";
import { ExtensionAddedEvent } from "@thirdweb-dev/contracts-js/dist/declarations/src/CoreRouter";
import {
  deployContractDeterministic,
  deployWithThrowawayDeployer,
  fetchContractMetadataFromAddress,
  fetchPublishedContractFromPolygon,
  getDeploymentInfo,
  resolveAddress,
} from "../../common";
import { joinABIs } from "../../common/plugin/joinABIs";
import { TransactionReceipt } from "@ethersproject/abstract-provider";
import { ExtensionRemovedEvent } from "@thirdweb-dev/contracts-js/dist/declarations/src/CoreRouter";
import { ExtensionReplacedEvent } from "@thirdweb-dev/contracts-js/dist/declarations/src/BaseRouter";
import { DynamicContractExtensionMetadata } from "../../types";

export class BaseRouterClass<TContract extends BaseRouter>
  implements DetectableFeature
{
  featureName = FEATURE_DYNAMIC_CONTRACT.name;

  private contractWrapper: ContractWrapper<BaseRouter>;
  private onAbiUpdated: any;

  constructor(contractWrapper: ContractWrapper<TContract>) {
    this.contractWrapper = contractWrapper;
    // this.onAbiUpdated = onAbiUpdated.bind(contractInstance);
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
    const extension = await this.get(extensionName);

    return extension.metadata.implementation;
  }

  public async getAllFunctions(
    extensionName: string,
  ): Promise<ExtensionFunction[]> {
    const extension = await this.get(extensionName);

    return extension.functions;
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
      await this.contractWrapper.readContract.getMetadataForFunction(selector);

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
    async (inputArgs: {
      extension: Extension;
    }): Promise<Transaction<Promise<TransactionReceipt>>> => {
      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "addExtension",
        args: [inputArgs.extension],

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
              inputArgs.extension.metadata.implementation,
              this.contractWrapper.getProvider(),
              this.contractWrapper.storage,
            )
          ).abi;

          const abiToAdd = this.filterAbiForAdd(
            extensionAbi,
            inputArgs.extension,
          );

          const updatedAbi = joinABIs([
            AbiSchema.parse(this.contractWrapper.abi),
            abiToAdd,
          ]);

          this.contractWrapper.updateAbi(updatedAbi);

          return receipt;
        },
      });
    },
  );

  addPublished = /* @__PURE__ */ buildTransactionFunction(
    async (inputArgs: {
      extensionName: string;
      publisherAddress: string;
      version?: string;
      extensionMetadata: DynamicContractExtensionMetadata;
    }): Promise<Transaction<Promise<TransactionReceipt>>> => {
      const version = inputArgs.version || "latest";
      const parsedMetadata = await CommonContractSchema.parseAsync(
        inputArgs.extensionMetadata,
      );
      const extensionMetadataUri = await this.contractWrapper.storage.upload(
        parsedMetadata,
      );

      const deployedExtensionAddress = await this.deployExtension(
        inputArgs.extensionName,
        inputArgs.publisherAddress,
        version,
      );

      const metadata = await fetchContractMetadataFromAddress(
        deployedExtensionAddress,
        this.contractWrapper.getProvider(),
        this.contractWrapper.storage,
        this.contractWrapper.options,
      );

      const extensionAbi = metadata.abi;
      invariant(extensionAbi, "Require extension ABI");

      const extensionFunctions: ExtensionFunction[] =
        generateExtensionFunctions(AbiSchema.parse(extensionAbi));

      const extension: Extension = {
        metadata: {
          name: inputArgs.extensionName,
          metadataURI: extensionMetadataUri,
          implementation: deployedExtensionAddress,
        },
        functions: extensionFunctions,
      };

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

          const abiToAdd = this.filterAbiForAdd(
            AbiSchema.parse(extensionAbi),
            extension,
          );

          const updatedAbi = joinABIs([
            AbiSchema.parse(this.contractWrapper.abi),
            abiToAdd,
          ]);

          this.contractWrapper.updateAbi(updatedAbi);

          return receipt;
        },
      });
    },
  );

  addWithAbi = /* @__PURE__ */ buildTransactionFunction(
    async (inputArgs: {
      extensionName: string;
      extensionAddress: string;
      extensionMetadata: DynamicContractExtensionMetadata;
      extensionAbi?: ContractInterface;
    }): Promise<Transaction<Promise<TransactionReceipt>>> => {
      const parsedMetadata = await CommonContractSchema.parseAsync(
        inputArgs.extensionMetadata,
      );
      const extensionMetadataUri = await this.contractWrapper.storage.upload(
        parsedMetadata,
      );

      let extensionAbi = inputArgs.extensionAbi;
      if (!extensionAbi) {
        const metadata = await fetchContractMetadataFromAddress(
          inputArgs.extensionAddress,
          this.contractWrapper.getProvider(),
          this.contractWrapper.storage,
          this.contractWrapper.options,
        );

        extensionAbi = metadata.abi;
      }

      invariant(extensionAbi, "Require extension ABI");

      const extensionFunctions: ExtensionFunction[] =
        generateExtensionFunctions(AbiSchema.parse(extensionAbi));

      const extension: Extension = {
        metadata: {
          name: inputArgs.extensionName,
          metadataURI: extensionMetadataUri,
          implementation: inputArgs.extensionAddress,
        },
        functions: extensionFunctions,
      };

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

          const abiToAdd = this.filterAbiForAdd(
            AbiSchema.parse(extensionAbi),
            extension,
          );

          const updatedAbi = joinABIs([
            AbiSchema.parse(this.contractWrapper.abi),
            abiToAdd,
          ]);

          this.contractWrapper.updateAbi(updatedAbi);

          return receipt;
        },
      });
    },
  );

  replace = /* @__PURE__ */ buildTransactionFunction(
    async (inputArgs: {
      extension: Extension;
    }): Promise<Transaction<Promise<TransactionReceipt>>> => {
      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "replaceExtension",
        args: [inputArgs.extension],

        parse: async (receipt) => {
          const events = this.contractWrapper.parseLogs<ExtensionReplacedEvent>(
            "ExtensionReplaced",
            receipt.logs,
          );

          if (events.length < 1) {
            throw new Error("No ExtensionReplaced event found");
          }

          const extensionAbi = (
            await fetchContractMetadataFromAddress(
              inputArgs.extension.metadata.implementation,
              this.contractWrapper.getProvider(),
              this.contractWrapper.storage,
            )
          ).abi;

          const contractAbi = this.filterAbiForRemove(
            AbiSchema.parse(this.contractWrapper.abi),
            extensionAbi,
          );
          const abiToAdd = this.filterAbiForAdd(
            extensionAbi,
            inputArgs.extension,
          );
          const updatedAbi = joinABIs([contractAbi, abiToAdd]);

          this.contractWrapper.updateAbi(updatedAbi);

          return receipt;
        },
      });
    },
  );

  replacePublished = /* @__PURE__ */ buildTransactionFunction(
    async (inputArgs: {
      extensionName: string;
      publisherAddress: string;
      version?: string;
      extensionMetadata: DynamicContractExtensionMetadata;
    }): Promise<Transaction<Promise<TransactionReceipt>>> => {
      const version = inputArgs.version || "latest";
      const parsedMetadata = await CommonContractSchema.parseAsync(
        inputArgs.extensionMetadata,
      );
      const extensionMetadataUri = await this.contractWrapper.storage.upload(
        parsedMetadata,
      );

      const deployedExtensionAddress = await this.deployExtension(
        inputArgs.extensionName,
        inputArgs.publisherAddress,
        version,
      );

      const metadata = await fetchContractMetadataFromAddress(
        deployedExtensionAddress,
        this.contractWrapper.getProvider(),
        this.contractWrapper.storage,
        this.contractWrapper.options,
      );

      const extensionAbi = metadata.abi;
      invariant(extensionAbi, "Require extension ABI");

      const extensionFunctions: ExtensionFunction[] =
        generateExtensionFunctions(AbiSchema.parse(extensionAbi));

      const extension: Extension = {
        metadata: {
          name: inputArgs.extensionName,
          metadataURI: extensionMetadataUri,
          implementation: deployedExtensionAddress,
        },
        functions: extensionFunctions,
      };

      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "replaceExtension",
        args: [extension],

        parse: async (receipt) => {
          const events = this.contractWrapper.parseLogs<ExtensionAddedEvent>(
            "ExtensionReplaced",
            receipt.logs,
          );

          if (events.length < 1) {
            throw new Error("No ExtensionReplaced event found");
          }

          const contractAbi = this.filterAbiForRemove(
            AbiSchema.parse(this.contractWrapper.abi),
            extensionAbi,
          );
          const abiToAdd = this.filterAbiForAdd(extensionAbi, extension);
          const updatedAbi = joinABIs([contractAbi, abiToAdd]);

          this.contractWrapper.updateAbi(updatedAbi);

          return receipt;
        },
      });
    },
  );

  replaceWithAbi = /* @__PURE__ */ buildTransactionFunction(
    async (inputArgs: {
      extensionName: string;
      extensionAddress: string;
      extensionMetadata: DynamicContractExtensionMetadata;
      extensionAbi?: ContractInterface;
    }): Promise<Transaction<Promise<TransactionReceipt>>> => {
      const parsedMetadata = await CommonContractSchema.parseAsync(
        inputArgs.extensionMetadata,
      );
      const extensionMetadataUri = await this.contractWrapper.storage.upload(
        parsedMetadata,
      );

      let extensionAbi = inputArgs.extensionAbi;
      if (!extensionAbi) {
        const metadata = await fetchContractMetadataFromAddress(
          inputArgs.extensionAddress,
          this.contractWrapper.getProvider(),
          this.contractWrapper.storage,
          this.contractWrapper.options,
        );

        extensionAbi = metadata.abi;
      }

      invariant(extensionAbi, "Require extension ABI");

      const extensionFunctions: ExtensionFunction[] =
        generateExtensionFunctions(AbiSchema.parse(extensionAbi));

      const extension: Extension = {
        metadata: {
          name: inputArgs.extensionName,
          metadataURI: extensionMetadataUri,
          implementation: inputArgs.extensionAddress,
        },
        functions: extensionFunctions,
      };

      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "replaceExtension",
        args: [extension],

        parse: async (receipt) => {
          const events = this.contractWrapper.parseLogs<ExtensionReplacedEvent>(
            "ExtensionReplaced",
            receipt.logs,
          );

          if (events.length < 1) {
            throw new Error("No ExtensionReplaced event found");
          }

          const parsedAbi = AbiSchema.parse(extensionAbi);
          const contractAbi = this.filterAbiForRemove(
            AbiSchema.parse(this.contractWrapper.abi),
            parsedAbi,
          );
          const abiToAdd = this.filterAbiForAdd(parsedAbi, extension);
          const updatedAbi = joinABIs([contractAbi, abiToAdd]);

          this.contractWrapper.updateAbi(updatedAbi);

          return receipt;
        },
      });
    },
  );

  remove = /* @__PURE__ */ buildTransactionFunction(
    async (inputArgs: {
      extensionName: string;
    }): Promise<Transaction<Promise<TransactionReceipt>>> => {
      const extensionAddress = await this.getExtensionAddress(
        inputArgs.extensionName,
      );
      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "removeExtension",
        args: [inputArgs.extensionName],

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
              extensionAddress,
              this.contractWrapper.getProvider(),
              this.contractWrapper.storage,
            )
          ).abi;

          const updatedAbi = this.filterAbiForRemove(
            AbiSchema.parse(this.contractWrapper.abi),
            extensionAbi,
          );

          this.contractWrapper.updateAbi(updatedAbi);

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

  private async deployExtension(
    extensionName: string,
    publisherAddress: string,
    version: string = "latest",
  ): Promise<string> {
    const published = await fetchPublishedContractFromPolygon(
      publisherAddress,
      extensionName,
      version,
      this.contractWrapper.storage,
      this.contractWrapper.options.clientId,
      this.contractWrapper.options.secretKey,
    );

    const deploymentInfo = await getDeploymentInfo(
      published.metadataUri,
      this.contractWrapper.storage,
      this.contractWrapper.getProvider(),
      "",
      this.contractWrapper.options.clientId,
      this.contractWrapper.options.secretKey,
    );

    const implementationAddress = deploymentInfo.find(
      (i) => i.type === "implementation",
    )?.transaction.predictedAddress as string;

    // deploy infra + plugins + implementation using a throwaway Deployer contract

    // filter out already deployed contracts (data is empty)
    const transactionsToSend = deploymentInfo.filter(
      (i) => i.transaction.data && i.transaction.data.length > 0,
    );
    const transactionsforDirectDeploy = transactionsToSend
      .filter((i) => {
        return i.type !== "infra";
      })
      .map((i) => i.transaction);
    const transactionsForThrowawayDeployer = transactionsToSend
      .filter((i) => {
        return i.type === "infra";
      })
      .map((i) => i.transaction);

    const signer = this.contractWrapper.getSigner();
    invariant(signer, "Signer is required");

    // deploy via throwaway deployer, multiple infra contracts in one transaction
    await deployWithThrowawayDeployer(
      signer,
      transactionsForThrowawayDeployer,
      {},
    );

    // send each transaction directly to Create2 factory
    // process txns one at a time
    for (const tx of transactionsforDirectDeploy) {
      try {
        await deployContractDeterministic(signer, tx, {});
      } catch (e) {
        console.debug(
          `Error deploying contract at ${tx.predictedAddress}`,
          (e as any)?.message,
        );
      }
    }

    const resolvedImplementationAddress = await resolveAddress(
      implementationAddress,
    );

    return resolvedImplementationAddress;
  }
}
