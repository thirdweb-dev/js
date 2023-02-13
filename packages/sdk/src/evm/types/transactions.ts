import { ContractWrapper } from "../core/classes/contract-wrapper";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { ethers } from "ethers";

type TransactionOptions = {
  method: string;
  args: any[];
  overrides?: ethers.CallOverrides;
  storage?: ThirdwebStorage;
};

export type TransactionOptionsWithContractWrapper<
  TContract extends ethers.BaseContract = ethers.BaseContract,
> = TransactionOptions & {
  contractWrapper: ContractWrapper<TContract>;
};

export type TransactionOptionsWithContract = Omit<
  TransactionOptions,
  "contract"
> & {
  contract: ethers.Contract;
  provider: ethers.providers.Provider;
  signer: ethers.Signer;
};

export type TransactionOptionsWithContractInfo = Omit<
  TransactionOptionsWithContract,
  "contract"
> & {
  provider: ethers.providers.Provider;
  contractAddress: string;
  contractAbi?: ethers.ContractInterface;
};
