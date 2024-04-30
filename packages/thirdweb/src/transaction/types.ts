import type {
  Abi,
  AbiFunction,
  AbiParameter,
  AbiParametersToPrimitiveTypes,
  ExtractAbiFunction,
  ParseAbiItem,
} from "abitype";
import type { TransactionReceipt as ViemTransactionReceipt } from "viem";
import type { ThirdwebContract } from "../contract/contract.js";
import type { Hex } from "../utils/encoding/hex.js";
import { isObjectWithKeys } from "../utils/type-guards.js";
import type {
  PreparedTransaction,
  StaticPrepareTransactionOptions,
} from "./prepare-transaction.js";

export type SendTransactionResult = {
  readonly transactionHash: Hex;
};

export type TransactionReceipt = ViemTransactionReceipt;

export type WithOverrides<T> = T & {
  overrides?: Omit<
    StaticPrepareTransactionOptions,
    "to" | "from" | "data" | "maxFeePerBlobGas" | "chain" | "client"
  >;
};

export type ParamsOption<inputs extends readonly AbiParameter[]> =
  inputs extends {
    length: 0;
  }
    ? // allow omitting "params" if there are no inputs
      { params?: readonly unknown[] }
    : {
        params:
          | Readonly<AbiParametersToPrimitiveTypes<inputs>>
          | (() => Promise<Readonly<AbiParametersToPrimitiveTypes<inputs>>>);
      };

export type BaseTransactionOptions<
  T extends object = object,
  // biome-ignore lint/suspicious/noExplicitAny: TODO: fix later
  abi extends Abi = any,
> = {
  contract: ThirdwebContract<abi>;
} & T;
// type-guard
/**
 * Checks if the given value is of type TxOpts.
 * @param value - The value to check.
 * @returns True if the value is of type TxOpts, false otherwise.
 * @internal
 */
export function isBaseTransactionOptions(
  value: unknown,
): value is PreparedTransaction {
  return (
    isObjectWithKeys(value, ["__contract"]) &&
    isObjectWithKeys(value.__contract, ["address", "chain"]) &&
    typeof value.__contract.address === "string"
  );
}

export type ParseMethod<
  abi extends Abi,
  method extends
    | AbiFunction
    | string
    | ((contract: ThirdwebContract<abi>) => Promise<AbiFunction>),
> = method extends AbiFunction // if the method IS an AbiFunction, return it
  ? method
  : method extends string // we now know we are in "string" territory
    ? // if the string starts with `function` then we can parse it
      method extends `function ${string}`
      ? ParseAbiItem<method> extends AbiFunction
        ? ParseAbiItem<method>
        : never
      : // do we have an ABI to check, check the length
        abi extends { length: 0 }
        ? // if not, we return AbiFunction
          AbiFunction
        : // if we do have a length, extract the abi function
          ExtractAbiFunction<abi, method>
    : // this means its neither have an AbiFunction NOR a string -> never
      AbiFunction;
