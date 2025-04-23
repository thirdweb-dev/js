import { useMemo } from "react";
import type { ThirdwebContract } from "thirdweb";
import { useContractEvents } from "thirdweb/react";

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
  const eventsQuery = useContractEvents({
    contract,
    blockRange: 20000,
    watch: autoUpdate,
  });

  return useMemo(() => {
    if (!eventsQuery.data) {
      return [];
    }
    const obj = eventsQuery.data
      .slice().reverse()
      .slice(0, 100)
      .reduce(
        (acc, curr) => {
          const internalTx = acc[curr.transactionHash];
          if (internalTx) {
            internalTx.events.push(curr);
            internalTx.events.sort((a, b) => b.logIndex - a.logIndex);
            if (internalTx.blockNumber > curr.blockNumber) {
              internalTx.blockNumber = curr.blockNumber;
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
