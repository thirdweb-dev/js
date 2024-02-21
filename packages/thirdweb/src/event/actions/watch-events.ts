import type { Abi, AbiEvent } from "abitype";
import {
  getContractEvents,
  type GetContractEventsOptionsDirect,
} from "./get-events.js";

import type { Prettify } from "../../utils/type-utils.js";
import type { ParseEventLogsResult } from "./parse-logs.js";
import { watchBlockNumber } from "../../rpc/watchBlockNumber.js";

export type WatchContractEventsOptions<
  abi extends Abi,
  abiEvent extends AbiEvent,
  TStrict extends boolean,
> = Prettify<
  GetContractEventsOptionsDirect<abi, abiEvent, TStrict> & {
    onEvents: (events: ParseEventLogsResult<abiEvent, TStrict>) => void;
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
 * const unwatch = watchEvents({
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
 * const events = await watchEvents({
 *  contract: myContract,
 *  events: [myEvent],
 *  onEvents: (events) => {
 *   // do something with the events
 *  },
 * });
 * ```
 */
export function watchContractEvents<
  const abi extends Abi,
  const abiEvent extends AbiEvent,
  const TStrict extends boolean = true,
>(options: WatchContractEventsOptions<abi, abiEvent, TStrict>) {
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
      const logs = await getContractEvents({
        ...options,
        // fromBlock is inclusive
        fromBlock: blockNumber,
        // toBlock is exclusive
        toBlock: blockNumber,
      });
      // if there were any logs associated with our event(s)
      if (logs.length) {
        options.onEvents(logs);
      }
    },
  });
}
