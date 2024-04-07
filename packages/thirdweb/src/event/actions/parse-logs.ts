import type { AbiEvent } from "abitype";
import {
  type Log,
  type RpcLog,
  parseEventLogs as viem_parseEventLogs,
} from "viem";
import type { PreparedEvent } from "../prepare-event.js";

export type ParseEventLogsOptions<
  abiEvents extends PreparedEvent<AbiEvent>[],
  TStrict extends boolean,
> = {
  logs: (Log | RpcLog)[];
  events: abiEvents;
  strict?: TStrict;
};

export type ParseEventLogsResult<
  abiEvents extends PreparedEvent<AbiEvent>[],
  TStrict extends boolean,
  abiEvent extends AbiEvent = abiEvents[number]["abiEvent"],
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
 * ```
 * @contract
 */
export function parseEventLogs<
  const abiEvents extends PreparedEvent<AbiEvent>[],
  const TStrict extends boolean = true,
>(
  options: ParseEventLogsOptions<abiEvents, TStrict>,
): ParseEventLogsResult<abiEvents, TStrict> {
  const { logs, events, strict } = options;
  return viem_parseEventLogs({
    logs,
    abi: events.map((e) => e.abiEvent),
    strict,
  }) as unknown as ParseEventLogsResult<abiEvents, TStrict>;
}
