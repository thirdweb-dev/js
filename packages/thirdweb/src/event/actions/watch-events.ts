import type { Abi, AbiEvent } from "abitype";
import { resolveAbiEvent } from "./resolve-abi.js";
import type { ContractEvent, EventLog } from "../event.js";
import { resolveContractAbi } from "../../contract/actions/resolve-abi.js";
import {
  eth_getLogs,
  getRpcClient,
  watchBlockNumber,
} from "../../rpc/index.js";
import type { ThirdwebContract } from "../../contract/contract.js";

export type WatchContractEventsOptions<
  abi extends Abi,
  abiEvent extends AbiEvent,
  contractEvents extends ContractEvent<abiEvent>[],
> = {
  onLogs: (logs: EventLog<abiEvent>[]) => void | undefined;
  contract: ThirdwebContract<abi>;
  events?: contractEvents | undefined;
};

/**
 * Listens for  contract events from the blockchain.
 * @param options - The options for retrieving contract events.
 * @returns The unwatch function.
 * @example
 * ### Listen to all events for a contract
 * ```ts
 * import { watchEvents } from "thirdweb";
 * const unwatch = watchEvents({
 *  contract: myContract,
 *  onLogs: (logs) => {
 *   // do something with the logs
 *  },
 * });
 * ```
 *
 * ### Listen to specific events for a contract
 * ```ts
 * import { contractEvent, watchEvents } from "thirdweb";
 * const myEvent = contractEvent({
 *  contract: myContract,
 *  event: "MyEvent",
 * });
 * const events = await watchEvents({
 *  contract: myContract,
 *  events: [myEvent],
 *  onLogs: (logs) => {
 *   // do something with the logs
 *  },
 * });
 * ```
 */
export function watchEvents<
  const abi extends Abi,
  const abiEvent extends AbiEvent,
  const contractEvents extends ContractEvent<abiEvent>[],
>(options: WatchContractEventsOptions<abi, abiEvent, contractEvents>) {
  const rpcRequest = getRpcClient(options.contract);
  const resolveAbiPromise = options.events
    ? Promise.all(options.events.map((e) => resolveAbiEvent(e)))
    : // if we don't have events passed then resolve the abi for the contract -> all events!
      (resolveContractAbi(options.contract).then((abi) =>
        abi.filter((item) => item.type === "event"),
      ) as Promise<abiEvent[]>);

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
      const parsedEvents = await resolveAbiPromise;

      const logs = (await eth_getLogs(rpcRequest, {
        // onNewBlockNumber fires exactly once per block
        // => we want to get the logs for the block that just happened
        // fromBlock is inclusive
        fromBlock: blockNumber,
        // toBlock is exclusive
        toBlock: blockNumber,
        address: options.contract.address,
        events: parsedEvents,
      })) as EventLog<abiEvent>[];
      // if there were any logs associated with our event(s)
      if (logs.length) {
        options.onLogs(logs);
      }
    },
  });
}
