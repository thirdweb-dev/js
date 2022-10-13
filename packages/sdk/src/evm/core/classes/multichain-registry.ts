import { TransactionResult } from "..";
import { SDKOptions } from "../../schema/sdk-options";
import { NetworkOrSignerOrProvider } from "../types";
import { ContractWrapper } from "./contract-wrapper";
import type { TWRegistry } from "@thirdweb-dev/contracts-js";
import TWRegistryABI from "@thirdweb-dev/contracts-js/dist/abis/TWRegistry.json";
import { constants, utils } from "ethers";

type ContractInput = {
  address: string;
  chainId: number;
};

type AddContractInput = ContractInput & {
  metadataURI?: string;
};

type DeployedContract = {
  address: string;
  chainId: number;
};
/**
 * @internal
 */
export class MultichainRegistry {
  private registry: ContractWrapper<TWRegistry>;

  constructor(
    registryAddress: string,
    network: NetworkOrSignerOrProvider,
    options?: SDKOptions,
  ) {
    this.registry = new ContractWrapper<TWRegistry>(
      network,
      registryAddress,
      TWRegistryABI,
      options,
    );
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
