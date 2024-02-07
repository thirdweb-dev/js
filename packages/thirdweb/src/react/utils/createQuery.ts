import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import type { TxOpts } from "../../transaction/transaction.js";
import type { Abi } from "abitype";
import { getChainIdFromChain } from "../../chain/index.js";
import { getFunctionId } from "../../utils/function-id.js";
import { stringify } from "../../utils/json.js";

const CONTRACT_QUERY_CACHE = new WeakMap();

/**
 * Creates a `useQuery` hook fot a contract call.
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
  readCall: (options: TxOpts<opts, abi>) => Promise<result>,
): (
  options: TxOpts<opts, abi> & { queryOptions?: Partial<{ enabled: boolean }> },
) => UseQueryResult<result, Error> {
  if (CONTRACT_QUERY_CACHE.has(readCall)) {
    return CONTRACT_QUERY_CACHE.get(readCall) as (
      options: TxOpts<opts, abi>,
    ) => UseQueryResult<result, Error>;
  }
  function useRead(
    options: TxOpts<opts, abi> & {
      queryOptions?: Partial<{ enabled: boolean }>;
    },
  ) {
    const { contract, queryOptions, ...params } = options;
    const chainId = getChainIdFromChain(contract.chain).toString();

    return useQuery({
      queryKey: [
        "readContract",
        chainId,
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
