import type { CONTRACTS_MAP, PREBUILT_CONTRACTS_MAP } from "../contracts";
import type { SmartContract } from "../contracts/smart-contract";
import { BigNumber, BytesLike, CallOverrides, Signer, providers } from "ethers";

// --- utility types extracted from from ts-toolbelt --- //

// if
type TBoolean = 0 | 1;
type If<B extends TBoolean, Then, Else = never> = B extends 1 ? Then : Else;

// equals
type Equals<A1, A2> = (<A>() => A extends A2 ? 1 : 0) extends <
  A,
>() => A extends A1 ? 1 : 0
  ? 1
  : 0;

// --- end utility types --- //
export type PrebuiltContractsMap = typeof PREBUILT_CONTRACTS_MAP;
export type PrebuiltContractsInstances = {
  [K in keyof PrebuiltContractsMap]: Awaited<
    ReturnType<typeof PREBUILT_CONTRACTS_MAP[K]["initialize"]>
  >;
};
export type ContractsMap = typeof CONTRACTS_MAP;

export type PrebuiltContractType = keyof PrebuiltContractsMap;
export type ContractType = keyof ContractsMap;

export type ValidContractInstance =
  | Awaited<ReturnType<ContractsMap[keyof PrebuiltContractsMap]["initialize"]>>
  | SmartContract;

export type SchemaForPrebuiltContractType<
  TContractType extends PrebuiltContractType,
> = PrebuiltContractsMap[TContractType]["schema"];

export type DeploySchemaForPrebuiltContractType<
  TContractType extends PrebuiltContractType,
> = SchemaForPrebuiltContractType<TContractType>["deploy"];

export type ContractForPrebuiltContractType<
  TContractType extends PrebuiltContractType,
> = PrebuiltContractsInstances[TContractType];

export type NetworkOrSignerOrProvider =
  | providers.Networkish
  | Signer
  | providers.Provider;
export type ValueOf<T> = T[keyof T];

export type SignerOrProvider = Signer | providers.Provider;

type TransactionResultWithMetadata<T = unknown> = {
  receipt: providers.TransactionReceipt;
  data: () => Promise<T>;
};

export type TransactionResultWithId<T = never> = TransactionResult<T> & {
  id: BigNumber;
};

export type TransactionResultWithAddress<T = never> = TransactionResult<T> & {
  address: string;
};

export type TransactionResult<T = never> = If<
  Equals<T, never>,
  Omit<TransactionResultWithMetadata, "data">,
  TransactionResultWithMetadata<T>
>;

/**
 * Forward Request Message that's used for gasless transaction
 * @public
 */
export type ForwardRequestMessage = {
  from: string;
  to: string;
  value: string;
  gas: string;
  nonce: string;
  data: BytesLike;
  chainid?: string;
};

/**
 * EIP-2612 token permit message for gasless transaction
 * @public
 */
export type PermitRequestMessage = {
  to: string;
  owner: string;
  spender: string;
  value: number | string;
  nonce: number | string;
  deadline: number | string;
  v: number;
  r: string;
  s: string;
};

/**
 * transaction message contains information that's needed to execute a gasless transaction
 */
export interface GaslessTransaction {
  from: string;
  to: string;
  data: string;
  chainId: number;
  gasLimit: BigNumber;
  functionName: string;
  functionArgs: any[];
  callOverrides: CallOverrides;
}
