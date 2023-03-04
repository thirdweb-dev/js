import { TransactionResult } from "..";
import { buildTransactionFunction } from "../../common/transactions";
import { SDKOptions } from "../../schema/sdk-options";
import { NetworkInput } from "../types";
import { ContractWrapper } from "./contract-wrapper";
import { Transaction } from "./transactions";
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

  addContract = buildTransactionFunction(
    async (
      contractAddress: string,
    ): Promise<Transaction<TransactionResult>> => {
      return await this.addContracts.prepare([contractAddress]);
    },
  );

  addContracts = buildTransactionFunction(
    async (
      contractAddresses: string[],
    ): Promise<Transaction<TransactionResult>> => {
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

      return Transaction.fromContractWrapper({
        contractWrapper: this,
        method: "multicall",
        args: [encoded],
      });
    },
  );

  removeContract = buildTransactionFunction(
    async (
      contractAddress: string,
    ): Promise<Transaction<TransactionResult>> => {
      return await this.removeContracts.prepare([contractAddress]);
    },
  );

  removeContracts = buildTransactionFunction(
    async (
      contractAddresses: string[],
    ): Promise<Transaction<TransactionResult>> => {
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

      return Transaction.fromContractWrapper({
        contractWrapper: this,
        method: "multicall",
        args: [encoded],
      });
    },
  );
}
