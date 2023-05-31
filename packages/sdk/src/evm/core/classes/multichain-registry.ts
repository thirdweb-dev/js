import { resolveAddress } from "../../common/ens";
import { buildTransactionFunction } from "../../common/transactions";
import { getMultichainRegistryAddress } from "../../constants/addresses";
import { AddressOrEns } from "../../schema/shared/AddressOrEnsSchema";
import { PublishedMetadata } from "../../schema/contracts/custom";
import { SDKOptions } from "../../schema/sdk-options";
import { AddContractInput, ContractInput, DeployedContract } from "../../types";
import { ContractWrapper } from "./contract-wrapper";
import type {
  TWMultichainRegistryRouter,
  TWMultichainRegistryLogic,
} from "@thirdweb-dev/contracts-js";
import TWRegistryABI from "@thirdweb-dev/contracts-js/dist/abis/TWMultichainRegistryLogic.json";
import TWRegistryRouterABI from "@thirdweb-dev/contracts-js/dist/abis/TWMultichainRegistryRouter.json";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { constants, utils } from "ethers";
import { Transaction } from "./transactions";
import type { NetworkInput, TransactionResult } from "../types";

/**
 * @internal
 */
export class MultichainRegistry {
  private registryLogic: ContractWrapper<TWMultichainRegistryLogic>;
  private registryRouter: ContractWrapper<TWMultichainRegistryRouter>;
  private storage: ThirdwebStorage;

  constructor(
    network: NetworkInput,
    storage: ThirdwebStorage,
    options: SDKOptions = {},
  ) {
    this.storage = storage;
    this.registryLogic = new ContractWrapper<TWMultichainRegistryLogic>(
      network,
      getMultichainRegistryAddress(),
      TWRegistryABI,
      options,
    );

    this.registryRouter = new ContractWrapper<TWMultichainRegistryRouter>(
      network,
      getMultichainRegistryAddress(),
      TWRegistryRouterABI,
      options,
    );
  }

  public async updateSigner(signer: NetworkInput) {
    this.registryLogic.updateSignerOrProvider(signer);
    this.registryRouter.updateSignerOrProvider(signer);
  }

  public async getContractMetadataURI(
    chainId: number,
    address: AddressOrEns,
  ): Promise<string> {
    return await this.registryLogic.readContract.getMetadataUri(
      chainId,
      await resolveAddress(address),
    );
  }

  public async getContractMetadata(
    chainId: number,
    address: AddressOrEns,
  ): Promise<PublishedMetadata> {
    const uri = await this.getContractMetadataURI(chainId, address);
    if (!uri) {
      throw new Error(
        `No metadata URI found for contract ${address} on chain ${chainId}`,
      );
    }
    // TODO define the metadata JSON schema
    return await this.storage.downloadJSON<PublishedMetadata>(uri);
  }

  public async getContractAddresses(
    walletAddress: AddressOrEns,
  ): Promise<DeployedContract[]> {
    return (
      await this.registryLogic.readContract.getAll(
        await resolveAddress(walletAddress),
      )
    )
      .filter(
        (result) =>
          utils.isAddress(result.deploymentAddress) &&
          result.deploymentAddress.toLowerCase() !== constants.AddressZero,
      )
      .map((result) => ({
        address: result.deploymentAddress,
        chainId: result.chainId.toNumber(),
      }));
  }

  addContract = buildTransactionFunction(
    async (
      contract: AddContractInput,
    ): Promise<Transaction<TransactionResult>> => {
      return await this.addContracts.prepare([contract]);
    },
  );

  addContracts = buildTransactionFunction(
    async (
      contracts: AddContractInput[],
    ): Promise<Transaction<TransactionResult>> => {
      const deployerAddress = await this.registryRouter.getSignerAddress();
      const encoded: string[] = [];
      contracts.forEach((contact) => {
        encoded.push(
          this.registryLogic.readContract.interface.encodeFunctionData("add", [
            deployerAddress,
            contact.address,
            contact.chainId,
            contact.metadataURI || "",
          ]),
        );
      });

      return Transaction.fromContractWrapper({
        contractWrapper: this.registryRouter,
        method: "multicall",
        args: [encoded],
      });
    },
  );

  removeContract = buildTransactionFunction(
    async (
      contract: ContractInput,
    ): Promise<Transaction<TransactionResult>> => {
      return await this.removeContracts.prepare([contract]);
    },
  );

  removeContracts = buildTransactionFunction(
    async (
      contracts: ContractInput[],
    ): Promise<Transaction<TransactionResult>> => {
      const deployerAddress = await this.registryRouter.getSignerAddress();
      const encoded: string[] = await Promise.all(
        contracts.map(async (contract) =>
          this.registryLogic.readContract.interface.encodeFunctionData(
            "remove",
            [
              deployerAddress,
              await resolveAddress(contract.address),
              contract.chainId,
            ],
          ),
        ),
      );

      return Transaction.fromContractWrapper({
        contractWrapper: this.registryRouter,
        method: "multicall",
        args: [encoded],
      });
    },
  );
}
