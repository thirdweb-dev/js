import {
  type AbiFunction,
  type AbiParametersToPrimitiveTypes,
  parseAbiItem,
} from "abitype";
import { memoizePromise } from "../utils/promise.js";
import { isAbiFunction } from "../abi/resolveAbiFunction.js";
import type { ThirdwebContract } from "../contract/index.js";
import type { ParseMethod } from "../abi/types.js";
import type { ThirdwebClient } from "../client/client.js";
import type { Hash, Hex } from "viem";

type ParamsOption<abi extends AbiFunction> = abi["inputs"] extends { length: 0 }
  ? // allow omitting "args" if there are no inputs
    { params?: unknown[] }
  : {
      params:
        | AbiParametersToPrimitiveTypes<abi["inputs"]>
        | (() => Promise<AbiParametersToPrimitiveTypes<abi["inputs"]>>);
    };

export type TransactionOptions<
  client extends ThirdwebClient | ThirdwebContract,
  method extends AbiFunction | string,
> = TxOpts<client> &
  (
    | {
        method: method;
      }
    | {
        abi: method;
      }
  ) &
  ParamsOption<method extends AbiFunction ? method : ParseMethod<method>>;

export type Transaction<abiFn extends AbiFunction> = {
  contractAddress: string;
  chainId: number;
  client: ThirdwebClient;

  abi: () => Promise<abiFn>;

  transactionHash: Hash | null;

  _encoded: Promise<Hex> | null;
} & ParamsOption<abiFn>;

export function transaction<
  client extends ThirdwebClient | ThirdwebContract,
  method extends AbiFunction | string,
>(options: TransactionOptions<client, method>) {
  // declare the parsed abi inline
  type ParsedAbi = method extends AbiFunction ? method : ParseMethod<method>;

  const [opts] = extractTXOpts<client>(options);
  return {
    ...opts,
    params: options.params,
    // way to resolve the ABI reliably
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
          return abiItem as ParsedAbi;
        }
        throw new Error(`could not find function with name ${options.method}`);
      } catch (e) {}
      // if this fails we can download the abi of the contract and try parsing the entire abi
      const { resolveAbi } = await import("../abi/resolveContractAbi.js");

      const abi = await resolveAbi(opts);
      // we try to find the abiFunction in the abi
      const abiFunction = abi.find((item) => {
        // if the item is not a function we can ignore it
        if (item.type !== "function") {
          return false;
        }
        // if the item is a function we can compare the name
        return item.name === options.method;
      }) as ParsedAbi | undefined;

      if (!abiFunction) {
        throw new Error(`could not find function with name ${options.method}`);
      }
      return abiFunction;
    }),
    transactionHash: null,

    // "private" cached values
    _encoded: null,
  } as Transaction<ParsedAbi>;
}

export type ThirdwebClientLike = ThirdwebClient | ThirdwebContract;

export type TxOpts<
  client extends ThirdwebClientLike,
  T extends object = object,
> = (client extends ThirdwebContract
  ? {
      client: client;
      contractAddress?: never;
      chainId?: never;
    }
  : client extends ThirdwebClient
    ? {
        client: client;
        contractAddress: string;
        chainId: number;
      }
    : never) &
  T;

export function isThirdwebContract(
  client: ThirdwebClientLike,
): client is ThirdwebContract {
  return "address" in client && "chainId" in client;
}

export function extractTXOpts<
  TClient extends ThirdwebClientLike,
  T extends object = object,
>(options: TxOpts<TClient, T>) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { client, contractAddress, chainId, ...rest } = options;
  return [
    {
      client: extractClient(options),
      contractAddress: extractContractAddress(options),
      chainId: extractChainId(options),
    },
    rest as T,
  ] as const;
}

function extractClient<client extends ThirdwebClientLike>(
  options: TxOpts<client>,
) {
  return options.client;
}

function extractContractAddress<client extends ThirdwebClientLike>(
  options: TxOpts<client>,
) {
  if (options.contractAddress) {
    return options.contractAddress;
  }
  if (isThirdwebContract(options.client)) {
    return options.client.address;
  }
  throw new Error("Unable to extract extractContractAddress from tx options");
}

function extractChainId<client extends ThirdwebClientLike>(
  options: TxOpts<client>,
) {
  if (options.chainId) {
    return options.chainId;
  }
  if (isThirdwebContract(options.client)) {
    return options.client.chainId;
  }
  throw new Error("Unable to extract chainId from tx options");
}
