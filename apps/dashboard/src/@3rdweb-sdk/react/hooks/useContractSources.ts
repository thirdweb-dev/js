import { useQuery } from "@tanstack/react-query";
import type { ThirdwebContract } from "thirdweb";
import invariant from "tiny-invariant";

/**
 * Fetch all the .sol files (and their content) for a contract
 * We cannot reuse `getCompilerMetadata` from the SDK here because the `sources` field is omitted
 * because we are using `formatCompilerMetadata` in that method
 *
 * Which raises the question where we should do that in the first place
 */
export function useContractSources(contract?: ThirdwebContract) {
  return useQuery(
    [
      "dashboard-contract-sources",
      contract?.chain.id || "",
      contract?.address || "",
    ],
    async (): Promise<Array<{ filename: string; source: string }>> => {
      invariant(contract, "contract is required");
      const { address, chain } = contract;
      const response = await fetch(
        `https://contract.thirdweb.com/metadata/${chain.id}/${address}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      if (!response.ok) {
        const errorMsg = await response.json();
        throw new Error(
          errorMsg.message ||
            errorMsg.error ||
            "Failed to get compiler metadata",
        );
      }
      const data = await response.json();
      console.log({ data });
      const sources = data.sources || {};
      const arr = Object.keys(sources).map((key) => ({
        filename: key,
        source: sources[key]?.content || "",
      }));
      return arr;
    },
    { enabled: !!contract },
  );
}
