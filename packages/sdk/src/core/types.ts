import type { CONTRACTS_MAP, KNOWN_CONTRACTS_MAP } from "../contracts/maps";
import { FileOrBuffer } from "@thirdweb-dev/storage";
import { BigNumber, BytesLike, CallOverrides, Signer, providers } from "ethers";

// --- utility types extracted from from ts-toolbelt --- //

// class instance
type List<A = any> = ReadonlyArray<A>;
type Class<P extends List = any[], R extends object = object> = {
  new (...args: P): R;
};
type Instance<C extends Class> = C extends Class<any[], infer R> ? R : any;

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

export type ContractType = keyof typeof CONTRACTS_MAP;

export type ValidContractClass = ValueOf<typeof KNOWN_CONTRACTS_MAP>;

export type ValidContractInstance = Instance<ValidContractClass>;

export type ContractForContractType<TContractType extends ContractType> =
  Instance<typeof CONTRACTS_MAP[TContractType]>;

export type NetworkOrSignerOrProvider =
  | providers.Networkish
  | Signer
  | providers.Provider;
export type ValueOf<T> = T[keyof T];

export type SignerOrProvider = Signer | providers.Provider;

export type BufferOrStringWithName = {
  data: Buffer | string;
  name?: string;
};

type JsonLiteral = boolean | null | number | string;
type JsonLiteralOrFileOrBuffer = JsonLiteral | FileOrBuffer;
export type Json = JsonLiteralOrFileOrBuffer | JsonObject | Json[];
export type JsonObject = { [key: string]: Json };

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
