import type {
  Abi,
  AbiFunction,
  AbiParametersToPrimitiveTypes,
  ExtractAbiFunction,
  ParseAbiItem,
} from "abitype";
import type { ThirdwebContract } from "../contract/contract.js";
import { isObjectWithKeys } from "../utils/type-guards.js";
import type { Hex } from "../utils/encoding/hex.js";
import type { TransactionReceipt as ViemTransactionReceipt } from "viem";

export type TransactionOrUserOpHash =
  | {
      readonly transactionHash: Hex;
      readonly userOpHash?: never;
    }
  | {
      readonly transactionHash?: never;
      readonly userOpHash: Hex;
    };

export type TransactionReceipt = ViemTransactionReceipt;

export type ParamsOption<abiFn extends AbiFunction> = abiFn["inputs"] extends {
  length: 0;
}
  ? // allow omitting "params" if there are no inputs
    { params?: readonly unknown[] }
  : {
      params:
        | Readonly<AbiParametersToPrimitiveTypes<abiFn["inputs"]>>
        | (() => Promise<
            Readonly<AbiParametersToPrimitiveTypes<abiFn["inputs"]>>
          >);
    };

export type BaseTransactionOptions<
  T extends object = object,
  abi extends Abi = [],
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
): value is BaseTransactionOptions {
  return (
    isObjectWithKeys(value, ["contract"]) &&
    isObjectWithKeys(value.contract, ["address", "chain"]) &&
    typeof value.contract.address === "string"
  );
}

export type ParseMethod<
  abi extends Abi,
  method extends
    | AbiFunction
    | string
    | ((contract: ThirdwebContract<abi>) => Promise<AbiFunction>),
> =
  // if the method IS an AbiFunction, return it
  method extends AbiFunction
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
