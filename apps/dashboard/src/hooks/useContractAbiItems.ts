import { useQuery } from "@tanstack/react-query";
import type { Abi } from "abitype";
import { thirdwebClient } from "lib/thirdweb-client";
import { useV5DashboardChain } from "lib/v5-adapter";
import { type Address, getContract } from "thirdweb";
import { resolveContractAbi } from "thirdweb/contract";

function dedupeAndSort(arr: string[]) {
  return [...new Set(arr)].sort();
}

/**
 * Returns read/write function and event names from a contract.
 *
 * @param chainId number
 * @param address Address
 * @returns readFunctions - List of read function names
 * @returns writeFunctinos - List of write function names
 * @returns events - List of event names
 */
export function useContractAbiItems(chainId: number, address: Address) {
  const chain = useV5DashboardChain(chainId);

  return useQuery({
    queryKey: ["contract-abi-items", chainId, address],
    initialData: {
      readFunctions: [],
      writeFunctions: [],
      events: [],
    },
    queryFn: async () => {
      const contract = getContract({
        client: thirdwebClient,
        chain,
        address,
      });

      const abi = await resolveContractAbi<Abi>(contract);

      const readFunctions: string[] = [];
      const writeFunctions: string[] = [];
      const events: string[] = [];
      for (const abiItem of abi) {
        if (abiItem.type === "function") {
          if (
            abiItem.stateMutability === "pure" ||
            abiItem.stateMutability === "view"
          ) {
            readFunctions.push(abiItem.name);
          } else {
            writeFunctions.push(abiItem.name);
          }
        } else if (abiItem.type === "event") {
          events.push(abiItem.name);
        }
      }
      return {
        readFunctions: dedupeAndSort(readFunctions),
        writeFunctions: dedupeAndSort(writeFunctions),
        events: dedupeAndSort(events),
      };
    },
  });
}
