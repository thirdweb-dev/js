import type { AbiFunction } from "abitype";
import type { Transaction } from "../transaction.js";
import { getDefaultGasOverrides } from "../../gas/fee-data.js";
import { encode } from "./encode.js";
import { formatTransactionRequest } from "viem/utils";
import type { Address } from "viem";
import { getRpcClient, eth_estimateGas } from "../../rpc/index.js";

export async function estimateGas<const abiFn extends AbiFunction>(
  tx: Transaction<abiFn>,
  options?: { from?: string },
): Promise<bigint> {
  const rpcRequest = getRpcClient(tx.contract.client, {
    chainId: tx.contract.chainId,
  });

  const [gasOverrides, encodedData] = await Promise.all([
    getDefaultGasOverrides(tx.contract.client, tx.contract.chainId),
    encode(tx),
  ]);

  // format the tx request
  const data = formatTransactionRequest({
    to: tx.contract.address as Address,
    data: encodedData,
    ...gasOverrides,
    from: (options?.from ?? undefined) as Address,
  });

  return eth_estimateGas(rpcRequest, data);
}
