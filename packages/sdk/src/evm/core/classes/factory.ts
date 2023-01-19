import { getDeployArguments } from "../../common/deploy";
import { getApprovedImplementation } from "../../constants";
import {
  EditionDropInitializer,
  EditionInitializer,
  getContractName,
  MarketplaceInitializer,
  MultiwrapInitializer,
  NFTCollectionInitializer,
  NFTDropInitializer,
  PackInitializer,
  PREBUILT_CONTRACTS_MAP,
  SignatureDropInitializer,
  SplitInitializer,
  TokenDropInitializer,
  TokenInitializer,
  VoteInitializer,
} from "../../contracts";
import { SDKOptions } from "../../schema/sdk-options";
import { DeployEvents } from "../../types";
import {
  DeploySchemaForPrebuiltContractType,
  NetworkInput,
  PrebuiltContractType,
} from "../types";
import { ContractWrapper } from "./contract-wrapper";
import type { TWFactory } from "@thirdweb-dev/contracts-js";
import TWFactoryAbi from "@thirdweb-dev/contracts-js/dist/abis/TWFactory.json";
import { ProxyDeployedEvent } from "@thirdweb-dev/contracts-js/dist/declarations/src/TWFactory";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { constants, Contract, ContractInterface, ethers } from "ethers";
import { EventEmitter } from "eventemitter3";
import invariant from "tiny-invariant";
import { z } from "zod";

/**
 * @internal
 */
export class ContractFactory extends ContractWrapper<TWFactory> {
  private storage: ThirdwebStorage;

  // Map from contract type to version to deploy specific versions by default
  private DEFAULT_VERSION_MAP: Record<PrebuiltContractType, number> = {
    [NFTDropInitializer.contractType]: 3,
    [NFTCollectionInitializer.contractType]: 1,
    [SignatureDropInitializer.contractType]: 4,
    [MultiwrapInitializer.contractType]: 1,
    [EditionDropInitializer.contractType]: 2,
    [EditionInitializer.contractType]: 1,
    [TokenDropInitializer.contractType]: 2,
    [TokenInitializer.contractType]: 1,
    [VoteInitializer.contractType]: 1,
    [SplitInitializer.contractType]: 1,
    [MarketplaceInitializer.contractType]: 2,
    [PackInitializer.contractType]: 2,
  };

  constructor(
    factoryAddr: string,
    network: NetworkInput,
    storage: ThirdwebStorage,
    options?: SDKOptions,
  ) {
    super(network, factoryAddr, TWFactoryAbi, options);
    this.storage = storage;
  }

  public async deploy<TContractType extends PrebuiltContractType>(
    contractType: TContractType,
    contractMetadata: z.input<
      DeploySchemaForPrebuiltContractType<TContractType>
    >,
    eventEmitter: EventEmitter<DeployEvents>,
    version?: number,
  ): Promise<string> {
    const contract = PREBUILT_CONTRACTS_MAP[contractType];
    const metadata = contract.schema.deploy.parse(contractMetadata);

    // TODO: is there any special pre-processing we need to do before uploading?
    const contractURI = await this.storage.upload(metadata);

    const implementationAddress = await this.getImplementation(
      contract,
      version,
    );

    if (
      !implementationAddress ||
      implementationAddress === constants.AddressZero
    ) {
      throw new Error(`No implementation found for ${contractType}`);
    }

    const ABI = await contract.getAbi(
      implementationAddress,
      this.getProvider(),
      this.storage,
    );

    const signer = this.getSigner();
    invariant(signer, "A signer is required to deploy contracts");

    const encodedFunc = Contract.getInterface(ABI).encodeFunctionData(
      "initialize",
      await getDeployArguments(contractType, metadata, contractURI, signer),
    );

    const blockNumber = await this.getProvider().getBlockNumber();
    const salt = ethers.utils.formatBytes32String(blockNumber.toString());
    const receipt = await this.sendTransaction("deployProxyByImplementation", [
      implementationAddress,
      encodedFunc,
      salt,
    ]);

    const events = this.parseLogs<ProxyDeployedEvent>(
      "ProxyDeployed",
      receipt.logs,
    );
    if (events.length < 1) {
      throw new Error("No ProxyDeployed event found");
    }

    const contractAddress = events[0].args.proxy;
    eventEmitter.emit("contractDeployed", {
      status: "completed",
      contractAddress,
      transactionHash: receipt.transactionHash,
    });

    return contractAddress;
  }

  // TODO once IContractFactory is implemented, this can be probably be moved to its own class
  public async deployProxyByImplementation(
    implementationAddress: string,
    implementationAbi: ContractInterface,
    initializerFunction: string,
    initializerArgs: any[],
    eventEmitter: EventEmitter<DeployEvents>,
  ): Promise<string> {
    const encodedFunc = Contract.getInterface(
      implementationAbi,
    ).encodeFunctionData(initializerFunction, initializerArgs);

    const blockNumber = await this.getProvider().getBlockNumber();
    const receipt = await this.sendTransaction("deployProxyByImplementation", [
      implementationAddress,
      encodedFunc,
      ethers.utils.formatBytes32String(blockNumber.toString()),
    ]);

    const events = this.parseLogs<ProxyDeployedEvent>(
      "ProxyDeployed",
      receipt.logs,
    );
    if (events.length < 1) {
      throw new Error("No ProxyDeployed event found");
    }

    const contractAddress = events[0].args.proxy;
    eventEmitter.emit("contractDeployed", {
      status: "completed",
      contractAddress,
      transactionHash: receipt.transactionHash,
    });

    return contractAddress;
  }

  private async getImplementation(
    contract: typeof PREBUILT_CONTRACTS_MAP[PrebuiltContractType],
    version?: number,
  ) {
    const encodedType = ethers.utils.formatBytes32String(contract.name);
    const chainId = await this.getChainID();
    const approvedImplementation = getApprovedImplementation(
      chainId,
      contract.contractType,
    );
    // return approved implementation if it exists and we're not overriding the version
    if (
      approvedImplementation &&
      approvedImplementation.length > 0 &&
      version === undefined
    ) {
      return approvedImplementation;
    }
    return this.readContract.getImplementation(
      encodedType,
      version !== undefined
        ? version
        : this.DEFAULT_VERSION_MAP[contract.contractType],
    );
  }

  public async getLatestVersion(contractType: PrebuiltContractType) {
    const name = getContractName(contractType);
    if (!name) {
      throw new Error(`Invalid contract type ${contractType}`);
    }
    const encodedType = ethers.utils.formatBytes32String(name);
    return this.readContract.currentVersion(encodedType);
  }
}
