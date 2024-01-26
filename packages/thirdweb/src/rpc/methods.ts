import type { Address } from "abitype";
import type { RPCClient } from "./index.js";
import {
  type BlockNumber,
  type BlockTag,
  type RpcBlock,
  type RpcTransactionReceipt,
  hexToBigInt,
  hexToNumber,
  formatBlock,
  formatTransactionReceipt,
} from "viem";

export async function blockByNumber(
  client: RPCClient,
  blockNumber: BlockNumber | BlockTag,
  includeTransactions = false,
) {
  const result = await client({
    method: "eth_getBlockByNumber",
    params: [blockNumber, includeTransactions],
  });
  console.log("blockByNumber", { blockNumber, includeTransactions, result });
  return formatBlock(result as RpcBlock);
}

export async function maxPriorityFeePerGas(client: RPCClient) {
  const result = await client({
    method: "eth_maxPriorityFeePerGas",
    params: [],
  });
  return hexToBigInt(result);
}

export async function gasPrice(client: RPCClient) {
  const result = await client({
    method: "eth_gasPrice",
    params: [],
  });
  return hexToBigInt(result);
}

export async function transactionCount(
  client: RPCClient,
  address: Address,
  blockNumber: BlockNumber | BlockTag = "latest",
) {
  const result = await client({
    method: "eth_getTransactionCount",
    params: [address, blockNumber],
  });
  return hexToNumber(result);
}

export async function getTransactionReceipt(client: RPCClient, hash: string) {
  const result = await client({
    method: "eth_getTransactionReceipt",
    params: [hash],
  });

  // null means the tx is not mined yet
  if (result === null) {
    return null;
  }

  return formatTransactionReceipt(result as RpcTransactionReceipt);
}
