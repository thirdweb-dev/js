import type {
  Abi,
  AbiFunction,
  AbiParametersToPrimitiveTypes,
  ExtractAbiFunctionNames,
} from "abitype";
import type { Hex } from "viem";
import {
  resolveAbiFunction,
  type PrepareContractCallOptions,
} from "../transaction.js";
import type { ParseMethod } from "../../abi/types.js";

import { eth_call, getRpcClient } from "../../rpc/index.js";
import { decodeFunctionResult } from "../../abi/decode.js";
import { encodeAbiFunction } from "../../abi/encode.js";

export type ReadOutputs<abiFn extends AbiFunction> = // if the outputs are 0 length, return never, invalid case
  abiFn["outputs"] extends { length: 0 }
    ? never
    : abiFn["outputs"] extends { length: 1 }
      ? // if the outputs are 1 length, we'll always return the first element
        AbiParametersToPrimitiveTypes<abiFn["outputs"]>[0]
      : // otherwise we'll return the array
        AbiParametersToPrimitiveTypes<abiFn["outputs"]>;

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
  const TAbi extends Abi = [],
  const TMethod extends AbiFunction | string = TAbi extends { length: 0 }
    ? AbiFunction | string
    : ExtractAbiFunctionNames<TAbi>,
>(
  options: PrepareContractCallOptions<TAbi, TMethod>,
): Promise<ReadOutputs<ParseMethod<TAbi, TMethod>>> {
  const { contract, method, params } = options;
  let abiFnPromise: Promise<ParseMethod<TAbi, TMethod>>;
  // this will be resolved exactly once, see the cache above 👆
  async function resolveAbiFunction_(): Promise<ParseMethod<TAbi, TMethod>> {
    if (abiFnPromise) {
      return abiFnPromise;
    }
    return (abiFnPromise = resolveAbiFunction({
      contract,
      method,
    }));
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

  return decoded as ReadOutputs<ParseMethod<TAbi, TMethod>>;
}
