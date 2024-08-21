import { type AbiEvent, formatAbiItem } from "abitype";
import { useMemo } from "react";
import {
  type PreparedEvent,
  type ThirdwebContract,
  prepareEvent,
} from "thirdweb";
import { useContractEvents } from "thirdweb/react";
import { useResolveContractAbi } from "./useResolveContractAbi";

export interface InternalTransaction {
  transactionHash: string;
  blockNumber: bigint;
  events: Array<{
    logIndex: number;
    address: string;
    eventName: string;
    args: readonly unknown[] | Record<string, unknown>;
  }>;
}

export function useActivity(contract: ThirdwebContract, autoUpdate?: boolean) {
  const abiQuery = useResolveContractAbi(contract);

  // Get all the PreprareEvents from the contract abis
  const events: PreparedEvent<AbiEvent>[] = useMemo(() => {
    const eventsItems = (abiQuery.data || []).filter((o) => o.type === "event");
    const eventSignatures = eventsItems.map((event) => formatAbiItem(event));
    return eventSignatures.map((signature) =>
      prepareEvent({ signature: signature as `event ${string}` }),
    );
  }, [abiQuery.data]);

  const eventsQuery = useContractEvents({
    contract,
    events,
    blockRange: 20000,
    watch: autoUpdate,
  });

  return useMemo(() => {
    if (!eventsQuery.data) {
      return [];
    }
    const obj = eventsQuery.data.slice(0, 100).reduce(
      (acc, curr) => {
        if (acc[curr.transactionHash]) {
          acc[curr.transactionHash].events.push(curr);
          acc[curr.transactionHash].events.sort(
            (a, b) => b.logIndex - a.logIndex,
          );
          if (acc[curr.transactionHash].blockNumber > curr.blockNumber) {
            acc[curr.transactionHash].blockNumber = curr.blockNumber;
          }
        } else {
          acc[curr.transactionHash] = {
            transactionHash: curr.transactionHash,
            blockNumber: curr.blockNumber,
            events: [curr],
          };
        }
        return acc;
      },
      {} as Record<string, InternalTransaction>,
    );
    return Object.values(obj).sort((a, b) =>
      a.blockNumber > b.blockNumber ? -1 : 1,
    );
  }, [eventsQuery.data]);
}
