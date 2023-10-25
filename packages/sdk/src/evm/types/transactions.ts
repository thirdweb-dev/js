import { ContractWrapper } from "../core/classes/contract-wrapper";
import { TransactionResult } from "../core/types";
import { SDKOptionsOutput } from "../schema/sdk-options";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import type {
  providers,
  Signer,
  CallOverrides,
  BaseContract,
  Contract,
  ContractInterface,
  ContractFactory,
} from "ethers";
import EventEmitter from "eventemitter3";
import { DeployEvents } from "./deploy/deploy-events";

export type ParseTransactionReceipt<TResult = TransactionResult> =
  | ((receipt: providers.TransactionReceipt) => TResult)
  | ((receipt: providers.TransactionReceipt) => Promise<TResult>);

export type TransactionContextOptions = {
  args: any[];
  provider: providers.Provider;
  signer: Signer;
  overrides?: CallOverrides;
  storage: ThirdwebStorage;
};

type TransactionOptions<TResult = TransactionResult> = {
  method: string;
  args: any[];
  overrides?: CallOverrides;
  storage: ThirdwebStorage;
  gasless?: SDKOptionsOutput["gasless"];
  parse?: ParseTransactionReceipt<TResult>;
};

export type TransactionOptionsWithContractWrapper<
  TContract extends BaseContract,
  TResult = TransactionResult,
  TMethod extends keyof TContract["functions"] = keyof TContract["functions"],
> = Omit<TransactionOptions<TResult>, "storage"> & {
  method: TMethod;
  args: Parameters<TContract["functions"][TMethod]>;
  contractWrapper: ContractWrapper<TContract>;
};

export type TransactionOptionsWithContract<TResult = TransactionResult> = Omit<
  TransactionOptions<TResult>,
  "contract"
> & {
  contract: Contract;
  provider: providers.Provider;
  signer: Signer;
};

export type TransactionOptionsWithContractInfo<TResult = TransactionResult> =
  Omit<TransactionOptionsWithContract<TResult>, "contract"> & {
    provider: providers.Provider;
    contractAddress: string;
    contractAbi?: ContractInterface;
  };

export type DeployTransactionOptions = TransactionContextOptions & {
  factory: ContractFactory;
  // TODO: Remove once we make the breaking change of removing deploy listeners
  events?: EventEmitter<DeployEvents>;
};
