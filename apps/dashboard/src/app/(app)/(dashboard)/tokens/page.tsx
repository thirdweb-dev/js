import { BringToFrontIcon } from "lucide-react";
import type { Metadata } from "next";
import { unstable_cache } from "next/cache";
import { Bridge } from "thirdweb";
import { serverThirdwebClient } from "@/constants/thirdweb-client.server";
import { bridgeStats } from "../../../bridge/data";
import { PageHeader } from "./components/header";
import { TokenPage } from "./components/token-page";

const title = "Tokens | thirdweb";
const description = "Discover and swap any tokens on any chain, instantly";

export const metadata: Metadata = {
  description,
  openGraph: {
    description,
    title,
  },
  title,
};

export default async function Page() {
  const chains = await getBridgeSupportedChains();

  return (
    <div>
      <PageHeader />
      <div className="border-b py-10 ">
        <div className="container max-w-7xl">
          <div className="flex mb-4">
            <div className="rounded-full bg-card p-2.5 border">
              <BringToFrontIcon className="size-6 text-muted-foreground" />
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tighter mb-1">
            Discover and swap any tokens on any chain, instantly
          </h1>

          <p className="text-muted-foreground">
            {bridgeStats.supportedChains} chains, {bridgeStats.supportedTokens}{" "}
            tokens and {bridgeStats.supportedRoutes} routes supported
          </p>
        </div>
      </div>
      <TokenPage chains={chains} />
    </div>
  );
}

const getBridgeSupportedChains = unstable_cache(
  async () => {
    const chains = await Bridge.chains({ client: serverThirdwebClient });
    return chains;
  },
  ["bridge-supported-chains"],
  {
    revalidate: 60 * 60, // 1 hour
  },
);
