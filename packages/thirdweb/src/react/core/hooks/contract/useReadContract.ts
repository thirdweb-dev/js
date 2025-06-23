import {
  queryOptions as defineQuery,
  type UseQueryResult,
  useQuery,
} from "@tanstack/react-query";
import type { Abi, AbiFunction, ExtractAbiFunctionNames } from "abitype";
import type {
  AbiOfLength,
  AsyncGetAbiFunctionFromContract,
} from "../../../../contract/types.js";
import type { Extension } from "../../../../extensions/types.js";
import {
  type ReadContractOptions,
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
import type {
  PickedOnceQueryOptions,
  WithPickedOnceQueryOptions,
} from "../types.js";

/**
 * A hook to read state from a contract that automatically updates when the contract changes.
 *
 * You can use raw read calls or read [extensions](https://portal.thirdweb.com/react/v5/extensions) to read from a
 * contract.
 *
 * @param options - The options for reading from a contract
 * @returns a UseQueryResult object.
 * @example
 * ```jsx
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
 *   method: "function tokenURI(uint256 tokenId) returns (string)"
 *   params: [1n],
 * });
 * ```
 * @contract
 */
export function useReadContract<
  const TAbi extends Abi,
  const TMethod extends TAbi extends AbiOfLength<0>
    ? AbiFunction | string
    : ExtractAbiFunctionNames<TAbi>,
>(
  options: WithPickedOnceQueryOptions<ReadContractOptions<TAbi, TMethod>>,
): UseQueryResult<
  ReadContractResult<PreparedMethod<ParseMethod<TAbi, TMethod>>[2]>
>;
/**
 * A hook to read state from a contract that automatically updates when the contract changes.
 * You can use raw read calls or read [extensions](https://portal.thirdweb.com/react/v5/extensions) to read from a
 * contract.
 *
 * @param extension - An extension to call.
 * @param options - The read extension params.
 * @returns a UseQueryResult object.
 * @example
 *
 * Read a contract extension let you do complex contract queries with less code.
 *
 * ```jsx
 * import { useReadContract } from "thirdweb/react";
 * import { getOwnedNFTs } form "thirdweb/extensions/erc721";
 *
 * const { data, isLoading } = useReadContract(getOwnedNFTs, { contract, owner: address });
 * ```
 */
export function useReadContract<
  const TAbi extends Abi,
  const TParams extends object,
  TResult,
>(
  extension: Extension<TAbi, TParams, TResult>,
  options: WithPickedOnceQueryOptions<BaseTransactionOptions<TParams, TAbi>>,
): UseQueryResult<TResult>;

export function useReadContract<
  const TAbi extends Abi,
  const TMethod extends TAbi extends AbiOfLength<0>
    ? AbiFunction | `function ${string}` | AsyncGetAbiFunctionFromContract<TAbi>
    : ExtractAbiFunctionNames<TAbi>,
  const TParams extends object,
  TResult,
>(
  extensionOrOptions:
    | Extension<TAbi, TParams, TResult>
    | WithPickedOnceQueryOptions<ReadContractOptions<TAbi, TMethod>>,
  options?: WithPickedOnceQueryOptions<BaseTransactionOptions<TParams, TAbi>>,
) {
  type QueryKey = readonly [
    "readContract",
    number | string,
    string,
    string | PreparedMethod<ParseMethod<TAbi, TMethod>>,
    string,
  ];
  type QueryFn = () => Promise<
    TResult | ReadContractResult<PreparedMethod<ParseMethod<TAbi, TMethod>>[2]>
  >;

  let queryKey: QueryKey | undefined;
  let queryFn: QueryFn | undefined;
  let queryOpts: PickedOnceQueryOptions | undefined;

  // extension case
  if (typeof extensionOrOptions === "function") {
    if (!options) {
      throw new Error(
        `Missing second argument for "useReadContract(<extension>, <options>)" hook.`,
      ) as never;
    }
    const { queryOptions, contract, ...params } = options;
    queryOpts = queryOptions;

    queryKey = [
      "readContract",
      contract.chain.id,
      contract.address,
      getFunctionId(extensionOrOptions),
      stringify(params),
    ] as const;

    queryFn = () =>
      extensionOrOptions({
        ...(params as TParams),
        contract,
      });
  }
  // raw tx case
  if ("method" in extensionOrOptions) {
    const { queryOptions, ...tx } = extensionOrOptions;
    queryOpts = queryOptions;

    queryKey = [
      "readContract",
      tx.contract.chain.id,
      tx.contract.address,
      tx.method,
      stringify(tx.params),
    ] as const;

    queryFn = () => readContract(extensionOrOptions);
  }

  if (!queryKey || !queryFn) {
    throw new Error(
      `Invalid "useReadContract" options. Expected either a read extension or a transaction object.`,
    ) as never;
  }

  return useQuery(
    defineQuery({
      queryFn: queryFn as QueryFn,
      queryKey: queryKey as QueryKey,
      ...(queryOpts ?? {}),
    }),
  );
}
