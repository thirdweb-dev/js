import { useState, useEffect } from "react";
import type { Abi, AbiEvent } from "abitype";
import {
  watchContractEvents,
  type ContractEvent,
} from "../../../event/index.js";
import type { WatchContractEventsOptions } from "../../../event/actions/watch-events.js";
import type { GetLogsReturnType } from "viem";

export function useWatchContractEvents<
  const abi extends Abi,
  const abiEvent extends AbiEvent,
  const contractEvent extends ContractEvent<abiEvent>,
>({
  contract,
  events,
  limit = 1000,
  enabled = true,
}: Omit<WatchContractEventsOptions<abi, abiEvent, contractEvent>, "onLogs"> & {
  limit?: number;
  enabled?: boolean;
}) {
  const [logs, setLogs] = useState<
    GetLogsReturnType<undefined, abiEvent[], undefined, bigint, bigint>
  >([]);

  useEffect(() => {
    if (!enabled) {
      // don't watch if not enabled
      return;
    }
    return watchContractEvents<abi, abiEvent, contractEvent>({
      contract,
      onLogs: (logs_) => {
        setLogs((oldLogs) => [...oldLogs, ...logs_].slice(-limit));
      },
      events,
    });
  }, [contract, enabled, events, limit]);

  return logs;
}
