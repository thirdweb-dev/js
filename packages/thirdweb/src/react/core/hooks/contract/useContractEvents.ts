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
 * Watches contract events and returns the parsed logs.
 * @param options - The options for watching contract events.
 * @param options.contract - The contract to watch events for.
 * @param options.events - The events to watch. Shuould be an array of [prepared events](https://portal.thirdweb.com/references/typescript/v5/prepareEvent).
 * @param options.blockRange - The number of blocks to search for events.
 * @param options.enabled - Whether to enable the query.
 * @param options.watch - Whether to watch for new events.
 * @returns The contract events of the watched contract events.
 * @example
 *
 * ### Using event extensions
 *
 * The `thirdweb/extesions` export contains event definitions for many popular contracts.
 * You can use these event definitions to watch for specific events with a type-safe API.
 *
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
 *
 * ### Using custom events
 *
 * You can also watch for custom events by passing an array of [prepared events](https://portal.thirdweb.com/references/typescript/v5/prepareEvent).
 *
 * ```jsx
 * import { useContractEvents } from "thirdweb/react";
 * import { prepareEvent } from "thirdweb";
 *
 * const myEvent = prepareEvent({
 *  signature: "event MyEvent(uint256 myArg)",
 * });
 *
 * const contractEvents = useContractEvents({
 *  contract,
 *  events: [myEvent],
 * });
 * ```
 *
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
  const latestBlockNumber = useRef<bigint>(undefined); // We use this to keep track of the latest block number when new pollers are spawned

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
    enabled,
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
    queryKey,
  });

  useEffect(() => {
    if (!enabled || !watch) {
      // don't watch if not enabled or if watch is false
      return;
    }

    // the return is important here because it will unwatch the events
    return watchContractEvents<abi, abiEvents>({
      contract,
      events,
      latestBlockNumber: latestBlockNumber.current,
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
    });
  }, [contract, enabled, events, queryClient, queryKey, watch]);

  return query;
}
