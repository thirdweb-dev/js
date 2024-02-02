/* eslint-disable better-tree-shaking/no-top-level-side-effects */
import {
  useQuery,
  queryOptions as defineQuery,
  type UseQueryResult,
  type UseQueryOptions,
} from "@tanstack/react-query";
import type { Abi, AbiFunction, ExtractAbiFunctionNames } from "abitype";
import type {
  TransactionOptions,
  TxOpts,
} from "../../../transaction/transaction.js";
import {
  readContract,
  type ReadOutputs,
} from "../../../transaction/actions/read.js";
import type { ParseMethod } from "../../../abi/types.js";
import { getChainIdFromChain } from "../../../chain/index.js";
import { getFunctionId } from "../../../utils/function-id.js";
import { stringify } from "../../../utils/json.js";

type PickedQueryOptions = Pick<UseQueryOptions, "enabled">;

/**
 * A hook to read from a contract.
 * @param options - The options for reading from a contract
 * @returns a query object.
 * @example
 * ```jsx
 * import { useContractRead } from "thirdweb/react";
 * const { data, isLoading } = useContractRead({contract, method: "totalSupply"});
 * ```
 */
export function useContractRead<
  const abi extends Abi,
  const method extends abi extends { length: 0 }
    ? AbiFunction | string
    : ExtractAbiFunctionNames<abi>,
>(
  options: TransactionOptions<abi, method> & {
    queryOptions?: PickedQueryOptions;
  },
): UseQueryResult<ReadOutputs<ParseMethod<abi, method>>>;
/**
 * A hook to read from a contract.
 * @param extension - An extension to call.
 * @param options - The read extension params.
 * @returns a query object.
 * @example
 * ```jsx
 * import { useContractRead } from "thirdweb/react";
 * import { totalSupply } form "thirdweb/extensions/erc20"
 * const { data, isLoading } = useContractRead(totalSupply);
 * ```
 */
export function useContractRead<
  const abi extends Abi,
  const params extends object,
  result,
>(
  extension: (options: TxOpts<params, abi>) => Promise<result>,
  options: TxOpts<params, abi> & {
    queryOptions?: PickedQueryOptions;
  },
): UseQueryResult<result>;
// eslint-disable-next-line jsdoc/require-jsdoc
export function useContractRead<
  const abi extends Abi,
  const method extends abi extends { length: 0 }
    ? AbiFunction | string
    : ExtractAbiFunctionNames<abi>,
  const params extends object,
  result,
>(
  extensionOrOptions:
    | ((options: TxOpts<params, abi>) => Promise<result>)
    | (TransactionOptions<abi, method> & {
        queryOptions?: PickedQueryOptions;
      }),
  options?: TxOpts<params, abi> & {
    queryOptions?: PickedQueryOptions;
  },
) {
  // extension case
  if (typeof extensionOrOptions === "function") {
    if (!options) {
      throw new Error(
        `Missing second argument for "useContractRead(<extension>, <options>)" hook.`,
      ) as never;
    }
    const { queryOptions, contract, ...params } = options;
    const chainId = getChainIdFromChain(contract.chain).toString();

    const query = defineQuery({
      queryKey: [
        "readContract",
        chainId,
        contract.address,
        getFunctionId(extensionOrOptions),
        stringify(params),
      ] as const,
      // @ts-expect-error - TODO: clean up the type issues here
      queryFn: () => extensionOrOptions({ ...params, contract }),
      ...queryOptions,
    });

    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useQuery(query);
  }
  // raw tx case
  if ("method" in extensionOrOptions) {
    const { queryOptions, ...tx } = extensionOrOptions;
    const chainId = getChainIdFromChain(tx.contract.chain).toString();

    const query = defineQuery({
      // eslint-disable-next-line @tanstack/query/exhaustive-deps
      queryKey: [
        "readContract",
        chainId,
        tx.contract.address,
        tx.method,
        stringify(tx.params),
      ] as const,
      queryFn: () => readContract(extensionOrOptions),
      ...queryOptions,
    });
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useQuery(query);
  }

  throw new Error(
    `Invalid "useContractRead" options. Expected either a read extension or a transaction object.`,
  ) as never;
}

const READ_HOOK_CACHE = new WeakMap();

/**
 * Creates a hook for reading data from a smart contract.
 * @param extension - A function that performs the contract function call and returns the result.
 * @returns An object containing the created `useRead` hook.
 * @example
 * ```jsx
 * import { createReadHook } from "thirdweb/react";
 * import { totalSupply } from "thirdweb/extensions/erc20";
 * const { data, isLoading } = createReadHook(totalSupply).useRead({ contract });
 * ```
 */
export function createReadHook<opts extends object, result, abi extends Abi>(
  extension: (options: TxOpts<opts, abi>) => Promise<result>,
) {
  if (READ_HOOK_CACHE.has(extension)) {
    return READ_HOOK_CACHE.get(extension) as {
      useRead: (options: TxOpts<opts, abi>) => UseQueryResult<result, Error>;
    };
  }
  const hooks = {
    useRead: (options: TxOpts<opts, abi>) => {
      const { contract, ...params } = options;
      const chainId = getChainIdFromChain(contract.chain).toString();

      const query = defineQuery({
        queryKey: [
          "readContract",
          chainId,
          contract.address,
          getFunctionId(extension),
          stringify(params),
        ] as const,
        queryFn: () => extension(options),
        enabled: !!options.contract.chain,
      });
      return useQuery(query);
    },
  };
  READ_HOOK_CACHE.set(extension, hooks);
  return hooks;
}
