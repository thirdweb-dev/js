import type {
  TWMultichainRegistryLogic,
  TWMultichainRegistryRouter,
} from "@thirdweb-dev/contracts-js";
import TWRegistryABI from "@thirdweb-dev/contracts-js/dist/abis/TWMultichainRegistryLogic.json";
import TWRegistryRouterABI from "@thirdweb-dev/contracts-js/dist/abis/TWMultichainRegistryRouter.json";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { constants, utils } from "ethers";
import { resolveAddress } from "../../common/ens/resolveAddress";
import { buildTransactionFunction } from "../../common/transactions";
import { getMultichainRegistryAddress } from "../../constants/addresses/getMultichainRegistryAddress";
import { PublishedMetadata } from "../../schema/contracts/custom";
import { SDKOptions } from "../../schema/sdk-options";
import { AddressOrEns } from "../../schema/shared/AddressOrEnsSchema";
import type {
  AddContractInput,
  ContractInput,
  DeployedContract,
} from "../../types/registry";
import type { NetworkInput, TransactionResult } from "../types";
import { ContractEncoder } from "./contract-encoder";
import { ContractWrapper } from "./internal/contract-wrapper";
import { Transaction } from "./transactions";

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
      storage,
    );

    this.registryRouter = new ContractWrapper<TWMultichainRegistryRouter>(
      network,
      getMultichainRegistryAddress(),
      TWRegistryRouterABI,
      options,
      storage,
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
    return await this.registryLogic.read("getMetadataUri", [
      chainId,
      await resolveAddress(address),
    ]);
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
      await this.registryLogic.read("getAll", [
        await resolveAddress(walletAddress),
      ])
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

  addContract = /* @__PURE__ */ buildTransactionFunction(
    async (
      contract: AddContractInput,
    ): Promise<Transaction<TransactionResult>> => {
      const deployerAddress = await this.registryRouter.getSignerAddress();

      return Transaction.fromContractWrapper({
        contractWrapper: this.registryLogic,
        method: "add",
        args: [
          deployerAddress,
          contract.address,
          contract.chainId,
          contract.metadataURI || "",
        ],
      });
    },
  );

  addContracts = /* @__PURE__ */ buildTransactionFunction(
    async (
      contracts: AddContractInput[],
    ): Promise<Transaction<TransactionResult>> => {
      const deployerAddress = await this.registryRouter.getSignerAddress();
      const encoded: string[] = [];
      const contractEncoder = new ContractEncoder(this.registryLogic);
      contracts.forEach((contact) => {
        encoded.push(
          contractEncoder.encode("add", [
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

  removeContract = /* @__PURE__ */ buildTransactionFunction(
    async (
      contract: ContractInput,
    ): Promise<Transaction<TransactionResult>> => {
      const deployerAddress = await this.registryRouter.getSignerAddress();

      return Transaction.fromContractWrapper({
        contractWrapper: this.registryLogic,
        method: "remove",
        args: [
          deployerAddress,
          await resolveAddress(contract.address),
          contract.chainId,
        ],
      });
    },
  );

  removeContracts = /* @__PURE__ */ buildTransactionFunction(
    async (
      contracts: ContractInput[],
    ): Promise<Transaction<TransactionResult>> => {
      const deployerAddress = await this.registryRouter.getSignerAddress();
      const contractEncoder = new ContractEncoder(this.registryLogic);

      const encoded: string[] = await Promise.all(
        contracts.map(async (contract) =>
          contractEncoder.encode("remove", [
            deployerAddress,
            await resolveAddress(contract.address),
            contract.chainId,
          ]),
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
