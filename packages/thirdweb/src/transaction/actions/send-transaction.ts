import type { AbiFunction } from "abitype";
import type { Transaction } from "../transaction.js";
import type { Hash, TransactionSerializable } from "viem";
import type { IWallet } from "../../wallets/interfaces/wallet.js";

export async function sendTransaction<
  const abiFn extends AbiFunction,
  wallet extends IWallet<any>,
>(tx: Transaction<abiFn>, wallet: wallet): Promise<Hash> {
  if (!wallet.address) {
    throw new Error("not connected");
  }
  const { getRpcClient } = await import("../../rpc/index.js");
  const rpcRequest = getRpcClient(tx.contract, {
    chainId: tx.contract.chainId,
  });

  const [getDefaultGasOverrides, encode, transactionCount, estimateGas] =
    await Promise.all([
      import("../../gas/fee-data.js").then((m) => m.getDefaultGasOverrides),
      import("./encode.js").then((m) => m.encode),
      import("../../rpc/methods.js").then((m) => m.transactionCount),
      import("./estimate-gas.js").then((m) => m.estimateGas),
    ]);

  const [gasOverrides, encodedData, nextNonce, estimatedGas] =
    await Promise.all([
      getDefaultGasOverrides(tx.contract, tx.contract.chainId),
      encode(tx),
      transactionCount(rpcRequest, wallet.address),
      estimateGas(tx, { from: wallet.address }),
    ]);

  return wallet.sendTransaction({
    chainId: tx.contract.chainId,
    data: encodedData,
    gas: estimatedGas,
    ...gasOverrides,
    nonce: nextNonce,
  } satisfies TransactionSerializable);
}
