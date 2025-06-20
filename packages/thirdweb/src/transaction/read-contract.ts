import {
  type Abi,
  type AbiFunction,
  type AbiParameter,
  type AbiParametersToPrimitiveTypes,
  type ExtractAbiFunctionNames,
  parseAbiItem,
} from "abitype";
import { decodeAbiParameters, type TransactionRequest } from "viem";
import type { ThirdwebContract } from "../contract/contract.js";
import { eth_call } from "../rpc/actions/eth_call.js";
import { getRpcClient } from "../rpc/rpc.js";
import { encodeAbiParameters } from "../utils/abi/encodeAbiParameters.js";
import {
  type PreparedMethod,
  prepareMethod,
} from "../utils/abi/prepare-method.js";
import { getAddress } from "../utils/address.js";
import type { Hex } from "../utils/encoding/hex.js";
import type { PrepareTransactionOptions } from "./prepare-transaction.js";
import type {
  BaseTransactionOptions,
  ParamsOption,
  ParseMethod,
} from "./types.js";
import { isAbiFunction } from "./utils.js";

export type ReadContractResult<outputs extends readonly AbiParameter[]> = // if the outputs are 0 length, return never, invalid case
  outputs extends { length: 0 }
    ? never
    : outputs extends { length: 1 }
      ? // if the outputs are 1 length, we'll always return the first element
        AbiParametersToPrimitiveTypes<outputs>[0]
      : // otherwise we'll return the array
        AbiParametersToPrimitiveTypes<outputs>;

export type ReadContractOptions<
  TAbi extends Abi = [],
  TMethod extends
    | AbiFunction
    | string
    | ((
        contract: ThirdwebContract<TAbi>,
      ) => Promise<AbiFunction>) = TAbi extends { length: 0 }
    ? AbiFunction | string
    : ExtractAbiFunctionNames<TAbi>,
  TPreparedMethod extends PreparedMethod<
    ParseMethod<TAbi, TMethod>
  > = PreparedMethod<ParseMethod<TAbi, TMethod>>,
> = BaseTransactionOptions<
  Omit<
    TransactionRequest,
    | "from"
    | "to"
    | "data"
    | "value"
    | "accessList"
    | "gas"
    | "gasPrice"
    | "maxFeePerGas"
    | "maxPriorityFeePerGas"
    | "nonce"
  > & {
    method: TMethod | TPreparedMethod;
    from?: string;
  } & ParamsOption<TPreparedMethod[1]> &
    Omit<PrepareTransactionOptions, "to" | "data" | "chain" | "client">,
  TAbi
>;

/**
 * ### Reads state from a deployed smart contract.
 *
 * Use this for raw read calls from a contract, but you can also use read [extensions](https://portal.thirdweb.com/typescript/v5/extensions/use) for predefined methods for common standards.
 *
 * @param options - The transaction options.
 * @returns A promise that resolves with the result of the read call.
 * @transaction
 * @example
 *
 * ### Raw contract call (recommended)
 *
 * You can read from any contract by using the solidity signature of the function you want to call.
 *
 * ```ts
 * import { getContract } from "thirdweb";
 * import { sepolia } from "thirdweb/chains";
 * import { useReadContract } from "thirdweb/react";
 *
 * const contract = getContract({
 *   client,
 *   address: "0x...",
 *   chain: sepolia,
 * });
 *
 * const { data, isLoading } = useReadContract({
 *   contract,
 *   method: "function tokenURI(uint256 tokenId) returns (string)",
 *   params: [1n],
 * });
 * ```
 *
 * Note that this is type safe, the params types will be enforced based on the signature.
 *
 * ### Raw contract call with `resolveMethod`
 *
 * If you don't have the solidity signature of the function you want to call, you can use the `resolveMethod` helper to resolve the method from any deployed contract.
 *
 * Note that this is not type safe, and will also have a 1 time overhead of resolving the contract ABI.
 *
 * ```ts
 * import { getContract, resolveMethod } from "thirdweb";
 * import { sepolia } from "thirdweb/chains";
 * import { useReadContract } from "thirdweb/react";
 *
 * const contract = getContract({
 *   client,
 *   address: "0x...",
 *   chain: sepolia,
 * });
 *
 * const { data, isLoading } = useReadContract({
 *   contract,
 *   method: resolveMethod("tokenURI"),
 *   params: [1n],
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
  const TPreparedMethod extends PreparedMethod<
    ParseMethod<TAbi, TMethod>
  > = PreparedMethod<ParseMethod<TAbi, TMethod>>,
>(
  options: ReadContractOptions<TAbi, TMethod, TPreparedMethod>,
): Promise<ReadContractResult<TPreparedMethod[2]>> {
  type ParsedMethod_ = ParseMethod<TAbi, TMethod>;
  type PreparedMethod_ = PreparedMethod<ParsedMethod_>;
  const { contract, method, params } = options;

  const resolvePreparedMethod = async () => {
    if (Array.isArray(method)) {
      return method as PreparedMethod_;
    }
    if (isAbiFunction(method)) {
      return prepareMethod(method as ParsedMethod_) as PreparedMethod_;
    }

    if (typeof method === "function") {
      return prepareMethod(
        // @ts-expect-error - we're sure it's a function
        (await method(contract)) as ParsedMethod_,
      ) as PreparedMethod_;
    }
    // if the method starts with the string `function ` we always will want to try to parse it
    if (typeof method === "string" && method.startsWith("function ")) {
      // @ts-expect-error - method *is* string in this case
      const abiItem = parseAbiItem(method);
      if (abiItem.type === "function") {
        return prepareMethod(abiItem as ParsedMethod_) as PreparedMethod_;
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
        return prepareMethod(abiFunction as ParsedMethod_) as PreparedMethod_;
      }
    }
    throw new Error(`Could not resolve method "${method}".`);
  };

  // resolve in parallel
  const [resolvedPreparedMethod, resolvedParams] = await Promise.all([
    resolvePreparedMethod(),
    typeof params === "function" ? params() : params,
  ]);

  let encodedData: Hex;

  // if we have no inputs, we know it's just the signature
  if (resolvedPreparedMethod[1].length === 0) {
    encodedData = resolvedPreparedMethod[0];
  } else {
    // we do a "manual" concat here to avoid the overhead of the "concatHex" function
    // we can do this because we know the specific formats of the values
    encodedData = (resolvedPreparedMethod[0] +
      encodeAbiParameters(
        resolvedPreparedMethod[1],
        // @ts-expect-error - TODO: fix this type issue
        resolvedParams,
      ).slice(2)) as `${(typeof resolvedPreparedMethod)[0]}${string}`;
  }

  const rpcRequest = getRpcClient({
    chain: contract.chain,
    client: contract.client,
  });

  const result = await eth_call(rpcRequest, {
    data: encodedData,
    from: options.from ? getAddress(options.from) : undefined,
    to: contract.address,
  });
  // use the prepared method to decode the result
  const decoded = decodeAbiParameters(resolvedPreparedMethod[2], result);
  if (Array.isArray(decoded) && decoded.length === 1) {
    return decoded[0];
  }

  return decoded as ReadContractResult<TPreparedMethod[2]>;
}
