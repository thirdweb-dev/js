import type { AbiFunction, Address } from "abitype";
import type { Transaction } from "../index.js";
import type { IWallet } from "../../wallets/utils/wallet.js";
import { getDefaultGasOverrides } from "../../gas/fee-data.js";
import { encode } from "./encode.js";
import { estimateGas } from "./estimate-gas.js";
import { transactionCount } from "../../rpc/methods.js";
import type { Hash } from "viem";

export async function execute<
  const abiFn extends AbiFunction,
  const wallet extends IWallet,
>(tx: Transaction<abiFn>, wallet: wallet) {
  if (!wallet || !wallet.address) {
    throw new Error("no wallet to sign with");
  }
  const rpcRequest = tx.client.rpc({ chainId: tx.inputs.chainId });

  const [gasOverrides, encodedData, nextNonce, estimatedGas] =
    await Promise.all([
      getDefaultGasOverrides(tx.client, tx.inputs.chainId),
      encode(tx),
      transactionCount(rpcRequest, wallet.address),
      estimateGas(tx, wallet),
    ]);

  const signedTx = await wallet.signTransaction({
    gas: estimatedGas,
    to: tx.inputs.address as Address,
    chainId: tx.inputs.chainId,
    data: encodedData,
    nonce: nextNonce,
    ...gasOverrides,
  });

  // send the tx
  // TODO: move into rpc/methods
  const { result } = await rpcRequest({
    method: "eth_sendRawTransaction",
    params: [signedTx],
  });

  tx.transactionHash = result as Hash;

  return {
    transactionHash: result as Hash,
    wait: async () => {
      const { waitForTxReceipt } = await import("./wait-for-tx-receipt.js");
      return waitForTxReceipt(tx);
    },
  };
}
