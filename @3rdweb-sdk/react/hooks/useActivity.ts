import { useContract, useContractEvents } from "@thirdweb-dev/react";
import { ContractEvent } from "@thirdweb-dev/sdk";
import { useMemo } from "react";

interface InternalTransaction {
  transactionHash: ContractEvent["transaction"]["transactionHash"];
  blockNumber: ContractEvent["transaction"]["blockNumber"];
  events: ContractEvent[];
}

export function useActivity(contractAddress?: string, autoUpdate?: boolean) {
  // const provider = useProvider();
  const contractQuery = useContract(contractAddress);

  const eventsQuery = useContractEvents(contractQuery.contract, undefined, {
    subscribe: autoUpdate,
    queryFilter: {
      fromBlock: -20000,
    },
  });

  return useMemo(() => {
    if (!eventsQuery.data) {
      return [];
    }

    const obj = eventsQuery.data.slice(0, 100).reduce(
      (acc, curr) => {
        if (acc[curr.transaction.transactionHash]) {
          acc[curr.transaction.transactionHash].events.push(curr);
          acc[curr.transaction.transactionHash].events.sort(
            (a: any, b: any) => b.transaction.logIndex - a.transaction.logIndex,
          );
          if (
            acc[curr.transaction.transactionHash].blockNumber >
            curr.transaction.blockNumber
          ) {
            acc[curr.transaction.transactionHash].blockNumber =
              curr.transaction.blockNumber;
          }
        } else {
          acc[curr.transaction.transactionHash] = {
            transactionHash: curr.transaction.transactionHash,
            blockNumber: curr.transaction.blockNumber,
            events: [curr],
          };
        }

        return acc;
      },
      {} as Record<string, InternalTransaction>,
    );
    return Object.values(obj).sort((a, b) => b.blockNumber - a.blockNumber);
  }, [eventsQuery.data]);
}
