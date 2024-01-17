import {
  type AbiFunction,
  type AbiParametersToPrimitiveTypes,
  parseAbiItem,
} from "abitype";
import { memoizePromise } from "../utils/promise.js";
import { isAbiFunction } from "../abi/resolveAbiFunction.js";
import { resolveAbi } from "../abi/resolveContractAbi.js";
import type { GetContractOptions } from "../contract/index.js";
import type { ParseMethod } from "../abi/types.js";
import type { ThirdwebClient } from "../client/client.js";
import type { Hash, Hex } from "viem";

export type TransactionOptions<
  method extends string,
  abi extends AbiFunction,
  parsedAbi extends AbiFunction = abi extends AbiFunction
    ? abi
    : method extends `function ${string}`
      ? ParseMethod<method>
      : AbiFunction,
> = (parsedAbi["inputs"] extends { length: 0 }
  ? // allow omitting "args" if there are no inputs
    { params?: unknown[] }
  : {
      params:
        | AbiParametersToPrimitiveTypes<parsedAbi["inputs"]>
        | (() => Promise<AbiParametersToPrimitiveTypes<parsedAbi["inputs"]>>);
    }) &
  (
    | {
        method: method;
      }
    | {
        abi: abi;
      }
  );

export type Transaction<abiFn extends AbiFunction> = {
  inputs: TransactionOptions<string, abiFn> & GetContractOptions;
  client: ThirdwebClient;
  abi: () => Promise<abiFn>;
  _encoded: Promise<Hex> | null;
  transactionHash: Hash | null;
};

export function transaction<
  method extends string,
  abi extends AbiFunction,
  parsedAbi extends AbiFunction = abi extends AbiFunction
    ? abi
    : method extends `function ${string}`
      ? ParseMethod<method>
      : AbiFunction,
>(
  client: ThirdwebClient,
  options: TransactionOptions<method, abi> & GetContractOptions,
) {
  return {
    inputs: options,
    client: client,
    abi: memoizePromise(async () => {
      if ("abi" in options) {
        return options.abi;
      }
      if (isAbiFunction(options.method)) {
        return options.method;
      }
      // otherwise try to parse it
      try {
        const abiItem = parseAbiItem(options.method as string);
        if (abiItem.type === "function") {
          return abiItem as parsedAbi;
        }
        throw new Error(`could not find function with name ${options.method}`);
      } catch (e) {}
      // if this fails we can download the abi of the contract and try parsing the entire abi
      const abi = await resolveAbi(options);
      // we try to find the abiFunction in the abi
      const abiFunction = abi.find((item) => {
        // if the item is not a function we can ignore it
        if (item.type !== "function") {
          return false;
        }
        // if the item is a function we can compare the name
        return item.name === options.method;
      }) as parsedAbi | undefined;

      if (!abiFunction) {
        throw new Error(`could not find function with name ${options.method}`);
      }
      return abiFunction;
    }),
    _encoded: null,
    transactionHash: null,
  } as Transaction<parsedAbi>;
}
