import type { AbiEvent } from "abitype";
import {
  parseEventLogs as viem_parseEventLogs,
  type Log,
  type RpcLog,
} from "viem";
import type { PreparedEvent } from "../prepare-event.js";

export type ParseEventLogsOptions<
  abiEvent extends AbiEvent,
  TStrict extends boolean,
> = {
  logs: (Log | RpcLog)[];
  events: PreparedEvent<abiEvent>[];
  strict?: TStrict;
};

export type ParseEventLogsResult<
  abiEvent extends AbiEvent,
  TStrict extends boolean,
> = Array<Log<bigint, number, false, undefined, TStrict, abiEvent[]>>;

/**
 * Parses logs and returns the corresponding events.
 * @param options - The options for parsing logs.
 * @returns The parsed events.
 * @example
 * ```ts
 * import { parseEventLogs } from "thirdweb";
 * const events = parseEventLogs({
 *  logs,
 *  events: [preparedEvent, preparedEvent2],
 * });
 */
export function parseEventLogs<
  const abiEvent extends AbiEvent,
  const TStrict extends boolean = true,
>(
  options: ParseEventLogsOptions<abiEvent, TStrict>,
): ParseEventLogsResult<abiEvent, TStrict> {
  const { logs, events, strict } = options;
  return viem_parseEventLogs({
    logs,
    abi: events.map((e) => e.abiEvent),
    strict,
  });
}
