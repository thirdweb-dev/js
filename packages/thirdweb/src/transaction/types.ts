import type { Hex } from "viem";
import type { Abi, AbiFunction, AbiParametersToPrimitiveTypes } from "abitype";
import type { ThirdwebContract } from "../contract/contract.js";
import { isObjectWithKeys } from "../utils/type-guards.js";

export type TransactionOrUserOpHash =
  | {
      readonly transactionHash: Hex;
      readonly userOpHash?: never;
    }
  | {
      readonly transactionHash?: never;
      readonly userOpHash: Hex;
    };

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
