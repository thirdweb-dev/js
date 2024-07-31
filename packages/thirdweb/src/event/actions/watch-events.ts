import type { Abi, AbiEvent } from "abitype";
import {
  type GetContractEventsOptionsDirect,
  getContractEvents,
} from "./get-events.js";

import { watchBlockNumber } from "../../rpc/watchBlockNumber.js";
import { retry } from "../../utils/retry.js";
import type { Prettify } from "../../utils/type-utils.js";
import type { PreparedEvent } from "../prepare-event.js";
import type { ParseEventLogsResult } from "./parse-logs.js";

export type WatchContractEventsOptions<
  abi extends Abi,
  abiEvents extends PreparedEvent<AbiEvent>[],
  TStrict extends boolean,
> = Prettify<
  GetContractEventsOptionsDirect<abi, abiEvents, TStrict> & {
    onEvents: (events: ParseEventLogsResult<abiEvents, TStrict>) => void;
    latestBlockNumber?: bigint;
  }
>;

/**
 * Listens for  contract events from the blockchain.
 * @param options - The options for retrieving contract events.
 * @returns The unwatch function.
 * @example
 * ### Listen to all events for a contract
 * ```ts
 * import { watchContractEvents } from "thirdweb";
 * const unwatch = watchContractEvents({
 *  contract: myContract,
 *  onEvents: (events) => {
 *   // do something with the events
 *  },
 * });
 * ```
 *
 * ### Listen to specific events for a contract
 * ```ts
 * import { prepareEvent, watchContractEvents } from "thirdweb";
 * const myEvent = prepareEvent({
 *  event: "event MyEvent(uint256 myArg)",
 * });
 * const events = await watchContractEvents({
 *  contract: myContract,
 *  events: [myEvent],
 *  onEvents: (events) => {
 *   // do something with the events
 *  },
 * });
 * ```
 * @contract
 */
export function watchContractEvents<
  const abi extends Abi,
  const abiEvents extends PreparedEvent<AbiEvent>[],
  const TStrict extends boolean = true,
>(options: WatchContractEventsOptions<abi, abiEvents, TStrict>) {
  // returning this returns the underlying "unwatch" function
  return watchBlockNumber({
    ...options.contract,

    /**
     * This function is called every time a new block is mined.
     * @param blockNumber - The block number of the new block.
     * @returns A promise that resolves when the function is finished.
     * @internal
     */
    onNewBlockNumber: async (blockNumber) => {
      const logs = await retry(
        async () =>
          getContractEvents({
            ...options,
            // fromBlock is inclusive
            fromBlock: blockNumber,
            // toBlock is inclusive
            toBlock: blockNumber,
          }),
        {
          retries: 3,
          delay: 500,
        },
      );
      // if there were any logs associated with our event(s)
      if (logs.length) {
        options.onEvents(logs);
      }
    },
    latestBlockNumber: options.latestBlockNumber,
  });
}
