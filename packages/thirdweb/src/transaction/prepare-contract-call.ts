import {
  parseAbiItem,
  type Abi,
  type AbiFunction,
  type AbiParametersToPrimitiveTypes,
  type ExtractAbiFunctionNames,
} from "abitype";
import type { TransactionRequest, Hex } from "viem";
import type { ThirdwebContract } from "../index.js";
import type { ParseMethod } from "../abi/types.js";
import { encodeAbiFunction } from "../abi/encode.js";
import { isAbiFunction } from "./utils.js";
import {
  prepareTransaction,
  type PrepareTransactionOptions,
} from "./prepare-transaction.js";
import type { BaseTransactionOptions, ParamsOption } from "./types.js";
import { resolvePromisedValue } from "../utils/promise/resolve-promised-value.js";

export type PrepareContractCallOptions<
  abi extends Abi = [],
  method extends
    | AbiFunction
    | string
    | ((
        contract: ThirdwebContract<abi>,
      ) => Promise<AbiFunction>) = abi extends { length: 0 }
    ? AbiFunction | string
    : ExtractAbiFunctionNames<abi>,
> = BaseTransactionOptions<
  Omit<TransactionRequest, "from" | "to" | "data"> & {
    contract: ThirdwebContract<abi>;
    method: method;
  } & ParamsOption<ParseMethod<abi, method>> &
    Omit<PrepareTransactionOptions, "to" | "data" | "chain" | "client">,
  abi
>;

/**
 * Prepares a contract call by resolving the ABI function, parameters, and encoded data.
 * @param options - The options for preparing the contract call.
 * @returns A promise that resolves to the prepared transaction.
 * @transaction
 * @example
 * Usage with a human-readable method signature:
 * ```ts
 * import { prepareContractCall } from "thirdweb";
 *
 * const transaction = await prepareContractCall({
 *  contract,
 *  method: "function transfer(address to, uint256 value)",
 *  params: [to, value],
 * });
 * ```
 * @example
 * Usage with a JSON ABI function object:
 * ```ts
 * import { prepareContractCall } from "thirdweb";
 *
 * const transaction = await prepareContractCall({
 *  contract,
 *  method: {
 *    name: "transfer",
 *    type: "function",
 *    inputs: [
 *      { name: "to", type: "address" },
 *      { name: "value", type: "uint256" },
 *    ],
 *    outputs: [],
 *    stateMutability: "payable"
 *   },
 *  params: [to, value],
 * });
 * ```
 * @example
 * Usage with a the ABI defined on the contract:
 * ```ts
 * import { getContract, prepareContractCall } from "thirdweb";
 * const contract = getContract({
 *  ..., // chain, address, client
 *  abi: [...] // ABI with a "transfer" method
 * });
 * const transaction = prepareContractCall({
 *  contract,
 *  method: "transfer", // <- this gets inferred from the contract
 *  params: [to, value],
 * });
 * ```
 */
export function prepareContractCall<
  const TAbi extends Abi,
  const TMethod extends TAbi extends {
    length: 0;
  }
    ?
        | AbiFunction
        | `function ${string}`
        | ((contract: ThirdwebContract<TAbi>) => Promise<AbiFunction>)
    : ExtractAbiFunctionNames<TAbi>,
>(options: PrepareContractCallOptions<TAbi, TMethod>) {
  const { contract, method, params, ...rest } = options;
  let abiFnPromise: Promise<ParseMethod<TAbi, TMethod>>;
  // this will be resolved exactly once, see the cache above 👆
  async function resolveAbiFunction_(): Promise<ParseMethod<TAbi, TMethod>> {
    if (abiFnPromise) {
      return abiFnPromise;
    }
    if (isAbiFunction(method)) {
      return method as ParseMethod<TAbi, TMethod>;
    }

    if (typeof method === "function") {
      // @ts-expect-error -- to complicated
      return (await method(contract)) as ParseMethod<TAbi, TMethod>;
    }
    // if the method starts with the string `function ` we always will want to try to parse it
    if (typeof method === "string" && method.startsWith("function ")) {
      // @ts-expect-error - method *is* string in this case
      const abiItem = parseAbiItem(method);
      if (abiItem.type === "function") {
        return abiItem as ParseMethod<TAbi, TMethod>;
      }
      throw new Error(`"method" passed is not of type "function"`);
    }
    // check if we have a "abi" on the contract
    if (contract.abi && contract.abi?.length > 0) {
      // extract the abiFunction from it
      const abiFunction = contract.abi?.find(
        (item) => item.type === "function" && item.name === method,
      );
      // if we were able to find it -> return it
      if (abiFunction) {
        return abiFunction as ParseMethod<TAbi, TMethod>;
      }
    }
    throw new Error(`Could not resolve method "${method}".`);
  }

  let resolvedParamsPromise: Promise<
    Readonly<
      AbiParametersToPrimitiveTypes<ParseMethod<TAbi, TMethod>["inputs"]>
    >
  >;

  async function resolveParams_(): Promise<
    Readonly<
      AbiParametersToPrimitiveTypes<ParseMethod<TAbi, TMethod>["inputs"]>
    >
  > {
    if (resolvedParamsPromise) {
      return resolvedParamsPromise;
    }
    // @ts-expect-error -- to complicated
    return (resolvedParamsPromise = resolvePromisedValue(params ?? []));
  }

  let encodedDataPromise: Promise<Hex | undefined>;
  // this will be resolved exactly once, see the cache above 👆
  async function encodeData_(): Promise<Hex | undefined> {
    if (encodedDataPromise) {
      return encodedDataPromise;
    }
    const [rAbiFn, rParams] = await Promise.all([
      resolveAbiFunction_(),
      resolveParams_(),
    ]);
    // @ts-expect-error -- to complicated
    return encodeAbiFunction(rAbiFn, rParams);
  }
  return prepareTransaction(
    {
      ...rest,
      // these always inferred from the contract
      to: contract.address,
      chain: contract.chain,
      client: contract.client,
      data: encodeData_,
    },
    {
      abiFn: resolveAbiFunction_,
    },
  );
}
