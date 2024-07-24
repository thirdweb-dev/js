/**
 * 1. blockTime + contract (with abi) + no events -> logs with types and parsing *if* contract has abi defined
 * 2. blockTime + contract (no abi) + no events -> logs with NO types but *with* parsing
 * 3. blockTime + no contract + events -> logs with types and parsing (across all "addresses") (no contract filter)
 * 4. blockTime + contract + events -> logs with types and parsing (filtered by contract address +  event topics)
 */

import type {
  Abi,
  AbiEvent,
  ExtractAbiEvent,
  ExtractAbiEventNames,
} from "abitype";
import { resolveContractAbi } from "../../contract/actions/resolve-abi.js";
import type { ThirdwebContract } from "../../contract/contract.js";
import { eth_blockNumber } from "../../rpc/actions/eth_blockNumber.js";
import {
  type GetLogsBlockParams,
  type GetLogsParams,
  eth_getLogs,
} from "../../rpc/actions/eth_getLogs.js";
import { getRpcClient } from "../../rpc/rpc.js";
import type { Prettify } from "../../utils/type-utils.js";
import { type PreparedEvent, prepareEvent } from "../prepare-event.js";
import { isAbiEvent } from "../utils.js";
import { type ParseEventLogsResult, parseEventLogs } from "./parse-logs.js";

export type GetContractEventsOptionsDirect<
  abi extends Abi,
  abiEvents extends PreparedEvent<AbiEvent>[],
  TStrict extends boolean,
> = {
  contract: ThirdwebContract<abi>;
  events?: abiEvents;
  strict?: TStrict;
};

export type GetContractEventsOptions<
  abi extends Abi,
  abiEvents extends PreparedEvent<AbiEvent>[],
  TStrict extends boolean,
> = Prettify<
  GetContractEventsOptionsDirect<abi, abiEvents, TStrict> & GetLogsBlockParams
>;

export type GetContractEventsResult<
  abiEvents extends PreparedEvent<AbiEvent>[],
  TStrict extends boolean,
> = ParseEventLogsResult<abiEvents, TStrict>;

/**
 * Retrieves events from a contract based on the provided options.
 * @param options - The options for retrieving events.
 * @returns A promise that resolves to an array of parsed event logs.
 * Note: toBlock and fromBlock are both inclusive.
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
 * @example
 * Optionally specify a blockRange as the number of blocks to retrieve. toBlock will default to the current block number.
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * const events = await getContractEvents({
 *  contract: myContract,
 *  blockRange: 123456n,
 *  events: [preparedEvent, preparedEvent2],
 * });
 * ```
 * @example
 * Use fromBlock with blockRange for pagination.
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * const events = await getContractEvents({
 *  contract: myContract,
 *  fromBlock: lastBlockFetched,
 *  blockRange: 123456n,
 *  events: [preparedEvent, preparedEvent2],
 * });
 * ```
 * @example
 * Retrieve events for a specific block hash.
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * const events = await getContractEvents({
 *  contract: myContract,
 *  blockHash: "0x...",
 *  events: [preparedEvent, preparedEvent2],
 * });
 * ```
 * @contract
 */
export async function getContractEvents<
  const abi extends Abi,
  const abiEvents extends PreparedEvent<AbiEvent>[] = PreparedEvent<
    ExtractAbiEvent<abi, ExtractAbiEventNames<abi>>
  >[],
  const TStrict extends boolean = true,
>(
  options: GetContractEventsOptions<abi, abiEvents, TStrict>,
): Promise<GetContractEventsResult<abiEvents, TStrict>> {
  const { contract, events, blockRange, ...restParams } = options;

  const rpcRequest = getRpcClient(contract);

  if (
    restParams.blockHash &&
    (blockRange || restParams.fromBlock || restParams.toBlock)
  ) {
    throw new Error("Cannot specify blockHash and range simultaneously,");
  }

  const latestBlockNumber = await eth_blockNumber(rpcRequest);

  // Compute toBlock and fromBlock if blockRange was passed
  if (blockRange) {
    const { fromBlock, toBlock } = restParams;

    // Make sure the inputs were properly defined
    if (
      fromBlock &&
      toBlock &&
      BigInt(toBlock) - BigInt(fromBlock) !== BigInt(blockRange)
    ) {
      throw new Error(
        "Incompatible blockRange with specified fromBlock and toBlock. Please only define fromBlock or toBlock when specifying blockRange.",
      );
    }

    if (fromBlock) {
      restParams.toBlock = BigInt(fromBlock) + BigInt(blockRange) - 1n; // Subtract one because toBlock is inclusive
    } else if (toBlock) {
      restParams.fromBlock = BigInt(toBlock) - BigInt(blockRange) + 1n; // Add one because fromBlock is inclusive
    } else {
      // If no from or to block specified, use the latest block as the to block
      restParams.toBlock = latestBlockNumber;
      restParams.fromBlock = latestBlockNumber - BigInt(blockRange) + 1n; // Add one because fromBlock is inclusive
    }
  }

  let resolvedEvents = events ?? [];

  // if we have an abi on the contract, we can encode the topics with it
  if (!events?.length && !!contract) {
    // if we have a contract *WITH* an abi we can use that
    if (contract.abi?.length) {
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

  const logsParams: GetLogsParams[] =
    events && events.length > 0
      ? // if we have events passed in then we use those
        events.map((e) => ({
          ...restParams,
          address: contract?.address,
          topics: e.topics,
        }))
      : // otherwise we want "all" events (aka not pass any topics at all)
        [{ ...restParams, address: contract?.address }];

  const logs = await Promise.all(
    logsParams.map((ethLogParams) => eth_getLogs(rpcRequest, ethLogParams)),
  );
  const flattenLogs = logs
    .flat()
    .sort((a, b) => Number((a.blockNumber ?? 0n) - (b.blockNumber ?? 0n)));
  return parseEventLogs({
    logs: flattenLogs,
    events: resolvedEvents,
  });
}
