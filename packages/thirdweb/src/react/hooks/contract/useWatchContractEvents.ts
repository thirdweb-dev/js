import { useState, useEffect } from "react";
import type { Abi, AbiEvent } from "abitype";
import { watchEvents, type ContractEvent } from "../../../event/index.js";
import type { WatchContractEventsOptions } from "../../../event/actions/watch-events.js";
import type { GetLogsReturnType } from "viem";

export type UseWatchEventsOptions<
  abi extends Abi,
  abiEvent extends AbiEvent,
  contractEvent extends ContractEvent<abiEvent>,
> = Omit<WatchContractEventsOptions<abi, abiEvent, contractEvent>, "onLogs"> & {
  limit?: number;
  enabled?: boolean;
};

/**
 * Watches contract events and returns the logs.
 * @param options - The {@link UseWatchEventsOptions | options} for watching contract events.
 * @returns The contract events of the watched contract events.
 * @example
 * ```jsx
 * import { useWatchEvents } from "thirdweb/react";
 * const contractEvents = useWatchEvents({contract});
 * ```
 */
export function useWatchEvents<
  const abi extends Abi,
  const abiEvent extends AbiEvent,
  const contractEvent extends ContractEvent<abiEvent>,
>(options: UseWatchEventsOptions<abi, abiEvent, contractEvent>) {
  const { contract, events, limit = 1000, enabled = true } = options;
  const [logs, setLogs] = useState<
    GetLogsReturnType<undefined, abiEvent[], undefined, bigint, bigint>
  >([]);

  useEffect(() => {
    if (!enabled) {
      // don't watch if not enabled
      return;
    }
    return watchEvents<abi, abiEvent, contractEvent>({
      contract,
      onLogs: (logs_) => {
        setLogs((oldLogs) => [...oldLogs, ...logs_].slice(-limit));
      },
      events,
    });
  }, [contract, enabled, events, limit]);

  return logs;
}
