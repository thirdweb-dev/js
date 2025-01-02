import { useThirdwebClient } from "@/constants/thirdweb.client";
import { useQuery } from "@tanstack/react-query";
import type { ThirdwebContract } from "thirdweb";
import { getCompilerMetadata } from "thirdweb/contract";
import { download } from "thirdweb/storage";
import invariant from "tiny-invariant";

// An example for a contract that has IPFS URIs in its metadata: abstract-testnet/0x8A24a7Df38fA5fCCcFD1259e90Fb6996fDdfcADa

export function useContractSources(contract?: ThirdwebContract) {
  const client = useThirdwebClient();
  return useQuery({
    queryKey: [
      "contract-sources",
      contract?.chain.id || "",
      contract?.address || "",
    ],
    queryFn: async (): Promise<Array<{ filename: string; source: string }>> => {
      invariant(contract, "contract is required");
      const data = await getCompilerMetadata(contract);
      if (!data.metadata.sources) {
        return [];
      }
      return await Promise.all(
        Object.entries(data.metadata.sources).map(async ([path, info]) => {
          if ("content" in info) {
            return {
              filename: path,
              source: info.content || "Could not find source for this file",
            };
          }
          const urls = info.urls;
          const ipfsLink = urls
            ? urls.find((url) => url.includes("ipfs"))
            : undefined;
          if (ipfsLink) {
            const ipfsHash = ipfsLink.split("ipfs/")[1];
            const source = await download({
              uri: `ipfs://${ipfsHash}`,
              client,
            })
              .then((r) => r.text())
              .catch(() => "Failed to fetch source from IPFS");
            return {
              filename: path,
              source,
            };
          }
          return {
            filename: path,
            source: "Could not find source for this file",
          };
        }),
      );
    },
    enabled: !!contract,
  });
}
