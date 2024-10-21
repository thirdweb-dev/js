import { NextResponse } from "next/server";
import type { ChainMetadata } from "thirdweb/chains";
import invariant from "tiny-invariant";

export const maxDuration = 300; // max timeout 300 seconds (5min)
export const revalidate = 86400; // Revalidate every 24 hours (86400 seconds)

export async function GET() {
  const bundlerServiceKey = process.env.BUNDLER_SERVICE_KEY;
  invariant(bundlerServiceKey, "BUNDLER_SERVICE_KEY is not set");

  const [aaChains, allChains] = await Promise.all([
    fetch("https://1.bundler.thirdweb.com/service/chains", {
      headers: {
        "Content-Type": "application/json",
        "x-service-api-key": bundlerServiceKey,
      },
    })
      .then((res) => res.json() as Promise<{ data: number[] }>)
      .catch((error) => {
        console.error(error);
        return { data: [] as number[] };
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

  const intersectedChains = allChains.data
    .filter((chain) =>
      aaChains.data.some((aaChainId) => aaChainId === chain.chainId),
    )
    .filter((c) => c.name)
    .sort((a, b) => a.name.localeCompare(b.name));

  return NextResponse.json({
    data: intersectedChains,
  });
}
