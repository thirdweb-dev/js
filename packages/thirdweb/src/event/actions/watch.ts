import {
  type Abi,
  type AbiEvent,
  type ExtractAbiEventNames,
  parseAbiItem,
} from "abitype";
import { type ContractEventInput } from "../event.js";
import { type GetLogsReturnType } from "viem";
import { eth_blockNumber, eth_getLogs, getRpcClient } from "../../rpc/index.js";
import type { ParseEvent } from "../../abi/types.js";

type WatchOptions<
  abi extends Abi,
  // if an abi has been passed into the contract, restrict the event to event names of the abi
  event extends abi extends { length: 0 }
    ? AbiEvent | string
    : ExtractAbiEventNames<abi>,
> = {
  onLogs: (
    logs: GetLogsReturnType<
      ParseEvent<abi, event>,
      [ParseEvent<abi, event>],
      undefined,
      bigint,
      bigint
    >,
  ) => void | undefined;
} & ContractEventInput<abi, event>;

export function watch<
  const abi extends Abi,
  // if an abi has been passed into the contract, restrict the event to event names of the abi
  const event extends abi extends { length: 0 }
    ? AbiEvent | string
    : ExtractAbiEventNames<abi>,
>(options: WatchOptions<abi, event>) {
  const rpcRequest = getRpcClient(options.contract.client, {
    chainId: options.contract.chainId,
  });

  let lastBlock = 0n;
  const parsedEvent: ParseEvent<abi, event> =
    typeof options.event === "string"
      ? (parseAbiItem(options.event as string) as ParseEvent<abi, event>)
      : (options.event as ParseEvent<abi, event>);
  if (parsedEvent.type !== "event") {
    throw new Error("Expected event");
  }
  eth_blockNumber(rpcRequest).then((x) => {
    lastBlock = x;
  });

  const interval = setInterval(async function () {
    const newBlock = await eth_blockNumber(rpcRequest);

    if (lastBlock === 0n) {
      lastBlock = newBlock;
    } else if (newBlock > lastBlock) {
      const logs = await eth_getLogs(rpcRequest, {
        fromBlock: lastBlock,
        toBlock: newBlock,
        address: options.contract.address,
        event: parsedEvent,
        // @ts-expect-error - missing | undefined in type
        args: options.params,
      });
      if (logs.length) {
        // @ts-expect-error - this works fine
        options.onLogs(logs);
      }

      lastBlock = newBlock;
    }
  }, 5000);

  // return the unsubscribe function
  return function () {
    clearInterval(interval);
  };
}
