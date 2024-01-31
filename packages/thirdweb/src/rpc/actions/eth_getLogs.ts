import type { AbiEvent } from "abitype";
import {
  encodeEventTopics,
  type BlockNumber,
  type BlockTag,
  type EIP1193RequestFn,
  type EIP1474Methods,
  type GetLogsParameters,
  type GetLogsReturnType,
  type LogTopic,
  type EncodeEventTopicsParameters,
  type RpcLog,
  formatLog,
  parseEventLogs,
  numberToHex,
} from "viem";

/**
 * Retrieves logs from the Ethereum blockchain based on the specified parameters.
 * @param request - The EIP1193 request function.
 * @param params - The parameters for retrieving logs.
 * @returns A promise that resolves to the retrieved logs.
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
export async function eth_getLogs<
  const TAbiEvent extends AbiEvent | undefined = undefined,
  const TAbiEvents extends
    | readonly AbiEvent[]
    | readonly unknown[]
    | undefined = TAbiEvent extends AbiEvent ? [TAbiEvent] : undefined,
  TStrict extends boolean | undefined = undefined,
  TFromBlock extends BlockNumber | BlockTag | undefined = undefined,
  TToBlock extends BlockNumber | BlockTag | undefined = undefined,
>(
  request: EIP1193RequestFn<EIP1474Methods>,
  params: GetLogsParameters<
    TAbiEvent,
    TAbiEvents,
    TStrict,
    TFromBlock,
    TToBlock
  > = {},
): Promise<
  GetLogsReturnType<TAbiEvent, TAbiEvents, TStrict, TFromBlock, TToBlock>
> {
  const strict = params.strict ?? false;
  const events = params.events ?? (params.event ? [params.event] : undefined);

  let topics: LogTopic[] = [];
  if (events) {
    topics = [
      (events as AbiEvent[]).flatMap((event_) =>
        encodeEventTopics({
          abi: [event_],
          eventName: (event_ as AbiEvent).name,
          args: params.args,
        } as EncodeEventTopicsParameters),
      ),
    ];
    if (params.event) {
      topics = topics[0] as LogTopic[];
    }
  }

  let logs: RpcLog[];
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
  } else {
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

  const formattedLogs = logs.map((log) => formatLog(log));
  if (!events) {
    return formattedLogs as GetLogsReturnType<
      TAbiEvent,
      TAbiEvents,
      TStrict,
      TFromBlock,
      TToBlock
    >;
  }
  return parseEventLogs({
    abi: events,
    logs: formattedLogs,
    strict,
  }) as unknown as GetLogsReturnType<
    TAbiEvent,
    TAbiEvents,
    TStrict,
    TFromBlock,
    TToBlock
  >;
}
