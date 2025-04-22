import { getThirdwebClient } from "@/constants/thirdweb.server";
import type { Metadata } from "next";
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
  const client = getThirdwebClient(undefined);
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
    </div>
  );
}
