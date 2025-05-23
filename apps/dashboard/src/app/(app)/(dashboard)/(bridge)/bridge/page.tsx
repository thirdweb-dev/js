import { ArrowUpRightIcon } from "lucide-react";
import type { Metadata } from "next";
import { getClientThirdwebClient } from "../../../../../@/constants/thirdweb-client.client";
import { UniversalBridgeEmbed } from "./components/client/UniversalBridgeEmbed";

const title = "Universal Bridge: Swap, Bridge, and On-Ramp";
const description =
  "Swap, bridge, and on-ramp to any EVM chain with thirdweb's Universal Bridge.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
  },
};

export default async function RoutesPage({
  searchParams,
}: { searchParams: Record<string, string | string[]> }) {
  const { chainId } = searchParams;
  const client = getClientThirdwebClient(undefined);
  return (
    <div className="relative mx-auto flex h-screen w-full flex-col items-center justify-center overflow-hidden border py-10">
      <main className="container z-10 flex justify-center">
        <UniversalBridgeEmbed
          chainId={chainId ? Number(chainId) : undefined}
          client={client}
        />
      </main>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        alt=""
        src="/assets/login/background.svg"
        className="-bottom-12 -right-12 pointer-events-none absolute lg:right-0 lg:bottom-0"
      />

      <div className="absolute bottom-24 inset-x-0 z-20">
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
                href="https://portal.thirdweb.com/pay"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 font-medium text-sm text-white transition-all hover:bg-green-600/90 hover:shadow-sm"
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
