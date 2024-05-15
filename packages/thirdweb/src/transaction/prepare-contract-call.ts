import {
  type Abi,
  type AbiFunction,
  type ExtractAbiFunctionNames,
  parseAbiItem,
} from "abitype";
import type { TransactionRequest } from "viem";
import type { ThirdwebContract } from "../contract/contract.js";
import { encodeAbiParameters } from "../utils/abi/encodeAbiParameters.js";
import {
  type PreparedMethod,
  prepareMethod,
} from "../utils/abi/prepare-method.js";
import { resolvePromisedValue } from "../utils/promise/resolve-promised-value.js";
import {
  type PrepareTransactionOptions,
  prepareTransaction,
} from "./prepare-transaction.js";
import type {
  BaseTransactionOptions,
  ParamsOption,
  ParseMethod,
} from "./types.js";
import { isAbiFunction } from "./utils.js";

export type PrepareContractCallOptions<
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
    contract: ThirdwebContract<TAbi>;
    method: TMethod | TPreparedMethod;
  } & ParamsOption<TPreparedMethod[1]> &
    Omit<PrepareTransactionOptions, "to" | "data" | "chain" | "client">,
  TAbi
>;

/**
 * Prepares a contract call by resolving the ABI function, parameters and encoded data. Optionally specify other properties such as value or gas price.
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
 * Usage with explicit gas price and/or value:
 * ```ts
 * import { prepareContractCall } from "thirdweb";
 *
 * const transaction = await prepareContractCall({
 *  contract,
 *  method: "function transfer(address to, uint256 value)",
 *  params: [to, value],
 *  maxFeePerGas: 30n,
 *  maxPriorityFeePerGas: 1n,
 *  value: 100000n,
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
  const TPreparedMethod extends PreparedMethod<
    ParseMethod<TAbi, TMethod>
  > = PreparedMethod<ParseMethod<TAbi, TMethod>>,
>(options: PrepareContractCallOptions<TAbi, TMethod, TPreparedMethod>) {
  type ParsedMethod_ = ParseMethod<TAbi, TMethod>;
  type PreparedMethod_ = PreparedMethod<ParsedMethod_>;
  const { contract, method, params, ...rest } = options;

  const preparedMethodPromise = () =>
    (async () => {
      if (Array.isArray(method)) {
        return method as PreparedMethod_;
      }
      if (isAbiFunction(method)) {
        return prepareMethod(method as ParsedMethod_) as PreparedMethod_;
      }

      if (typeof method === "function") {
        return prepareMethod(
          // @ts-expect-error - method *is* function in this case
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
    })();

  return prepareTransaction(
    {
      ...rest,
      // these always inferred from the contract
      to: contract.address,
      chain: contract.chain,
      client: contract.client,
      data: async () => {
        let preparedM: PreparedMethod_;
        if (Array.isArray(method)) {
          preparedM = method as PreparedMethod_;
        } else {
          preparedM = await preparedMethodPromise();
        }

        if (preparedM[1].length === 0) {
          // just return the fn sig directly -> no params
          return preparedM[0];
        }

        // we do a "manual" concat here to avoid the overhead of the "concatHex" function
        // we can do this because we know the specific formats of the values
        return (preparedM[0] +
          encodeAbiParameters(
            preparedM[1],
            // @ts-expect-error - TODO: fix this type issue
            await resolvePromisedValue(params ?? []),
          ).slice(2)) as `${(typeof preparedM)[0]}${string}`;
      },
    },
    {
      preparedMethod: preparedMethodPromise,
      contract: contract,
    },
  );
}
