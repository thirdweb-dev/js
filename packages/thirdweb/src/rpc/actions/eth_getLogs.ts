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
  {
    address,
    blockHash,
    fromBlock,
    toBlock,
    event,
    events: events_,
    args,
    strict: strict_,
  }: GetLogsParameters<
    TAbiEvent,
    TAbiEvents,
    TStrict,
    TFromBlock,
    TToBlock
  > = {},
): Promise<
  GetLogsReturnType<TAbiEvent, TAbiEvents, TStrict, TFromBlock, TToBlock>
> {
  const strict = strict_ ?? false;
  const events = events_ ?? (event ? [event] : undefined);

  let topics: LogTopic[] = [];
  if (events) {
    topics = [
      (events as AbiEvent[]).flatMap((event_) =>
        encodeEventTopics({
          abi: [event_],
          eventName: (event_ as AbiEvent).name,
          args,
        } as EncodeEventTopicsParameters),
      ),
    ];
    if (event) {
      topics = topics[0] as LogTopic[];
    }
  }

  let logs: RpcLog[];
  if (blockHash) {
    const param: {
      address?: string | string[];
      topics: LogTopic[];
      blockHash: `0x${string}`;
    } = {
      topics,
      blockHash,
    };
    if (address) {
      param.address = address;
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
    if (address) {
      param.address = address;
    }

    if (fromBlock) {
      param.fromBlock =
        typeof fromBlock === "bigint" ? numberToHex(fromBlock) : fromBlock;
    }
    if (toBlock) {
      param.toBlock =
        typeof toBlock === "bigint" ? numberToHex(toBlock) : toBlock;
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
