import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import type { Abi, AbiFunction, ExtractAbiFunctionNames } from "abitype";
import type { ParseMethod } from "../../abi/types.js";
import type { ReadOutputs } from "../../transaction/actions/read.js";
import { read } from "../../transaction/index.js";
import type {
  TransactionInput,
  TxOpts,
} from "../../transaction/transaction.js";

export function useRead<
  abi extends Abi,
  method extends abi extends { length: 0 }
    ? AbiFunction | string
    : ExtractAbiFunctionNames<abi>,
>(
  opts: TransactionInput<abi, method>,
): UseQueryResult<ReadOutputs<ParseMethod<abi, method>>, Error>;
export function useRead<params extends object, result>(
  fn: (arg_0: TxOpts<params>) => Promise<result>,
  opts: TxOpts<params>,
): UseQueryResult<result, Error>;
export function useRead<
  abi extends Abi,
  method extends abi extends { length: 0 }
    ? AbiFunction | string
    : ExtractAbiFunctionNames<abi>,
  params extends object,
  result,
>(
  txInputOrFn:
    | TransactionInput<abi, method>
    | ((arg_0: TxOpts<params>) => Promise<result>),
  fnOpts?: TxOpts<params>,
) {
  let queryKey;
  let queryFn: () => any;
  if (typeof txInputOrFn === "function") {
    // treat as extension
    const fn = txInputOrFn as (arg_0: TxOpts<params>) => Promise<result>;
    const opts = fnOpts as TxOpts<params>;
    const { contract: contract_, ...rest } = opts;
    // TODO probably needs better identifier than `fn.name`?
    queryKey = [contract_.chainId, contract_.address, fn.name, rest] as const;
    queryFn = async () => fn(opts);
  } else {
    // treat as direct call
    const opts = txInputOrFn as TransactionInput<abi, method>;
    const { contract: contract_, ...rest } = opts;
    queryKey = [contract_.chainId, contract_.address, rest] as const;
    queryFn = async () => read(opts);
  }

  // actually define the query
  return useQuery({
    queryKey,
    queryFn,
  });
}
