import { useEffect, useMemo } from "react";
import type { Abi, AbiEvent } from "abitype";
import {
  watchEvents,
  type ContractEvent,
  getEvents,
} from "~thirdweb/event/index.js";
import type { WatchContractEventsOptions } from "~thirdweb/event/actions/watch-events.js";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getChainIdFromChain } from "~thirdweb/chain/index.js";
import { eth_blockNumber, getRpcClient } from "~thirdweb/rpc/index.js";

export type UseWatchEventsOptions<
  abi extends Abi,
  abiEvent extends AbiEvent,
  contractEvents extends ContractEvent<abiEvent>[],
> = Omit<
  WatchContractEventsOptions<abi, abiEvent, contractEvents>,
  "onLogs"
> & {
  limit?: number;
  enabled?: boolean;
  watch?: boolean;
};

/**
 * Watches contract events and returns the logs.
 * @param options - The {@link UseWatchEventsOptions | options} for watching contract events.
 * @returns The contract events of the watched contract events.
 * @example
 * ```jsx
 * import { useContractEvents } from "thirdweb/react";
 * const contractEvents = useContractEvents({contract});
 * ```
 */
export function useContractEvents<
  const abi extends Abi,
  const abiEvent extends AbiEvent,
  const contractEvents extends ContractEvent<abiEvent>[],
>(options: UseWatchEventsOptions<abi, abiEvent, contractEvents>) {
  const {
    contract,
    events,
    limit = 1000,
    enabled = true,
    watch = true,
  } = options;

  const queryClient = useQueryClient();

  const eventsKey = useMemo(
    () =>
      events?.reduce((acc, curr) => {
        if (typeof curr.event === "string") {
          return acc + curr.event + "_";
        }
        return acc + curr.event.name + "_";
      }, "") || "__all__",
    [events],
  );

  const queryKey = useMemo(
    () =>
      [
        getChainIdFromChain(contract.chain).toString(),
        contract.address,
        "logs",
        eventsKey,
      ] as const,
    [contract.address, contract.chain, eventsKey],
  );

  const query = useQuery({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey,
    queryFn: async () => {
      const rpcRequest = getRpcClient(contract);
      const currentBlockNumber = await eth_blockNumber(rpcRequest);
      const initialEvents = await getEvents<
        abi,
        abiEvent,
        contractEvents,
        bigint,
        bigint
      >({
        contract,
        events: events,
        toBlock: currentBlockNumber,
        // get events from the "limit / 10" blocks
        // TODO: is this good enough or should we go back further?
        // this is likely highly chain & contract dependent? (USDC has 10k+ events in last 100 blocks) which breaks many RPCs
        // right now we just go back 10% of the limit (assuming the limit is 1000, we go back 100 blocks)
        fromBlock: currentBlockNumber - BigInt(limit) / 10n,
      });
      // take the last events from the initial events (based on limits)
      return initialEvents.slice(-limit);
    },
    enabled,
  });

  useEffect(() => {
    if (!enabled || !watch) {
      // don't watch if not enabled or if watch is false
      return;
    }
    // the return is important here because it will unwatch the events
    return watchEvents<abi, abiEvent, contractEvents>({
      contract,
      onLogs: (logs) => {
        queryClient.setQueryData(queryKey, (oldLogs: any = []) => {
          const newLogs = [...oldLogs, ...logs];
          // take the last events from the new logs (based on "limit")
          return newLogs.slice(-limit);
        });
      },
      events,
    });
  }, [contract, enabled, events, limit, queryClient, queryKey, watch]);

  return query.data;
}
