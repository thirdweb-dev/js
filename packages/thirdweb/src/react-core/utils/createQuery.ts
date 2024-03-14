import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import type { Abi } from "abitype";
import { getFunctionId } from "../../utils/function-id.js";
import { stringify } from "../../utils/json.js";
import type { BaseTransactionOptions } from "../../transaction/types.js";

const CONTRACT_QUERY_CACHE = new WeakMap();

/**
 * Creates a `useQuery` hook for a contract call.
 * @param readCall - A function that performs the contract function call and returns the result.
 * @returns An object containing the created `useRead` hook.
 * @example
 * ```jsx
 * import { createContractQuery } from "thirdweb/react";
 * import { totalSupply } from "thirdweb/extensions/erc20";
 * const useTotalSupply = createContractQuery(totalSupply);
 * const { data, isLoading } = useTotalSupply({contract})
 * ```
 */
export function createContractQuery<
  opts extends object,
  result,
  abi extends Abi,
>(
  readCall: (options: BaseTransactionOptions<opts, abi>) => Promise<result>,
): (
  options: BaseTransactionOptions<opts, abi> & {
    queryOptions?: Partial<{ enabled: boolean }>;
  },
) => UseQueryResult<result, Error> {
  if (CONTRACT_QUERY_CACHE.has(readCall)) {
    return CONTRACT_QUERY_CACHE.get(readCall) as (
      options: BaseTransactionOptions<opts, abi>,
    ) => UseQueryResult<result, Error>;
  }
  function useRead(
    options: BaseTransactionOptions<opts, abi> & {
      queryOptions?: Partial<{ enabled: boolean }>;
    },
  ) {
    const { contract, queryOptions, ...params } = options;

    return useQuery({
      queryKey: [
        "readContract",
        contract.chain.id,
        contract.address,
        getFunctionId(readCall),
        stringify(params),
      ] as const,
      queryFn: () => readCall(options),
      ...queryOptions,
    });
  }
  CONTRACT_QUERY_CACHE.set(readCall, useRead);
  return useRead;
}
