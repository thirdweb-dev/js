import type { Address } from "abitype";
import {
  type BlockNumber,
  type BlockTag,
  type EIP1193RequestFn,
  type EIP1474Methods,
  type LogTopic,
  type RpcLog,
  type Hash,
  formatLog,
} from "viem";
import { numberToHex } from "../../utils/hex.js";

export type GetLogsBlockParams =
  | {
      fromBlock?: BlockNumber | BlockTag;
      toBlock?: BlockNumber | BlockTag;
      blockHash?: never;
    }
  | {
      fromBlock?: never;
      toBlock?: never;
      blockHash?: Hash;
    };

export type GetLogsParams = {
  topics?: LogTopic[];
  address?: Address;
} & GetLogsBlockParams;

/**
 * Retrieves logs from the Ethereum blockchain based on the specified parameters.
 * @param request - The EIP1193 request function.
 * @param params - The parameters for retrieving logs.
 * @returns A promise that resolves to the retrieved logs.
 * @rpc
 * @example
 * ```ts
 * import { getRpcClient, eth_getLogs } from "thirdweb/rpc";
 * const rpcRequest = getRpcClient({ client, chain });
 * const logs = await eth_getLogs(rpcRequest, {
 *  address: "0x...",
 *  fromBlock: 123456n,
 *  toBlock: 123456n,
 * });
 * ```
 */
export async function eth_getLogs(
  request: EIP1193RequestFn<EIP1474Methods>,
  params: GetLogsParams = {},
) {
  const topics = params.topics ?? [];

  let logs: RpcLog[];
  // in the case we have a blockHash
  if (params.blockHash) {
    const param: {
      address?: string | string[];
      topics: LogTopic[];
      blockHash: `0x${string}`;
    } = {
      topics,
      blockHash: params.blockHash,
    };
    if (params.address) {
      param.address = params.address;
    }
    logs = await request({
      method: "eth_getLogs",
      params: [param],
    });
  }
  // otherwise
  else {
    const param: {
      address?: string | string[];
      topics?: LogTopic[];
    } & (
      | {
          fromBlock?: BlockTag | `0x${string}`;
          toBlock?: BlockTag | `0x${string}`;
          blockHash?: never;
        }
      | {
          fromBlock?: never;
          toBlock?: never;
          blockHash?: `0x${string}`;
        }
    ) = { topics };
    if (params.address) {
      param.address = params.address;
    }

    if (params.fromBlock) {
      param.fromBlock =
        typeof params.fromBlock === "bigint"
          ? numberToHex(params.fromBlock)
          : params.fromBlock;
    }
    if (params.toBlock) {
      param.toBlock =
        typeof params.toBlock === "bigint"
          ? numberToHex(params.toBlock)
          : params.toBlock;
    }
    logs = await request({
      method: "eth_getLogs",
      params: [param],
    });
  }

  return logs.map((log) => formatLog(log));
}
