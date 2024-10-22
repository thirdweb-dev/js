/* eslint-disable @next/next/no-img-element */
import { cn } from "@/lib/utils";
import type { ChainMetadata } from "thirdweb/chains";

type ApiResponseType = {
  data: Record<string, { service: string; enabled: boolean }[]>;
};

async function getChains(): Promise<ChainMetadata[]> {
  try {
    const [chainsWithServices, allChains] = await Promise.all([
      fetch("https://api.thirdweb.com/v1/chains/services", {
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.json() as Promise<ApiResponseType>),
      fetch("https://api.thirdweb.com/v1/chains", {
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.json() as Promise<{ data: ChainMetadata[] }>),
    ]);

    const aaChains = Object.entries(chainsWithServices.data)
      .filter(([, services]) =>
        services.some(
          (service) =>
            service.service === "account-abstraction" && service.enabled,
        ),
      )
      .map(([chainId]) => Number(chainId));

    const intersectedChains = allChains.data
      .filter((chain) =>
        aaChains.some((aaChainId) => aaChainId === chain.chainId),
      )
      .filter((c) => c.name)
      .sort((a, b) => a.name.localeCompare(b.name));
    return intersectedChains;
  } catch (error) {
    console.error("Failed to fetch chains", error);
    throw error;
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
