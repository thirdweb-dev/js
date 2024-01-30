import type { Transaction } from "../transaction.js";
import type { Abi, AbiFunction, TransactionSerializable } from "viem";
import type { Wallet } from "../../wallets/interfaces/wallet.js";
import type { WaitForReceiptOptions } from "./wait-for-tx-receipt.js";

type SendTransactionOptions<
  abiFn extends AbiFunction,
  wallet extends Wallet,
> = {
  transaction: Transaction<abiFn>;
  wallet: wallet;
};

/**
 * Sends a transaction using the provided wallet.
 * @param options - The options for sending the transaction.
 * @returns A promise that resolves to the transaction hash.
 * @throws An error if the wallet is not connected.
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * const transactionHash = await sendTransaction({
 *  wallet,
 *  transaction
 * });
 * ```
 */
export async function sendTransaction<
  abiFn extends AbiFunction,
  wallet extends Wallet,
>(
  options: SendTransactionOptions<abiFn, wallet>,
): Promise<WaitForReceiptOptions<Abi>> {
  if (!options.wallet.address) {
    throw new Error("not connected");
  }
  const { getRpcClient } = await import("../../rpc/index.js");
  const rpcRequest = getRpcClient(options.transaction.contract);

  const [getDefaultGasOverrides, encode, eth_getTransactionCount, estimateGas] =
    await Promise.all([
      import("../../gas/fee-data.js").then((m) => m.getDefaultGasOverrides),
      import("./encode.js").then((m) => m.encode),
      import("../../rpc/actions/eth_getTransactionCount.js").then(
        (m) => m.eth_getTransactionCount,
      ),
      import("./estimate-gas.js").then((m) => m.estimateGas),
    ]);

  const [gasOverrides, encodedData, nextNonce, estimatedGas] =
    await Promise.all([
      getDefaultGasOverrides(
        options.transaction.contract.client,
        options.transaction.contract.chainId,
      ),
      encode(options.transaction),
      eth_getTransactionCount(rpcRequest, {
        address: options.wallet.address,
        blockTag: "pending",
      }),
      estimateGas({ transaction: options.transaction, wallet: options.wallet }),
    ]);

  const result = await options.wallet.sendTransaction({
    to: options.transaction.contract.address,
    chainId: options.transaction.contract.chainId,
    data: encodedData,
    gas: estimatedGas,
    ...gasOverrides,
    nonce: nextNonce,
  } satisfies TransactionSerializable);
  return { ...result, contract: options.transaction.contract };
}
