import { NetworkOrSignerOrProvider, TransactionResult } from "..";
import { ChainId, getRpcUrlForChainId } from "../../constants";
import { getMultichainRegistryAddress } from "../../constants/addresses";
import { PublishedMetadata } from "../../schema/contracts/custom";
import { SDKOptions } from "../../schema/sdk-options";
import { AddContractInput, ContractInput, DeployedContract } from "../../types";
import { ContractWrapper } from "./contract-wrapper";
import type { TWMultichainRegistry } from "@thirdweb-dev/contracts-js";
import TWRegistryABI from "@thirdweb-dev/contracts-js/dist/abis/TWMultichainRegistry.json";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { constants, utils } from "ethers";
import invariant from "tiny-invariant";

/**
 * @internal
 */
export class MultichainRegistry {
  private registry: ContractWrapper<TWMultichainRegistry>;
  private storage: ThirdwebStorage;

  constructor(storage: ThirdwebStorage, options: SDKOptions = {}) {
    this.storage = storage;
    this.registry = new ContractWrapper<TWMultichainRegistry>(
      getRpcUrlForChainId(ChainId.Polygon),
      getMultichainRegistryAddress(),
      TWRegistryABI,
      options,
    );
  }

  // FIXME this needs to only assign the signer, not the provider
  public async updateSigner(signer: NetworkOrSignerOrProvider) {
    this.registry.updateSignerOrProvider(signer);
  }

  public async getContractMetadataURI(
    chainId: number,
    address: string,
  ): Promise<string> {
    return await this.registry.readContract.getMetadataUri(chainId, address);
  }

  public async getContractMetadata(
    chainId: number,
    address: string,
  ): Promise<PublishedMetadata> {
    const uri = await this.getContractMetadataURI(chainId, address);
    return await this.storage.downloadJSON<PublishedMetadata>(uri);
  }

  public async getContractAddresses(
    walletAddress: string,
  ): Promise<DeployedContract[]> {
    return (await this.registry.readContract.getAll(walletAddress))
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

  public async addContract(
    contract: AddContractInput,
  ): Promise<TransactionResult> {
    return await this.addContracts([contract]);
  }

  public async addContracts(
    contracts: AddContractInput[],
  ): Promise<TransactionResult> {
    const deployerAddress = await this.registry.getSignerAddress();
    invariant(
      (await this.registry.getSigner()?.getChainId()) === ChainId.Polygon,
      "Signer not connected to Polygon",
    );
    const encoded: string[] = [];
    contracts.forEach((contact) => {
      encoded.push(
        this.registry.readContract.interface.encodeFunctionData("add", [
          deployerAddress,
          contact.address,
          contact.chainId,
          contact.metadataURI || "",
        ]),
      );
    });

    return {
      receipt: await this.registry.multiCall(encoded),
    };
  }

  public async removeContract(
    contract: ContractInput,
  ): Promise<TransactionResult> {
    return await this.removeContracts([contract]);
  }

  public async removeContracts(
    contracts: ContractInput[],
  ): Promise<TransactionResult> {
    const deployerAddress = await this.registry.getSignerAddress();
    invariant(
      (await this.registry.getSigner()?.getChainId()) === ChainId.Polygon,
      "Signer not connected to Polygon",
    );
    const encoded: string[] = [];
    contracts.forEach((contract) => {
      encoded.push(
        this.registry.readContract.interface.encodeFunctionData("remove", [
          deployerAddress,
          contract.address,
          contract.chainId,
        ]),
      );
    });

    return {
      receipt: await this.registry.multiCall(encoded),
    };
  }
}
