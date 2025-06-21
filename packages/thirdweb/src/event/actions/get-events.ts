import type {
  Abi,
  AbiEvent,
  ExtractAbiEvent,
  ExtractAbiEventNames,
} from "abitype";
import { formatLog, type Log } from "viem";
import { resolveContractAbi } from "../../contract/actions/resolve-abi.js";
import type { ThirdwebContract } from "../../contract/contract.js";
import {
  type ContractEvent,
  getContractEvents as getContractEventsInsight,
} from "../../insight/get-events.js";
import { eth_blockNumber } from "../../rpc/actions/eth_blockNumber.js";
import {
  eth_getLogs,
  type GetLogsBlockParams,
  type GetLogsParams,
} from "../../rpc/actions/eth_getLogs.js";
import { getRpcClient } from "../../rpc/rpc.js";
import { getAddress } from "../../utils/address.js";
import { type Hex, numberToHex } from "../../utils/encoding/hex.js";
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
  useIndexer?: boolean;
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

type GetLogsParamsExtra = {
  signature?: string;
} & GetLogsParams;

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
  const {
    contract,
    events,
    blockRange,
    useIndexer = true,
    ...restParams
  } = options;

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
      fromBlock !== undefined &&
      toBlock !== undefined &&
      BigInt(toBlock) - BigInt(fromBlock) !== BigInt(blockRange)
    ) {
      throw new Error(
        "Incompatible blockRange with specified fromBlock and toBlock. Please only define fromBlock or toBlock when specifying blockRange.",
      );
    }

    if (fromBlock !== undefined) {
      restParams.toBlock = BigInt(fromBlock) + BigInt(blockRange) - 1n; // Subtract one because toBlock is inclusive
    } else if (toBlock !== undefined) {
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
    if (useIndexer) {
      // fetch all events from the indexer, no need to get events from ABI
      const events = await getContractEventsInsight({
        chains: [contract.chain],
        client: contract.client,
        contractAddress: contract.address,
        decodeLogs: true,
        queryOptions: {
          filter_block_hash: restParams.blockHash,
          filter_block_number_gte: restParams.fromBlock,
          filter_block_number_lte: restParams.toBlock,
          limit: 500,
        },
      }).catch(() => {
        // chain might not support indexer
        return null;
      });
      if (events) {
        return toLog(events) as GetContractEventsResult<abiEvents, TStrict>;
      }
    }

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

  const logsParams: GetLogsParamsExtra[] =
    events && events.length > 0
      ? // if we have events passed in then we use those
        events.map((e) => ({
          ...restParams,
          address: getAddress(contract.address),
          topics: e.topics,
        }))
      : // otherwise we want "all" events (aka not pass any topics at all)
        [{ ...restParams, address: getAddress(contract.address) }];

  let logs: Log[][] = [];

  // try fetching from insight if available
  if (useIndexer) {
    try {
      logs = await Promise.all(
        logsParams.map((p) =>
          getLogsFromInsight({
            contract,
            params: p,
          }),
        ),
      );
    } catch (e) {
      console.warn("Error fetching from insight, falling back to rpc", e);
      // fetch from rpc
      logs = await Promise.all(
        logsParams.map((ethLogParams) => eth_getLogs(rpcRequest, ethLogParams)),
      );
    }
  } else {
    // fetch from rpc
    logs = await Promise.all(
      logsParams.map((ethLogParams) => eth_getLogs(rpcRequest, ethLogParams)),
    );
  }

  const flattenLogs = logs
    .flat()
    .sort((a, b) => Number((a.blockNumber ?? 0n) - (b.blockNumber ?? 0n)));
  return parseEventLogs({
    events: resolvedEvents,
    logs: flattenLogs,
  });
}

async function getLogsFromInsight(options: {
  params: GetLogsParamsExtra;
  contract: ThirdwebContract<Abi>;
}): Promise<Log[]> {
  const { params, contract } = options;

  const fromBlock =
    typeof params.fromBlock === "bigint" ? Number(params.fromBlock) : undefined;

  const toBlock =
    typeof params.toBlock === "bigint" ? Number(params.toBlock) : undefined;

  const r = await getContractEventsInsight({
    chains: [contract.chain],
    client: contract.client,
    contractAddress: contract.address,
    queryOptions: {
      filter_block_hash: params.blockHash,
      filter_block_number_gte: fromBlock,
      filter_block_number_lte: toBlock,
      filter_topic_0: params.topics?.[0] as Hex | undefined,
      filter_topic_1: params.topics?.[1] as Hex | undefined,
      filter_topic_2: params.topics?.[2] as Hex | undefined,
      filter_topic_3: params.topics?.[3] as Hex | undefined,
      limit: 500,
    },
  });

  return toLog(r);
}

function toLog(r: ContractEvent[]) {
  const cleanedEventData = r.map((tx) => ({
    address: tx.address,
    blockHash: tx.block_hash as Hex,
    blockNumber: numberToHex(Number(tx.block_number)),
    blockTimestamp: tx.block_timestamp,
    chainId: tx.chain_id,
    data: tx.data as Hex,
    logIndex: numberToHex(tx.log_index),
    topics: tx.topics as [`0x${string}`, ...`0x${string}`[]] | [] | undefined,
    transactionHash: tx.transaction_hash as Hex,
    transactionIndex: numberToHex(tx.transaction_index),
    ...(tx.decoded
      ? {
          args: {
            ...tx.decoded.indexed_params,
            ...tx.decoded.non_indexed_params,
          },
          eventName: tx.decoded.name,
        }
      : {}),
  }));

  return cleanedEventData
    .map((e) => formatLog(e))
    .sort((a, b) => Number((a.blockNumber ?? 0n) - (b.blockNumber ?? 0n)));
}
