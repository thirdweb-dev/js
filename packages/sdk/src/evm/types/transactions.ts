import { ContractWrapper } from "../core/classes/contract-wrapper";
import { TransactionResult } from "../core/types";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { ethers } from "ethers";

export type ParseTransactionReceipt<TResult = TransactionResult> =
  | ((receipt: ethers.providers.TransactionReceipt) => TResult)
  | ((receipt: ethers.providers.TransactionReceipt) => Promise<TResult>);

type TransactionOptions<TResult = TransactionResult> = {
  method: string;
  args: any[];
  overrides?: ethers.CallOverrides;
  storage?: ThirdwebStorage;
  parse?: ParseTransactionReceipt<TResult>;
};

export type TransactionOptionsWithContractWrapper<
  TResult = TransactionResult,
  TContract extends ethers.BaseContract = ethers.BaseContract,
> = TransactionOptions<TResult> & {
  method: keyof TContract["interface"]["functions"];
  contractWrapper: ContractWrapper<TContract>;
};

export type TransactionOptionsWithContract<TResult = TransactionResult> = Omit<
  TransactionOptions<TResult>,
  "contract"
> & {
  contract: ethers.Contract;
  provider: ethers.providers.Provider;
  signer: ethers.Signer;
};

export type TransactionOptionsWithContractInfo<TResult = TransactionResult> =
  Omit<TransactionOptionsWithContract<TResult>, "contract"> & {
    provider: ethers.providers.Provider;
    contractAddress: string;
    contractAbi?: ethers.ContractInterface;
  };
