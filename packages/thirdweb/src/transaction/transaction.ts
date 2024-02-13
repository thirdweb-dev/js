/* eslint-disable jsdoc/require-jsdoc */
import type {
  Abi,
  AbiFunction,
  AbiParametersToPrimitiveTypes,
  Address,
  ExtractAbiFunctionNames,
} from "abitype";
import {
  type TransactionRequest,
  type Hex,
  parseAbiItem,
  type AccessList,
} from "viem";
import type { Chain, ThirdwebClient, ThirdwebContract } from "../index.js";
import type { ParseMethod } from "../abi/types.js";
import { encodeAbiFunction } from "../abi/encode.js";
import { isObjectWithKeys } from "../utils/type-guards.js";

type ParamsOption<abiFn extends AbiFunction> = abiFn["inputs"] extends {
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
> = Omit<TransactionRequest, "from" | "to" | "data"> & {
  contract: ThirdwebContract<abi>;
  method: method;
} & ParamsOption<ParseMethod<abi, method>> &
  Omit<PrepareTransactionOptions, "to" | "data" | "chain" | "client">;

export function prepareContractCall<
  const TAbi extends Abi = [],
  const TMethod extends
    | AbiFunction
    | string
    | ((
        contract: ThirdwebContract<TAbi>,
      ) => Promise<AbiFunction>) = TAbi extends {
    length: 0;
  }
    ? AbiFunction | `function ${string}`
    : ExtractAbiFunctionNames<TAbi>,
>(options: PrepareContractCallOptions<TAbi, TMethod>) {
  const { contract, method, params, ...rest } = options;
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
    return (resolvedParamsPromise = resolvePossiblyAsyncValue(params ?? []));
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
  return prepareTransaction({
    // these always inferred from the contract
    to: contract.address,
    chain: contract.chain,
    client: contract.client,
    data: encodeData_,
    ...rest,
  });
}

export type PrepareTransactionOptions = {
  accessList?: AccessList | (() => Promise<AccessList>);
  to?: Address | (() => Promise<Address>);
  data?: Hex | (() => Promise<Hex | undefined>);
  value?: bigint | (() => Promise<bigint>);
  gas?: bigint | (() => Promise<bigint>);
  gasPrice?: bigint | (() => Promise<bigint>);
  maxFeePerGas?: bigint | (() => Promise<bigint>);
  maxPriorityFeePerGas?: bigint | (() => Promise<bigint>);
  maxFeePerBlobGas?: bigint | (() => Promise<bigint>);
  nonce?: number | (() => Promise<number>);
  // tw specific
  chain: Chain;
  client: ThirdwebClient;
};

export type PreparedTransaction = Readonly<PrepareTransactionOptions>;

export function prepareTransaction(options: PrepareTransactionOptions) {
  return { ...options } as PreparedTransaction;
}

//utils

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

function isAbiFunction(item: unknown): item is AbiFunction {
  return !!(
    item &&
    typeof item === "object" &&
    "type" in item &&
    item.type === "function"
  );
}

export async function resolveAbiFunction<
  const TAbi extends Abi = [],
  const TMethod extends
    | AbiFunction
    | string
    | ((
        contract: ThirdwebContract<TAbi>,
      ) => Promise<AbiFunction>) = TAbi extends { length: 0 }
    ? AbiFunction | string
    : ExtractAbiFunctionNames<TAbi>,
>({
  contract,
  method,
}: {
  contract: ThirdwebContract<TAbi>;
  method: TMethod;
}): Promise<ParseMethod<TAbi, TMethod>> {
  if (isAbiFunction(method)) {
    return method as ParseMethod<TAbi, TMethod>;
  }
  if (typeof method === "function") {
    return (await method(contract)) as ParseMethod<TAbi, TMethod>;
  }
  // if the method starts with the string `function ` we always will want to try to parse it
  if (method.startsWith("function ")) {
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

  throw new Error(`could not find function with name "${method}" in abi`);
}

export async function encodeTransaction(
  transaction: PreparedTransaction,
): Promise<Hex> {
  if (transaction.data === undefined) {
    return `0x`;
  }
  if (typeof transaction.data === "function") {
    const data = await transaction.data();
    if (data === undefined) {
      throw new Error("Data is required for transaction");
    }

    return data;
  }
  return transaction.data;
}

export async function resolvePossiblyAsyncValue<V>(
  value: V,
): Promise<V extends () => Promise<infer R> ? R : V> {
  return typeof value === "function" ? await value() : value;
}
