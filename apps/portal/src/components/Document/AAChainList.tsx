/* eslint-disable @next/next/no-img-element */
import { cn } from "@/lib/utils";
import type { ChainMetadata } from "thirdweb/chains";
import { getBaseUrl } from "../../lib/getBaseUrl";

async function getChains(): Promise<ChainMetadata[]> {
  try {
    const chains = await fetch(`${getBaseUrl()}/api/aa-chains`);
    if (!chains.ok) {
      return [];
    }
    const result = (await chains.json()) as { data: ChainMetadata[] };
    return result.data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function AAChainList() {
  const chains = await getChains();
  return (
    <div className={cn("my-4 rounded-lg border p-4")}>
      <ul className="grid grid-cols-1 gap-2 md:grid-cols-2">
        {chains?.map((chain) => (
          <li key={chain.name} className="flex items-center">
            {chain.name} ({chain.chainId})
          </li>
        ))}
      </ul>
    </div>
  );
}
