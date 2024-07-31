import {
  type UseQueryResult,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type { Abi, AbiEvent } from "abitype";
import { useEffect, useMemo, useRef } from "react";
import { getContractEvents } from "../../../../event/actions/get-events.js";
import type { ParseEventLogsResult } from "../../../../event/actions/parse-logs.js";
import {
  type WatchContractEventsOptions,
  watchContractEvents,
} from "../../../../event/actions/watch-events.js";
import type { PreparedEvent } from "../../../../event/prepare-event.js";
import { eth_blockNumber } from "../../../../rpc/actions/eth_blockNumber.js";
import { getRpcClient } from "../../../../rpc/rpc.js";

type UseContractEventsOptions<
  abi extends Abi,
  abiEvents extends PreparedEvent<AbiEvent>[],
> = Omit<WatchContractEventsOptions<abi, abiEvents, true>, "onEvents"> & {
  blockRange?: number;
  enabled?: boolean;
  watch?: boolean;
};

/**
 * Watches contract events and returns the logs.
 * @param options - The {@link UseContractEventsOptions | options} for watching contract events.
 * @returns The contract events of the watched contract events.
 * @example
 * ```jsx
 * import { useContractEvents } from "thirdweb/react";
 * import { tokensClaimedEvent } from "thirdweb/extensions/erc721";
 *
 * const account = useActiveAccount();
 * const contractEvents = useContractEvents({
 *  contract,
 *  events: [tokensClaimedEvent({ claimer: account?.address })],
 * });
 * ```
 * @contract
 */
export function useContractEvents<
  const abi extends Abi,
  const abiEvents extends PreparedEvent<AbiEvent>[],
>(
  options: UseContractEventsOptions<abi, abiEvents>,
): UseQueryResult<ParseEventLogsResult<abiEvents, true>, Error> {
  const {
    contract,
    events,
    blockRange = 2000,
    enabled = true,
    watch = true,
  } = options;
  const latestBlockNumber = useRef<bigint>(); // We use this to keep track of the latest block number when new pollers are spawned

  const queryClient = useQueryClient();

  const eventsKey = useMemo(
    () =>
      events?.reduce((acc, curr) => {
        // we can use the event hash as a unique identifier?
        return `${acc}${curr.hash}_`;
      }, "") || "__all__",
    [events],
  );

  const queryKey = useMemo(
    () => [contract.chain.id, contract.address, "logs", eventsKey] as const,
    [contract.address, contract.chain, eventsKey],
  );

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      const rpcRequest = getRpcClient(contract);
      const currentBlockNumber = await eth_blockNumber(rpcRequest);
      latestBlockNumber.current = currentBlockNumber;
      const initialEvents = await getContractEvents({
        contract,
        events: events,
        fromBlock: currentBlockNumber - BigInt(blockRange),
      });
      return initialEvents;
    },
    enabled,
  });

  useEffect(() => {
    if (!enabled || !watch) {
      // don't watch if not enabled or if watch is false
      return;
    }

    // the return is important here because it will unwatch the events
    return watchContractEvents<abi, abiEvents>({
      contract,
      onEvents: (newEvents) => {
        if (newEvents.length > 0 && newEvents[0]) {
          latestBlockNumber.current = newEvents[0].blockNumber; // Update the latest block number to avoid duplicate events if a new poller is spawned during this block
        }
        // biome-ignore lint/suspicious/noExplicitAny: TODO: fix any
        queryClient.setQueryData(queryKey, (oldEvents: any = []) => [
          ...oldEvents,
          ...newEvents,
        ]);
      },
      events,
      latestBlockNumber: latestBlockNumber.current,
    });
  }, [contract, enabled, events, queryClient, queryKey, watch]);

  return query;
}
