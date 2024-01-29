import type { Abi, AbiEvent } from "abitype";
import type { GetLogsReturnType } from "viem";
import {
  eth_getLogs,
  getRpcClient,
  watchBlockNumber,
} from "../../rpc/index.js";
import { resolveAbi } from "./resolve-abi.js";
import type { ContractEvent } from "../event.js";
import {
  resolveContractAbi,
  type ThirdwebContract,
} from "../../contract/index.js";

export type WatchContractEventsOptions<
  abi extends Abi,
  abiEvent extends AbiEvent,
  contractEvent extends ContractEvent<abiEvent>,
> = {
  onLogs: (
    logs: GetLogsReturnType<undefined, abiEvent[], undefined, bigint, bigint>,
  ) => void | undefined;
  contract: ThirdwebContract<abi>;
  events?: contractEvent[] | undefined;
};

export function watchContractEvents<
  const abi extends Abi,
  const abiEvent extends AbiEvent,
  const contractEvent extends ContractEvent<abiEvent>,
>(options: WatchContractEventsOptions<abi, abiEvent, contractEvent>) {
  const rpcRequest = getRpcClient(options.contract);
  const resolveAbiPromise = options.events
    ? Promise.all(options.events.map((e) => resolveAbi(e)))
    : // if we don't have events passed then resolve the abi for the contract -> all events!
      (resolveContractAbi(options.contract).then((abi) =>
        abi.filter((item) => item.type === "event"),
      ) as Promise<abiEvent[]>);

  // returning this returns the underlying "unwatch" function
  return watchBlockNumber({
    ...options.contract,
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
      })) as GetLogsReturnType<
        undefined,
        abiEvent[],
        undefined,
        bigint,
        bigint
      >;
      // if there were any logs associated with our event(s)
      if (logs.length) {
        options.onLogs(logs);
      }
    },
  });
}
