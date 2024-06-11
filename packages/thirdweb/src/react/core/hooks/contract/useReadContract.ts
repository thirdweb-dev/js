import {
  type UseQueryOptions,
  type UseQueryResult,
  queryOptions as defineQuery,
  useQuery,
} from "@tanstack/react-query";
import type { Abi, AbiFunction, ExtractAbiFunctionNames } from "abitype";
import type { ThirdwebContract } from "../../../../contract/contract.js";
import type { PrepareContractCallOptions } from "../../../../transaction/prepare-contract-call.js";
import {
  type ReadContractResult,
  readContract,
} from "../../../../transaction/read-contract.js";
import type {
  BaseTransactionOptions,
  ParseMethod,
} from "../../../../transaction/types.js";
import type { PreparedMethod } from "../../../../utils/abi/prepare-method.js";
import { getFunctionId } from "../../../../utils/function-id.js";
import { stringify } from "../../../../utils/json.js";
import type { Prettify } from "../../../../utils/type-utils.js";

type PickedQueryOptions = Prettify<
  Pick<UseQueryOptions, "enabled"> & {
    refetchInterval?: number;
    retry?: number;
  }
>;

/**
 * A hook to read from a contract.
 * @param options - The options for reading from a contract
 * @returns a query object.
 * @example
 * ```jsx
 * import { useReadContract } from "thirdweb/react";
 * const { data, isLoading } = useReadContract({contract, method: "totalSupply"});
 * ```
 * @contract
 */
export function useReadContract<
  const abi extends Abi,
  const method extends abi extends { length: 0 }
    ? AbiFunction | string
    : ExtractAbiFunctionNames<abi>,
>(
  options: PrepareContractCallOptions<abi, method> & {
    queryOptions?: PickedQueryOptions;
  },
): UseQueryResult<
  ReadContractResult<PreparedMethod<ParseMethod<abi, method>>[2]>
>;
/**
 * A hook to read from a contract.
 * @param extension - An extension to call.
 * @param options - The read extension params.
 * @returns a query object.
 * @example
 * ```jsx
 * import { useReadContract } from "thirdweb/react";
 * import { getOwnedNFTs } form "thirdweb/extensions/erc721"
 * const { data, isLoading } = useReadContract(getOwnedNFTs, { contract, owner: address });
 * ```
 */
export function useReadContract<
  const abi extends Abi,
  const params extends object,
  result,
>(
  extension: (options: BaseTransactionOptions<params, abi>) => Promise<result>,
  options: BaseTransactionOptions<params, abi> & {
    queryOptions?: PickedQueryOptions;
  },
): UseQueryResult<result>;

export function useReadContract<
  const abi extends Abi,
  const method extends abi extends {
    length: 0;
  }
    ?
        | AbiFunction
        | `function ${string}`
        | ((contract: ThirdwebContract<abi>) => Promise<AbiFunction>)
    : ExtractAbiFunctionNames<abi>,
  const params extends object,
  result,
>(
  extensionOrOptions:
    | ((options: BaseTransactionOptions<params, abi>) => Promise<result>)
    | (PrepareContractCallOptions<abi, method> & {
        queryOptions?: PickedQueryOptions;
      }),
  options?: BaseTransactionOptions<params, abi> & {
    queryOptions?: PickedQueryOptions;
  },
) {
  // extension case
  if (typeof extensionOrOptions === "function") {
    if (!options) {
      throw new Error(
        `Missing second argument for "useReadContract(<extension>, <options>)" hook.`,
      ) as never;
    }
    const { queryOptions, contract, ...params } = options;

    const query = defineQuery({
      queryKey: [
        "readContract",
        contract.chain.id,
        contract.address,
        getFunctionId(extensionOrOptions),
        stringify(params),
      ] as const,
      // @ts-expect-error - TODO: clean up the type issues here
      queryFn: () => extensionOrOptions({ ...params, contract }),
      ...queryOptions,
    });

    return useQuery(query);
  }
  // raw tx case
  if ("method" in extensionOrOptions) {
    const { queryOptions, ...tx } = extensionOrOptions;

    const query = defineQuery({
      queryKey: [
        "readContract",
        tx.contract.chain.id,
        tx.contract.address,
        tx.method,
        stringify(tx.params),
      ] as const,
      queryFn: () => readContract(extensionOrOptions),
      ...queryOptions,
    });

    return useQuery(query);
  }

  throw new Error(
    `Invalid "useReadContract" options. Expected either a read extension or a transaction object.`,
  ) as never;
}
