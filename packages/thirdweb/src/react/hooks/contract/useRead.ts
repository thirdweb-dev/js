import {
  useQuery,
  type UseQueryResult,
  type UseQueryOptions,
} from "@tanstack/react-query";
import type { Abi, AbiFunction, ExtractAbiFunctionNames } from "abitype";
import type { ParseMethod } from "../../../abi/types.js";
import type { ReadOutputs } from "../../../transaction/actions/read.js";
import { read } from "../../../transaction/index.js";
import {
  type TransactionInput,
  type TxOpts,
} from "../../../transaction/transaction.js";
import {
  getExtensionId,
  isReadExtension,
  type ReadExtension,
} from "../../../utils/extension.js";
import { stringify } from "../../../utils/json.js";

type PickedQueryOptions = Pick<UseQueryOptions, "enabled">;

export function useRead<
  const abi extends Abi,
  const method extends abi extends { length: 0 }
    ? AbiFunction | string
    : ExtractAbiFunctionNames<abi>,
>(
  options: TransactionInput<abi, method> & {
    queryOptions?: PickedQueryOptions;
  },
): UseQueryResult<ReadOutputs<ParseMethod<abi, method>>>;
export function useRead<
  const abi extends Abi,
  const params extends object,
  result,
  extension_id extends string,
>(
  extension: ReadExtension<params, result, extension_id>,
  options: TxOpts<params, abi> & {
    queryOptions?: PickedQueryOptions;
  },
): UseQueryResult<result>;
export function useRead<
  const abi extends Abi,
  const method extends abi extends { length: 0 }
    ? AbiFunction | string
    : ExtractAbiFunctionNames<abi>,
  const params extends object,
  result,
  extension_id extends string,
>(
  extensionOrOptions:
    | ReadExtension<params, result, extension_id>
    | (TransactionInput<abi, method> & {
        queryOptions?: PickedQueryOptions;
      }),
  options?: TxOpts<params, abi> & {
    queryOptions?: PickedQueryOptions;
  },
) {
  // extension case
  if (isReadExtension(extensionOrOptions)) {
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
        getExtensionId(extensionOrOptions),
        stringify(params),
      ] as const,
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
        tx.method,
        stringify(tx.params),
      ] as const,
      queryFn: () => read(extensionOrOptions),
      ...queryOptions,
    });
  }

  throw new Error(
    `Invalid "useRead" options. Expected either a read extension or a transaction object.`,
  ) as never;
}
