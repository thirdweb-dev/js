import type { TWRegistry } from "@thirdweb-dev/contracts-js";
import TWRegistryABI from "@thirdweb-dev/contracts-js/dist/abis/TWRegistry.json";
import type { ThirdwebStorage } from "@thirdweb-dev/storage";
import { constants, utils } from "ethers";
import { resolveAddress } from "../../common/ens/resolveAddress";
import { buildTransactionFunction } from "../../common/transactions";
import { SDKOptions } from "../../schema/sdk-options";
import { AddressOrEns } from "../../schema/shared/AddressOrEnsSchema";
import type { NetworkInput, TransactionResult } from "../types";
import { ContractEncoder } from "./contract-encoder";
import { ContractWrapper } from "./contract-wrapper";
import { Transaction } from "./transactions";

/**
 * @internal
 */
export class ContractRegistry extends ContractWrapper<TWRegistry> {
  constructor(
    registryAddress: string,
    network: NetworkInput,
    storage: ThirdwebStorage,
    options?: SDKOptions,
  ) {
    super(network, registryAddress, TWRegistryABI, options, storage);
  }

  public async getContractAddresses(walletAddress: AddressOrEns) {
    // TODO @fixme the filter here is necessary because for some reason getAll returns a 0x0 address for the first entry
    return (
      await this.read("getAll", [await resolveAddress(walletAddress)])
    ).filter(
      (adr) =>
        utils.isAddress(adr) && adr.toLowerCase() !== constants.AddressZero,
    );
  }

  addContract = /* @__PURE__ */ buildTransactionFunction(
    async (
      contractAddress: AddressOrEns,
    ): Promise<Transaction<TransactionResult>> => {
      return await this.addContracts.prepare([contractAddress]);
    },
  );

  addContracts = /* @__PURE__ */ buildTransactionFunction(
    async (
      contractAddresses: AddressOrEns[],
    ): Promise<Transaction<TransactionResult>> => {
      const deployerAddress = await this.getSignerAddress();
      const contractEncoder = new ContractEncoder(this);
      const encoded = (
        await Promise.all(contractAddresses.map((addr) => resolveAddress(addr)))
      ).map((address) =>
        contractEncoder.encode("add", [deployerAddress, address]),
      );
      return Transaction.fromContractWrapper({
        contractWrapper: this,
        method: "multicall",
        args: [encoded],
      });
    },
  );

  removeContract = /* @__PURE__ */ buildTransactionFunction(
    async (
      contractAddress: AddressOrEns,
    ): Promise<Transaction<TransactionResult>> => {
      return await this.removeContracts.prepare([contractAddress]);
    },
  );

  removeContracts = /* @__PURE__ */ buildTransactionFunction(
    async (
      contractAddresses: AddressOrEns[],
    ): Promise<Transaction<TransactionResult>> => {
      const deployerAddress = await this.getSignerAddress();
      const contractEncoder = new ContractEncoder(this);
      const encoded = (
        await Promise.all(contractAddresses.map((addr) => resolveAddress(addr)))
      ).map((address) =>
        contractEncoder.encode("remove", [deployerAddress, address]),
      );
      return Transaction.fromContractWrapper({
        contractWrapper: this,
        method: "multicall",
        args: [encoded],
      });
    },
  );
}
