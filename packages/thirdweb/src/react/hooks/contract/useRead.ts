import {
  useQuery,
  type UseQueryResult,
  type UseQueryOptions,
} from "@tanstack/react-query";
import type { Abi, AbiFunction, ExtractAbiFunctionNames } from "abitype";
import type { ParseMethod } from "../../../abi/types.js";
import type { ReadOutputs } from "../../../transaction/actions/read.js";
import { readContract } from "../../../transaction/index.js";
import {
  type TransactionOptions,
  type TxOpts,
} from "../../../transaction/transaction.js";
import { stringify } from "../../../utils/json.js";
import { getFunctionId } from "../../../utils/function-id.js";

type PickedQueryOptions = Pick<UseQueryOptions, "enabled">;

/**
 * A hook to read from a contract.
 * @param options - The options for reading from a contract
 * @returns a query object.
 * @example
 * ```jsx
 * import { useRead } from "thirdweb/react";
 * const { data, isLoading } = useRead({contract, method: "totalSupply"});
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
 * import { useRead } from "thirdweb/react";
 * import { totalSupply } form "thirdweb/extensions/erc20"
 * const { data, isLoading } = useRead(totalSupply);
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
  // extension case (or really any async function!)
  if (typeof extensionOrOptions === "function") {
    if (!options) {
      throw new Error(
        `Missing second argument for "useRead(<extension>, <options>)" hook.`,
      ) as never;
    }
    const { queryOptions, contract, ...params } = options;
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useQuery({
      // eslint-disable-next-line @tanstack/query/exhaustive-deps
      queryKey: [
        contract.chainId,
        contract.address,
        "read",
        getFunctionId(extensionOrOptions),
        stringify(params),
      ] as const,
      // @ts-expect-error - TODO: clean up the type issues here
      queryFn: () => extensionOrOptions({ ...params, contract }),
      ...queryOptions,
    });
  }
  // raw tx case
  if ("method" in extensionOrOptions) {
    const { queryOptions, ...tx } = extensionOrOptions;

    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useQuery({
      // eslint-disable-next-line @tanstack/query/exhaustive-deps
      queryKey: [
        tx.contract.chainId,
        tx.contract.address,
        "read",
        tx.method,
        stringify(tx.params),
      ] as const,
      queryFn: () => readContract(extensionOrOptions),
      ...queryOptions,
    });
  }

  throw new Error(
    `Invalid "useRead" options. Expected either a read extension or a transaction object.`,
  ) as never;
}
