import { TransactionResult } from "..";
import { SDKOptions } from "../../schema/sdk-options";
import { NetworkInput } from "../types";
import { ContractWrapper } from "./contract-wrapper";
import type { TWRegistry } from "@thirdweb-dev/contracts-js";
import TWRegistryABI from "@thirdweb-dev/contracts-js/dist/abis/TWRegistry.json";
import { constants, utils } from "ethers";

/**
 * @internal
 */
export class ContractRegistry extends ContractWrapper<TWRegistry> {
  constructor(
    registryAddress: string,
    network: NetworkInput,
    options?: SDKOptions,
  ) {
    super(network, registryAddress, TWRegistryABI, options);
  }

  public async getContractAddresses(walletAddress: string) {
    // TODO @fixme the filter here is necessary because for some reason getAll returns a 0x0 address for the first entry
    return (await this.readContract.getAll(walletAddress)).filter(
      (adr) =>
        utils.isAddress(adr) && adr.toLowerCase() !== constants.AddressZero,
    );
  }

  public async addContract(
    contractAddress: string,
  ): Promise<TransactionResult> {
    return await this.addContracts([contractAddress]);
  }

  public async addContracts(
    contractAddresses: string[],
  ): Promise<TransactionResult> {
    const deployerAddress = await this.getSignerAddress();

    const encoded: string[] = [];
    contractAddresses.forEach((address) => {
      encoded.push(
        this.readContract.interface.encodeFunctionData("add", [
          deployerAddress,
          address,
        ]),
      );
    });

    return {
      receipt: await this.multiCall(encoded),
    };
  }

  public async removeContract(
    contractAddress: string,
  ): Promise<TransactionResult> {
    return await this.removeContracts([contractAddress]);
  }

  public async removeContracts(
    contractAddresses: string[],
  ): Promise<TransactionResult> {
    const deployerAddress = await this.getSignerAddress();

    const encoded: string[] = [];
    contractAddresses.forEach((address) => {
      encoded.push(
        this.readContract.interface.encodeFunctionData("remove", [
          deployerAddress,
          address,
        ]),
      );
    });

    return {
      receipt: await this.multiCall(encoded),
    };
  }
}
