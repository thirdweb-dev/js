import type {
  Abi,
  AbiFunction,
  AbiParametersToPrimitiveTypes,
  Address,
  ExtractAbiFunctionNames,
} from "abitype";
import type { ThirdwebContract } from "../contract/index.js";
import type { ParseMethod } from "../abi/types.js";
import { isObjectWithKeys } from "../utils/type-guards.js";
import type { Hex } from "viem";
import type { FeeDataParams } from "../gas/fee-data.js";

type ParamsOption<abiFn extends AbiFunction> = abiFn["inputs"] extends {
  length: 0;
}
  ? // allow omitting "params" if there are no inputs
    { params?: unknown[] }
  : {
      params:
        | AbiParametersToPrimitiveTypes<abiFn["inputs"]>
        | (() => Promise<
            | AbiParametersToPrimitiveTypes<abiFn["inputs"]>
            | {
                params: AbiParametersToPrimitiveTypes<abiFn["inputs"]>;
                overrides: Partial<DynamicTransactionOverrides>;
              }
          >);
    };

export type TransactionOverrides = {
  // all other normal transaction options
  accessList?: Array<{ address: Address; storageKeys: Hex[] }>;
  gas?: bigint;
  nonce?: number;
  value?: bigint;
} & FeeDataParams;

export type DynamicTransactionOverrides = Pick<TransactionOverrides, "value">;

export type TransactionOptions<
  abi extends Abi,
  method extends AbiFunction | string,
> = TxOpts<object, abi> & {
  method: method;
} & ParamsOption<ParseMethod<abi, method>> &
  TransactionOverrides;

// the only difference here is that we don't alow string methods
export type Transaction<abiFn extends AbiFunction> = TransactionOptions<
  Abi,
  abiFn
>;

/**
 * Prepares a transaction with the specified options.
 * @param options - The transaction options.
 * @returns The prepared transaction.
 * @example
 * ```ts
 * import { prepareTransaction } from "thirdweb";
 * const tx = prepareTransaction({
 *  contract,
 *  method: "totalSupply",
 * });
 * ```
 */
export function prepareTransaction<
  const abi extends Abi,
  // if an abi has been passed into the contract, restrict the method to function names of the abi
  const method extends abi extends { length: 0 }
    ? AbiFunction | string
    : ExtractAbiFunctionNames<abi>,
>(options: TransactionOptions<abi, method>) {
  return options as Transaction<ParseMethod<abi, method>>;
}

export type TxOpts<T extends object = object, abi extends Abi = []> = {
  contract: ThirdwebContract<abi>;
} & T;

/**
 * Checks if the given value is of type TxOpts.
 * @param value - The value to check.
 * @returns True if the value is of type TxOpts, false otherwise.
 * @internal
 */
export function isTxOpts(value: unknown): value is TxOpts {
  return (
    isObjectWithKeys(value, ["contract"]) &&
    isObjectWithKeys(value.contract, ["address", "chainId"]) &&
    typeof value.contract.chainId === "number" &&
    typeof value.contract.address === "string"
  );
}

/**
 * Checks if the given item is an instance of AbiFunction.
 * @param item - The item to be checked.
 * @returns True if the item is an AbiFunction, false otherwise.
 * @internal
 */
export function isAbiFunction(item: unknown): item is AbiFunction {
  return !!(
    item &&
    typeof item === "object" &&
    "type" in item &&
    item.type === "function"
  );
}
