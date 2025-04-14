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
import { type Log, formatLog } from "viem";
import type { Chain } from "../../chains/types.js";
import { getChainServices } from "../../chains/utils.js";
import type { ThirdwebClient } from "../../client/client.js";
import { resolveContractAbi } from "../../contract/actions/resolve-abi.js";
import type { ThirdwebContract } from "../../contract/contract.js";
import { eth_blockNumber } from "../../rpc/actions/eth_blockNumber.js";
import {
  type GetLogsBlockParams,
  type GetLogsParams,
  eth_getLogs,
} from "../../rpc/actions/eth_getLogs.js";
import { getRpcClient } from "../../rpc/rpc.js";
import { getAddress } from "../../utils/address.js";
import { getThirdwebDomains } from "../../utils/domains.js";
import { type Hex, numberToHex } from "../../utils/encoding/hex.js";
import { getClientFetch } from "../../utils/fetch.js";
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
          signature: `${e?.abiEvent.name}(${e?.abiEvent.inputs.map((i) => i.type).join(",")})`,
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
            params: p,
            chain: contract.chain,
            client: contract.client,
          }),
        ),
      );
    } catch {
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
    logs: flattenLogs,
    events: resolvedEvents,
  });
}

async function getLogsFromInsight(options: {
  params: GetLogsParamsExtra;
  chain: Chain;
  client: ThirdwebClient;
  signature?: string;
}): Promise<Log[]> {
  const { params, chain, client, signature } = options;

  const chainServices = await getChainServices(chain);
  const insightEnabled = chainServices.some(
    (c) => c.service === "insight" && c.enabled,
  );

  if (!insightEnabled) {
    throw new Error(`Insight is not available for chainId ${chain.id}`);
  }

  try {
    let baseUrl = `https://${getThirdwebDomains().insight}/v1/events`;
    if (params.address) {
      baseUrl += `/${params.address}`;
      if (signature) {
        baseUrl += `/${signature}`;
      }
    }
    const url = new URL(baseUrl);

    url.searchParams.set("chain", chain.id.toString());
    url.searchParams.set("limit", "500"); // this is max limit on insight

    if (params.blockHash) {
      url.searchParams.set("filter_block_hash", params.blockHash);
    } else {
      if (params.fromBlock) {
        const fromBlock =
          typeof params.fromBlock === "bigint"
            ? numberToHex(params.fromBlock)
            : params.fromBlock;

        url.searchParams.set("filter_block_number_gte", fromBlock);
      }
      if (params.toBlock) {
        const toBlock =
          typeof params.toBlock === "bigint"
            ? numberToHex(params.toBlock)
            : params.toBlock;

        url.searchParams.set("filter_block_number_lte", toBlock);
      }
    }

    if (params.topics) {
      const args = params.topics.slice(1);
      for (const [i, a] of args.entries()) {
        if (a) {
          url.searchParams.set(`filter_topic_${i + 1}`, a as Hex);
        }
      }
    }

    const clientFetch = getClientFetch(client);
    const result = await clientFetch(url.toString());
    const fetchedEventData = (await result.json()) as {
      data: {
        chain_id: number;
        block_number: number;
        block_hash: string;
        block_timestamp: string;
        transaction_hash: string;
        transaction_index: number;
        log_index: number;
        address: string;
        data: string;
        topics: string[];
      }[];
    };
    const cleanedEventData = fetchedEventData.data.map((tx) => ({
      chainId: tx.chain_id,
      blockNumber: numberToHex(tx.block_number),
      blockHash: tx.block_hash as Hex,
      blockTimestamp: tx.block_timestamp,
      transactionHash: tx.transaction_hash as Hex,
      transactionIndex: numberToHex(tx.transaction_index),
      logIndex: numberToHex(tx.log_index),
      address: tx.address,
      data: tx.data as Hex,
      topics: tx.topics as [`0x${string}`, ...`0x${string}`[]] | [] | undefined,
    }));

    return cleanedEventData.map((e) => formatLog(e));
  } catch {
    throw new Error("Error fetching events from insight");
  }
}
