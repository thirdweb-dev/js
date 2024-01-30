import type { AbiFunction } from "abitype";
import type { Transaction } from "../transaction.js";
import type { Hash, TransactionSerializable } from "viem";
import type { IWallet } from "../../wallets/interfaces/wallet.js";

/**
 * Sends a transaction using the provided transaction object and wallet.
 * @param tx - The transaction object.
 * @param wallet - The wallet object.
 * @returns A promise that resolves to the transaction hash.
 * @throws If the wallet is not connected.
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb/transaction";
 * const txHash = await sendTransaction(tx, wallet);
 * ```
 */
export async function sendTransaction<
  const abiFn extends AbiFunction,
  wallet extends IWallet,
>(tx: Transaction<abiFn>, wallet: wallet): Promise<Hash> {
  if (!wallet.address) {
    throw new Error("not connected");
  }
  const { getRpcClient } = await import("../../rpc/index.js");
  const rpcRequest = getRpcClient(tx.contract);

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
      getDefaultGasOverrides(tx.contract.client, tx.contract.chainId),
      encode(tx),
      eth_getTransactionCount(rpcRequest, {
        address: wallet.address,
        blockTag: "pending",
      }),
      estimateGas(tx, { from: wallet.address }),
    ]);

  return wallet.sendTransaction({
    to: tx.contract.address,
    chainId: tx.contract.chainId,
    data: encodedData,
    gas: estimatedGas,
    ...gasOverrides,
    nonce: nextNonce,
  } satisfies TransactionSerializable);
}
