import { NextResponse } from "next/server";
import type { ChainMetadata } from "thirdweb/chains";

export const maxDuration = 300; // max timeout 300 seconds (5min)
export const revalidate = 86400; // Revalidate every 24 hours (86400 seconds)

type ApiResponseType = {
  data: Record<string, { service: string; enabled: boolean }[]>;
};

export async function GET() {
  const [chainsWithServices, allChains] = await Promise.all([
    fetch("https://api.thirdweb.com/v1/chains/services", {
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json() as Promise<ApiResponseType>)
      .catch((error) => {
        console.error(error);
        return { data: {} as ApiResponseType["data"] };
      }),
    fetch("https://api.thirdweb.com/v1/chains", {
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json() as Promise<{ data: ChainMetadata[] }>)
      .catch((error) => {
        console.error(error);
        return { data: [] as ChainMetadata[] };
      }),
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

  return NextResponse.json({
    data: intersectedChains,
  });
}
