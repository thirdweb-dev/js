import type { AbiFunction, Address } from "abitype";
import type { Transaction } from "../index.js";
import { getDefaultGasOverrides } from "../../gas/fee-data.js";
import { encode } from "./encode.js";
import { formatTransactionRequest, hexToBigInt } from "viem/utils";
import type { IWallet } from "../../wallets/interfaces/wallet.js";

export async function estimateGas<
  const abiFn extends AbiFunction,
  const wallet extends IWallet,
>(tx: Transaction<abiFn>, wallet?: wallet) {
  const rpcRequest = tx.client.rpc({ chainId: tx.inputs.chainId });

  const [gasOverrides, encodedData] = await Promise.all([
    getDefaultGasOverrides(tx.client, tx.inputs.chainId),
    encode(tx),
  ]);

  // format the tx request
  const data = formatTransactionRequest({
    to: tx.inputs.address as Address,
    data: encodedData,
    ...gasOverrides,
    from: (wallet?.address ?? undefined) as Address,
  });

  // make the call
  // TODO: move into rpc/methods
  const { result } = await rpcRequest({
    method: "eth_estimateGas",
    params: [data],
  });

  return hexToBigInt(result);
}
