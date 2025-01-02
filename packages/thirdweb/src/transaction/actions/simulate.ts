import type { Abi, AbiFunction } from "abitype";
import { decodeAbiParameters, formatTransactionRequest } from "viem";
import { eth_call } from "../../rpc/actions/eth_call.js";
import { getRpcClient } from "../../rpc/rpc.js";
import type { PreparedMethod } from "../../utils/abi/prepare-method.js";
import { resolvePromisedValue } from "../../utils/promise/resolve-promised-value.js";
import type { Prettify } from "../../utils/type-utils.js";
import type { Account } from "../../wallets/interfaces/wallet.js";
import { extractError } from "../extract-error.js";
import type { PreparedTransaction } from "../prepare-transaction.js";
import type { ReadContractResult } from "../read-contract.js";
import { encode } from "./encode.js";

export type SimulateOptions<
  abi extends Abi,
  abiFn extends AbiFunction,
> = Prettify<
  {
    transaction: PreparedTransaction<abi, abiFn>;
  } & (
    | {
        account: Account;
        from?: never;
      }
    | {
        account?: never;
        from?: string;
      }
  )
>;

/**
 * Simulates the execution of a transaction.
 * @param options - The options for simulating the transaction.
 * @returns A promise that resolves to the result of the simulation.
 * @transaction
 * @example
 * ```ts
 * import { simulateTransaction } from "thirdweb";
 * const result = await simulateTransaction({
 *  transaction,
 * });
 * ```
 */
export async function simulateTransaction<
  const abi extends Abi,
  const abiFn extends AbiFunction,
>(options: SimulateOptions<abi, abiFn>) {
  const [data, to, accessList, value] = await Promise.all([
    encode(options.transaction),
    resolvePromisedValue(options.transaction.to),
    resolvePromisedValue(options.transaction.accessList),
    resolvePromisedValue(options.transaction.value),
  ]);

  // from is:
  // 1. the user specified from address
  // 2. the passed in account address
  // 3. the passed in wallet's account address
  const from = options.from ?? options.account?.address ?? undefined;

  const serializedTx = formatTransactionRequest({
    data,
    from,
    to,
    value,
    accessList,
  });

  const rpcRequest = getRpcClient(options.transaction);
  try {
    const result = await eth_call(rpcRequest, serializedTx);

    if (!options.transaction.__preparedMethod) {
      return result;
    }

    const prepared = await options.transaction.__preparedMethod();

    const decoded = decodeAbiParameters(prepared[2], result);

    if (Array.isArray(decoded) && decoded.length === 1) {
      return decoded[0];
    }

    return decoded as ReadContractResult<PreparedMethod<abiFn>[2]>;
  } catch (error) {
    throw await extractError({
      error,
      contract: options.transaction.__contract,
    });
  }
}
