import { Button } from "@/components/ui/button";
import { TicketCheckIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { mapV4ChainToV5Chain } from "../../../../../contexts/map-chains";
import { StarButton } from "../../components/client/star-button";
import { getChain, getChainMetadata } from "../../utils";
import { AddChainToWallet } from "./components/client/add-chain-to-wallet";
import { ChainHeader } from "./components/server/chain-header";
import { SidebarContent } from "./components/server/sidebar-content";

// TODO: improve the behavior when clicking "Get started with thirdweb", currently just redirects to the dashboard

export async function generateMetadata({
  params,
}: { params: { chain_id: string } }): Promise<Metadata> {
  const chain = await getChain(params.chain_id);
  const sanitizedChainName = chain.name.replace("Mainnet", "").trim();
  const title = `${sanitizedChainName}: RPC and Chain Settings`;

  const description = `Use the best ${sanitizedChainName} RPC and add to your wallet. Discover the chain ID, native token, explorers, and ${
    chain.testnet && chain.faucets?.length ? "faucet options" : "more"
  }.`;

  return {
    title,
    description,
  };
}

// this is the dashboard layout file
export default async function ChainPageLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { chain_id: string };
}) {
  const chain = await getChain(params.chain_id);

  if (params.chain_id !== chain.slug) {
    redirect(chain.slug);
  }

  const chainMetadata = await getChainMetadata(chain.chainId);

  return (
    <div className="container flex flex-row h-full">
      <aside className="w-[280px] flex-shrink-0 hidden lg:block">
        <SidebarContent chain={chain} />
      </aside>
      <div className="flex flex-col w-full lg:px-6 lg:border-x pb-10">
        {/* Icon + Background */}
        <ChainHeader
          headerImageUrl={chainMetadata?.headerImgUrl}
          logoUrl={chain.icon?.url}
          chain={chain}
        />

        <div className="h-4 md:h-8" />

        <div className="flex flex-col gap-3 md:gap-2">
          {/* Gas Sponsored badge - Mobile */}
          {chainMetadata?.gasSponsored && (
            <div className="md:hidden flex">
              <GasSponseredBadge />
            </div>
          )}

          {/* Chain name */}
          <div className="flex flex-row gap-1.5 items-center">
            <h1 className="text-2xl font-semibold lg:text-3xl lg:font-semibold tracking-tight">
              {chain.name}
            </h1>

            {/* Favorite */}
            <StarButton
              chainId={chain.chainId}
              iconClassName="size-5"
              className="p-1"
            />

            {/* Gas Sponsored badge - Desktop */}
            {chainMetadata?.gasSponsored && (
              <div className="hidden md:block">
                <GasSponseredBadge />
              </div>
            )}
          </div>

          {/* description */}
          {chainMetadata?.about && (
            <p className="text-secondary-foreground text-sm lg:text-base mb-2">
              {chainMetadata.about}
            </p>
          )}

          {/* mobile action row */}
          <div className="sm:hidden w-full">
            <div className="grid grid-cols-2 gap-2">
              <AddChainToWallet
                chain={
                  // Do not include chain overrides for chain pages
                  // eslint-disable-next-line no-restricted-syntax
                  mapV4ChainToV5Chain(chain)
                }
              />
              <Button variant="primary">
                <Link href="https://thirdweb.com/dashboard" target="_blank">
                  Get started
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="h-8" />
        {children}
      </div>
    </div>
  );
}

function GasSponseredBadge() {
  return (
    <div className="flex items-center gap-2 rounded-full text-[hsl(334,81.12%,69.65%)] bg-[hsla(335,57%,51%,0.2)] px-2.5 py-1">
      <TicketCheckIcon className="size-4" />
      <span className="font-medium text-xs">Gas Sponsored</span>
    </div>
  );
}
