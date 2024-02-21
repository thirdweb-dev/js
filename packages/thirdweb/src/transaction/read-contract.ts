import {
  parseAbiItem,
  type Abi,
  type AbiFunction,
  type AbiParametersToPrimitiveTypes,
  type ExtractAbiFunctionNames,
} from "abitype";
import type { Hex, TransactionRequest } from "viem";
import type { ThirdwebContract } from "../contract/contract.js";
import { isAbiFunction } from "./utils.js";
import { decodeFunctionResult } from "../abi/decode.js";
import type {
  BaseTransactionOptions,
  ParamsOption,
  ParseMethod,
} from "./types.js";
import type { PrepareTransactionOptions } from "./prepare-transaction.js";
import { encodeAbiFunction } from "../abi/encode.js";
import { getRpcClient } from "../rpc/rpc.js";
import { eth_call } from "../rpc/actions/eth_call.js";

export type ReadContractResult<abiFn extends AbiFunction> = // if the outputs are 0 length, return never, invalid case
  abiFn["outputs"] extends { length: 0 }
    ? never
    : abiFn["outputs"] extends { length: 1 }
      ? // if the outputs are 1 length, we'll always return the first element
        AbiParametersToPrimitiveTypes<abiFn["outputs"]>[0]
      : // otherwise we'll return the array
        AbiParametersToPrimitiveTypes<abiFn["outputs"]>;

export type ReadContractOptions<
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
    method: method;
  } & ParamsOption<ParseMethod<abi, method>> &
    Omit<PrepareTransactionOptions, "to" | "data" | "chain" | "client">,
  abi
>;

/**
 * Reads data from a smart contract.
 * @param options - The transaction options.
 * @returns A promise that resolves with the result of the read transaction.
 * @transaction
 * @example
 * ```ts
 * import { readContract } from "thirdweb";
 * const result = await readContract({
 *  contract,
 *  method: "totalSupply",
 * });
 * ```
 */
export async function readContract<
  const TAbi extends Abi,
  const TMethod extends TAbi extends {
    length: 0;
  }
    ?
        | AbiFunction
        | `function ${string}`
        | ((contract: ThirdwebContract<TAbi>) => Promise<AbiFunction>)
    : ExtractAbiFunctionNames<TAbi>,
>(
  options: ReadContractOptions<TAbi, TMethod>,
): Promise<ReadContractResult<ParseMethod<TAbi, TMethod>>> {
  const { contract, method, params } = options;
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

  let encodedDataPromise: Promise<Hex | undefined>;
  // this will be resolved exactly once, see the cache above 👆
  async function encodeData_(): Promise<Hex | undefined> {
    if (encodedDataPromise) {
      return encodedDataPromise;
    }
    return (encodedDataPromise = resolveAbiFunction_().then(
      // @ts-expect-error - too complicated
      (abiFn) => encodeAbiFunction(abiFn, params ?? []),
    ));
  }

  const [resolvedAbiFunction, encodedData] = await Promise.all([
    resolveAbiFunction_(),
    encodeData_(),
  ]);

  const rpcRequest = getRpcClient({
    chain: contract.chain,
    client: contract.client,
  });

  const result = await eth_call(rpcRequest, {
    data: encodedData,
    to: contract.address,
  });
  const decoded = decodeFunctionResult(resolvedAbiFunction, result);
  if (Array.isArray(decoded) && decoded.length === 1) {
    return decoded[0];
  }

  return decoded as ReadContractResult<ParseMethod<TAbi, TMethod>>;
}
