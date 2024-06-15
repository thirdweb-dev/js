import {
  type UseQueryOptions,
  type UseQueryResult,
  useQuery,
} from "@tanstack/react-query";
import type { Abi } from "viem";
import { toSerializableTransaction } from "../../../../transaction/actions/to-serializable-transaction.js";
import {
  type PrepareContractCallOptions,
  prepareContractCall,
} from "../../../../transaction/prepare-contract-call.js";
import {
  type PrepareTransactionOptions,
  type PreparedTransaction,
  prepareTransaction,
} from "../../../../transaction/prepare-transaction.js";
import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import type { Address } from "../../../../utils/address.js";
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
 * A hook to prepare a transaction to be sent at a later time.
 * @param extension - An extension to prepare.
 * @param options - The extension params.
 * @returns a query object.
 * @example
 * ```jsx
 * import { usePrepareTransaction, useSendTransaction } from "thirdweb/react";
 * import { mintTo } form "thirdweb/extensions/erc20";
 *
 * const { data: preparedTransaction, isLoading } = usePrepareTransaction(mintTo, { contract, to: address amount: "100" });
 * const { mutate: sendTx, data: transactionResult } = useSendTransaction();
 *
 * // later send the transaction
 * sendTx(preparedTransaction);
 * ```
 */
export function usePrepareTransaction<
  const abi extends Abi,
  const params extends object,
>(
  extension: (
    options: BaseTransactionOptions<params, abi>,
  ) => PreparedTransaction<abi>,
  options: BaseTransactionOptions<params, abi> & {
    from?: Address;
    queryOptions?: PickedQueryOptions;
  },
): UseQueryResult<Awaited<ReturnType<typeof toSerializableTransaction>>>;

/**
 * A hook to prepare a transaction to be sent at a later time.
 * @param contractCallOptions - The contract call params
 * @param options - options.
 * @returns a query object.
 * @example
 * ```jsx
 * import { usePrepareTransaction, useSendTransaction } from "thirdweb/react";
 *
 * const { data: preparedTransaction, isLoading } = usePrepareTransaction({
 *  contract,
 *  method: "function transfer(address to, uint256 value)",
 *  params: [to, value],
 * });
 *
 * const { mutate: sendTx, data: transactionResult } = useSendTransaction();
 *
 * // later send the transaction
 * sendTx(preparedTransaction);
 * ```
 */
export function usePrepareTransaction<const abi extends Abi>(
  // biome-ignore lint/suspicious/noExplicitAny: too complicated to type sorry
  contractCallOptions: PrepareContractCallOptions<abi, any>,
  options?: {
    from?: Address;
    queryOptions?: PickedQueryOptions;
  },
): UseQueryResult<Awaited<ReturnType<typeof toSerializableTransaction>>>;

/**
 * A hook to prepare a transaction to be sent at a later time.
 * @param txOptions - The contract call params
 * @param options - options.
 * @returns a query object.
 * @example
 * ```jsx
 * import { usePrepareTransaction, useSendTransaction } from "thirdweb/react";
 *
 * const { data: preparedTransaction, isLoading } = usePrepareTransaction({
 *  to: "0x1234567890123456789012345678901234567890",
 *  chain: ethereum,
 *  client: thirdwebClient,
 *  value: toWei("1.0"),
 *  gasPrice: 30n
 * });
 *
 * const { mutate: sendTx, data: transactionResult } = useSendTransaction();
 *
 * // later send the transaction
 * sendTx(preparedTransaction);
 * ```
 */
export function usePrepareTransaction(
  txOptions: PrepareTransactionOptions,
  options?: {
    from?: Address;
    queryOptions?: PickedQueryOptions;
  },
): UseQueryResult<Awaited<ReturnType<typeof toSerializableTransaction>>>;

export function usePrepareTransaction<
  const abi extends Abi,
  const params extends object,
>(
  extensionOrTxOptions:
    | ((
        options: BaseTransactionOptions<params, abi>,
      ) => PreparedTransaction<abi>)
    // biome-ignore lint/suspicious/noExplicitAny: too complicated to type sorry
    | PrepareContractCallOptions<abi, any>
    | PrepareTransactionOptions,
  options?: BaseTransactionOptions<params, abi> & {
    from?: Address;
    queryOptions?: PickedQueryOptions;
  },
): UseQueryResult<Awaited<ReturnType<typeof toSerializableTransaction>>> {
  if (typeof extensionOrTxOptions === "function") {
    if (!options) {
      throw new Error(
        `Missing second argument for "useReadContract(<extension>, <options>)" hook.`,
      ) as never;
    }
    const { queryOptions, contract, ...params } = options;
    return useQuery({
      queryKey: [
        "prepare-transaction",
        contract.chain.id,
        contract.address,
        getFunctionId(extensionOrTxOptions),
        stringify(params),
        options.from,
      ],
      queryFn: async () => {
        const preparedTx = extensionOrTxOptions(options);
        return await toSerializableTransaction({
          transaction: preparedTx,
          from: options.from,
        });
      },
    });
  }

  // "prepareContractCall" case
  if ("contract" in extensionOrTxOptions) {
    return useQuery({
      queryKey: [
        "prepare-transaction",
        extensionOrTxOptions.contract.chain.id,
        extensionOrTxOptions.contract.address,
        extensionOrTxOptions.method,
        stringify(extensionOrTxOptions.params),
      ],
      queryFn: async () => {
        const preparedTx = prepareContractCall(extensionOrTxOptions);
        return await toSerializableTransaction({
          transaction: preparedTx,
          from: options?.from,
        });
      },
    });
  }

  // "prepareTransaction" case

  return useQuery({
    queryKey: [
      "prepare-transaction",
      extensionOrTxOptions.chain.id,
      extensionOrTxOptions.to,
      extensionOrTxOptions.data,
      extensionOrTxOptions.value,
    ],
    queryFn: async () => {
      const preparedTx = prepareTransaction(extensionOrTxOptions);
      return await toSerializableTransaction({
        transaction: preparedTx,
        from: options?.from,
      });
    },
  });
}
