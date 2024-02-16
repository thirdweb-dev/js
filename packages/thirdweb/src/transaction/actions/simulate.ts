import { formatTransactionRequest } from "viem";
import type { Account } from "../../wallets/interfaces/wallet.js";
import { resolvePromisedValue } from "../../utils/promise/resolve-promised-value.js";
import type { PreparedTransaction } from "../prepare-transaction.js";
import { eth_call } from "../../rpc/index.js";
import type { Abi, AbiFunction } from "abitype";
import type { ReadContractResult } from "../read-contract.js";
import { decodeFunctionResult } from "../../abi/decode.js";
import { extractError } from "../extract-error.js";

export type SimulateOptions<abi extends Abi, abiFn extends AbiFunction> = {
  transaction: PreparedTransaction<abi, abiFn>;
  account?: Partial<Account> | undefined;
};

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
  const { getRpcClient } = await import("../../rpc/index.js");
  const rpcRequest = getRpcClient(options.transaction);

  const [encode] = await Promise.all([
    import("./encode.js").then((m) => m.encode),
  ]);

  const [data, to, accessList, value] = await Promise.all([
    encode(options.transaction),
    resolvePromisedValue(options.transaction.to),
    resolvePromisedValue(options.transaction.accessList),
    resolvePromisedValue(options.transaction.value),
  ]);

  const serializedTx = formatTransactionRequest({
    data,
    from: options.account?.address,
    to,
    value,
    accessList,
  });

  try {
    const result = await eth_call(rpcRequest, serializedTx);

    if (!options.transaction.__abi) {
      return result;
    }

    const abiFnResolved = await options.transaction.__abi();

    const decoded = decodeFunctionResult(abiFnResolved, result);

    if (Array.isArray(decoded) && decoded.length === 1) {
      return decoded[0];
    }

    return decoded as ReadContractResult<abiFn>;
  } catch (error) {
    throw await extractError({
      error,
      contract: options.transaction.__contract,
    });
  }
}
