import { ContractWrapper } from "../core/classes/contract-wrapper";
import { TransactionResult } from "../core/types";
import { SDKOptionsOutput } from "../schema/sdk-options";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { ethers } from "ethers";
import EventEmitter from "eventemitter3";
import { DeployEvents } from "./deploy";

export type ParseTransactionReceipt<TResult = TransactionResult> =
  | ((receipt: ethers.providers.TransactionReceipt) => TResult)
  | ((receipt: ethers.providers.TransactionReceipt) => Promise<TResult>);

export type TransactionContextOptions = {
  args: any[];
  provider: ethers.providers.Provider;
  signer: ethers.Signer;
  overrides?: ethers.CallOverrides;
  storage?: ThirdwebStorage;
};

type TransactionOptions<TResult = TransactionResult> = {
  method: string;
  args: any[];
  overrides?: ethers.CallOverrides;
  storage?: ThirdwebStorage;
  gasless?: SDKOptionsOutput["gasless"];
  parse?: ParseTransactionReceipt<TResult>;
};

export type TransactionOptionsWithContractWrapper<
  TContract extends ethers.BaseContract,
  TResult = TransactionResult,
  TMethod extends keyof TContract["functions"] = keyof TContract["functions"],
> = TransactionOptions<TResult> & {
  method: TMethod;
  args: Parameters<TContract["functions"][TMethod]>;
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

export type DeployTransactionOptions = TransactionContextOptions & {
  factory: ethers.ContractFactory;
  // TODO: Remove once we make the breaking change of removing deploy listeners
  events?: EventEmitter<DeployEvents>;
};
