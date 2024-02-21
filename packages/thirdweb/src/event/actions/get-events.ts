/**
 * 1. blockTime + contract (with abi) + no events -> logs with types and parsing *if* contract has abi defined
 * 2. blockTime + contract (no abi) + no events -> logs with NO types but *with* parsing
 * 3. blockTime + no contract + events -> logs with types and parsing (across all "addresses") (no contract filter)
 * 4. blockTime + contract + events -> logs with types and parsing (filtered by contract address +  event topics)
 */

import type { Abi, AbiEvent, ExtractAbiEvents } from "abitype";
import { prepareEvent, type PreparedEvent } from "../prepare-event.js";
import {
  eth_getLogs,
  type GetLogsBlockParams,
  type GetLogsParams,
} from "../../rpc/actions/eth_getLogs.js";
import { getRpcClient } from "../../rpc/rpc.js";
import { parseEventLogs, type ParseEventLogsResult } from "./parse-logs.js";
import { isAbiEvent } from "../utils.js";
import type { Prettify } from "../../utils/type-utils.js";
import type { ThirdwebContract } from "../../contract/contract.js";
import { resolveContractAbi } from "../../contract/actions/resolve-abi.js";

export type GetContractEventsOptionsDirect<
  abi extends Abi,
  abiEvent extends AbiEvent,
  TStrict extends boolean,
> = {
  contract: ThirdwebContract<abi>;
  events?: PreparedEvent<abiEvent>[];
  strict?: TStrict;
};

export type GetContractEventsOptions<
  abi extends Abi,
  abiEvent extends AbiEvent,
  TStrict extends boolean,
> = Prettify<
  GetContractEventsOptionsDirect<abi, abiEvent, TStrict> & GetLogsBlockParams
>;

export type GetContractEventsResult<
  abiEvent extends AbiEvent,
  TStrict extends boolean,
> = ParseEventLogsResult<abiEvent, TStrict>;

/**
 * Retrieves events from a contract based on the provided options.
 * @param options - The options for retrieving events.
 * @returns A promise that resolves to an array of parsed event logs.
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * const events = await getContractEvents({
 *  contract: myContract,
 *  fromBlock: 123456n,
 *  toBlock: 123456n,
 *  events: [preparedEvent, preparedEvent2],
 * });
 * ```
 */
export async function getContractEvents<
  const abi extends Abi,
  const abiEvent extends AbiEvent = ExtractAbiEvents<abi>,
  const TStrict extends boolean = true,
>(
  options: GetContractEventsOptions<abi, abiEvent, TStrict>,
): Promise<GetContractEventsResult<abiEvent, TStrict>> {
  const { contract, events, ...restParams } = options;

  let resolvedEvents = events ?? [];

  // if we have an abi on the contract, we can encode the topics with it
  if (!events?.length && !!contract) {
    // if we have a contract *WITH* an abi we can use that
    if (!!contract.abi?.length) {
      // @ts-expect-error - we can't make typescript happy here, but we know this is an abi event
      resolvedEvents = contract.abi
        .filter(isAbiEvent)
        .map((abiEvent) => prepareEvent({ signature: abiEvent }));
    } else {
      const runtimeAbi = await resolveContractAbi(contract);
      // @ts-expect-error - we can't make typescript happy here, but we know this is an abi event
      resolvedEvents = runtimeAbi
        .filter(isAbiEvent)
        .map((abiEvent) => prepareEvent({ signature: abiEvent }));
    }
  }

  const eventsTopics = resolvedEvents.flatMap((e) => e.topics) ?? [];
  const ethLogsParams: GetLogsParams = {
    ...restParams,
    address: contract?.address,
    topics: eventsTopics,
  };
  const rpcRequest = getRpcClient(contract);
  const logs = await eth_getLogs(rpcRequest, ethLogsParams);
  return parseEventLogs({
    logs,
    events: resolvedEvents,
  });
}
