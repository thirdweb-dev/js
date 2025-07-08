import { ArrowUpRightIcon } from "lucide-react";
import type { Metadata } from "next";
import type { Address } from "thirdweb";
import { defineChain } from "thirdweb/chains";
import { getContract } from "thirdweb/contract";
import { getCurrencyMetadata } from "thirdweb/extensions/erc20";
import { UniversalBridgeEmbed } from "./components/client/UniversalBridgeEmbed";
import { bridgeAppThirdwebClient } from "./constants";

const title = "Universal Bridge: Swap, Bridge, and Onramp";
const description =
  "Swap, bridge, and on-ramp to any EVM chain with thirdweb's Universal Bridge.";

export const metadata: Metadata = {
  description,
  openGraph: {
    description,
    title,
  },
  title,
};

export default async function BridgePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[]>>;
}) {
  const { chainId, tokenAddress, amount } = await searchParams;

  let symbol: string | undefined;
  let decimals: number | undefined;
  let tokenName: string | undefined;

  if (chainId && tokenAddress) {
    try {
      const metadata = await getCurrencyMetadata({
        contract: getContract({
          address: tokenAddress as Address,
          // eslint-disable-next-line no-restricted-syntax
          chain: defineChain(Number(chainId)),
          client: bridgeAppThirdwebClient,
        }),
      });
      ({ symbol, decimals, name: tokenName } = metadata);
    } catch (error) {
      console.warn("Failed to fetch token metadata:", error);
      // Continue with undefined values; the component should handle gracefully
    }
  }

  return (
    <div className="relative mx-auto flex h-screen w-full flex-col items-center justify-center overflow-hidden border py-10">
      <main className="container z-10 flex justify-center">
        <UniversalBridgeEmbed
          amount={amount as string}
          chainId={chainId ? Number(chainId) : undefined}
          token={
            symbol && decimals && tokenName
              ? {
                  address: tokenAddress as Address,
                  name: tokenName,
                  symbol,
                }
              : undefined
          }
        />
      </main>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        alt=""
        className="-bottom-12 -right-12 pointer-events-none absolute lg:right-0 lg:bottom-0"
        src="/assets/login/background.svg"
      />

      <div className="absolute inset-x-0 bottom-8 z-20">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-lg border-2 border-green-500/20 bg-gradient-to-br from-card/80 to-card/50 p-4 shadow-[inset_0_1px_2px_0_rgba(0,0,0,0.02)]">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent" />
            <div className="relative flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col gap-1">
                <h3 className="font-medium text-lg">
                  Get Started with Universal Bridge
                </h3>
                <p className="text-muted-foreground text-sm">
                  Simple, instant, and secure payments across any token and
                  chain.
                </p>
              </div>
              <a
                className="inline-flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 font-medium text-sm text-white transition-all hover:bg-green-600/90 hover:shadow-sm"
                href="https://portal.thirdweb.com/payments"
                rel="noopener noreferrer"
                target="_blank"
              >
                Learn More
                <ArrowUpRightIcon className="size-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
