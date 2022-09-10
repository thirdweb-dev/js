import { contractKeys } from "../cache-keys";
import { useQueryWithNetwork } from "./query/useQueryWithNetwork";
import { useAllContractEvents, useContract } from "@thirdweb-dev/react";
import { ContractEvent } from "@thirdweb-dev/sdk";

interface InternalTransaction {
  transactionHash: ContractEvent["transaction"]["transactionHash"];
  blockNumber: ContractEvent["transaction"]["blockNumber"];
  events: ContractEvent[];
}

// interface ContractTransaction extends InternalTransaction {
//   // timestamp: number;
//   from: string;
//   value: BigNumber;
// }

export function useActivity(contractAddress?: string, autoUpdate?: boolean) {
  // const provider = useProvider();
  const contractQuery = useContract(contractAddress);

  const eventsQuery = useAllContractEvents(contractQuery.contract, {
    subscribe: autoUpdate,
  });

  return useQueryWithNetwork(
    contractKeys.activity(contractAddress),
    () => {
      if (!eventsQuery.data) {
        return [];
      }

      const obj = eventsQuery.data.slice(0, 100).reduce((acc, curr) => {
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
      }, {} as Record<string, InternalTransaction>);

      // TODO: We can get extra data about the transaction with provider, but provider hits rate limits

      /*
      const data: ContractTransaction[] = await Promise.all(
        Object.keys(obj).map(async (transactionHash) => {
          const transaction = obj[transactionHash];
          const transactionData = await provider.getTransaction(
            transactionHash,
          );

          // TODO: Block often returns null currently
          // const blockData = await provider.getBlock(transaction.blockNumber);

          return {
            ...transaction,
            // timestamp: blockData.timestamp,
            value: transactionData.value,
            from: transactionData.from,
          };
        }),
      );
      */

      return Object.values(obj).sort((a, b) => b.blockNumber - a.blockNumber);
    },
    {
      enabled: !!contractQuery && !!eventsQuery.data,
    },
  );
}
