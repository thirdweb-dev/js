/* eslint-disable react/forbid-dom-props */
import { cn } from "@/lib/utils";
import {
  ArrowLeftIcon,
  CircleAlertIcon,
  ExternalLinkIcon,
  TicketCheckIcon,
  VerifiedIcon,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { StarButton } from "../components/client/star-button";
import { getChain, getChainMetadata } from "./utils";
import { Metadata } from "next";
import { getAbsoluteUrl } from "lib/vercel-utils";
import { redirect } from "next/navigation";
import { ChainPageTabs } from "./components/client/tabs";
import { PrimaryInfoItem } from "./components/server/primary-info-item";
import { FaucetsSection } from "./components/server/faucets-section";
import { ExplorersSection } from "./components/server/explorer-section";
import { ChainIcon } from "../components/server/chain-icon";
import { Badge } from "@/components/ui/badge";

export async function generateMetadata(
  { params }: { params: { chain_id: string } },
  // parent: ResolvingMetadata,
): Promise<Metadata> {
  // read route params
  const chain = await getChain(params.chain_id);

  const sanitizedChainName = chain.name.replace("Mainnet", "").trim();

  const title = `${sanitizedChainName}: RPC and Chain Settings`;

  const description = `Use the best ${sanitizedChainName} RPC and add to your wallet. Discover the chain ID, native token, explorers, and ${
    chain.testnet && chain.faucets?.length ? "faucet options" : "more"
  }.`;

  return {
    title,
    description,
    openGraph: {
      images: [
        {
          url: `${getAbsoluteUrl()}/api/og/chain/${chain.chainId}`,
          width: 1200,
          height: 630,
          alt: `${sanitizedChainName} (${chain.nativeCurrency.symbol}) on thirdweb`,
        },
      ],
    },
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
  const isDeprecated = chain.status === "deprecated";

  return (
    <>
      {isDeprecated && (
        <>
          <div className="bg-destructive">
            <div className="container px-4 py-4 flex flex-row items-center gap-4 text-white">
              <CircleAlertIcon className="size-6 flex-shrink-0" />
              <h3 className="font-semibold">
                This chain has been marked as deprecated. Some or all services
                may no longer function.
              </h3>
            </div>
          </div>
          <Separator />
        </>
      )}
      <section className="flex flex-col h-full gap-8">
        {/* Header */}
        <header className="py-6 md:py-20 border-b relative overflow-hidden">
          {/* header background image shenanigans */}
          <div className="absolute top-0 left-0 right-0 bottom-0 -z-10">
            <div
              className="absolute top-0 left-0 right-0 bottom-0 bg-cover bg-center bg-no-repeat bg-secondary"
              style={
                chainMetadata?.headerImgUrl
                  ? {
                      backgroundImage: `url(${chainMetadata.headerImgUrl})`,
                    }
                  : undefined
              }
            />
            <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-b from-secondary/10 to-secondary/40 backdrop-blur-md lg:backdrop-blur-lg shadow-inner" />
          </div>
          {/* end header shaningans */}

          <div className="container px-4 flex flex-col gap-2 md:gap-6">
            <Link
              href="/chainlist"
              className="inline-flex items-center gap-1 text-foreground hover:underline mt-4"
            >
              <ArrowLeftIcon className="size-5" />
              Chainlist
            </Link>

            <div className="flex gap-3 md:gap-5 items-center">
              {chain.icon?.url && (
                <ChainIcon
                  iconUrl={chain.icon.url}
                  className="size-16 md:size-20 bg-secondary p-2 border-2 rounded-full"
                />
              )}

              {/* Chain Name */}

              <h1
                className={cn(
                  "font-semibold tracking-tighter text-4xl md:text-6xl",
                )}
              >
                {chain.name}
              </h1>
              <StarButton chainId={chain.chainId} variant="secondary" />
            </div>

            <div className="flex flex-row gap-2 md:gap-4 items-center h-8 mb-4 md:mb-6">
              {chainMetadata?.verified && (
                <Badge
                  variant="secondary"
                  className="text-accent-foreground pointer-events-none flex flex-row items-center h-full gap-1.5"
                >
                  <VerifiedIcon className="size-5" />
                  <span className="font-bold text-xs uppercase">verified</span>
                </Badge>
              )}
              {chainMetadata?.gasSponsored && (
                <Badge
                  variant="secondary"
                  className="text-accent-foreground pointer-events-none flex flex-row items-center h-full gap-1.5"
                >
                  <TicketCheckIcon className="size-5" />
                  <span className="font-bold text-xs uppercase">
                    gas sponsored
                  </span>
                </Badge>
              )}
            </div>
          </div>
        </header>
        <main className="container px-4 pb-20 flex-1">
          {/* About section */}
          {chainMetadata?.about && (
            <>
              <div className="border rounded-xl px-4 py-4 bg-card relative">
                <h2 className="text-xl font-semibold tracking-tight mb-4">
                  About
                </h2>

                <div className="[&_p]:mb-3 [&_p]:text-card-foreground max-w-[1000px]">
                  <p>{chainMetadata.about}</p>
                </div>
              </div>
              <div className="h-8" />
            </>
          )}
          {/* Chain Overview */}
          <div className="flex flex-col gap-10 pt-2">
            {/* Info Grid */}
            <div className="grid grid-cols-1 gap-4 lg:gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Info */}
              {chain.infoURL && (
                <PrimaryInfoItem title="Info">
                  <div className="flex items-center gap-1.5 hover:text-primary">
                    <Link
                      href={chain.infoURL}
                      target="_blank"
                      className="text-lg"
                    >
                      {new URL(chain.infoURL).hostname}
                    </Link>
                    <ExternalLinkIcon className="size-4" />
                  </div>
                </PrimaryInfoItem>
              )}

              {/* Chain Id */}
              <PrimaryInfoItem title="Chain ID">
                <div className="text-lg">{chain.chainId}</div>
              </PrimaryInfoItem>

              {/* Native token */}
              <PrimaryInfoItem title="Native Token">
                <div className="text-lg">
                  {chain.nativeCurrency.name} ({chain.nativeCurrency.symbol})
                </div>
              </PrimaryInfoItem>
            </div>

            {/* Faucets - will later move to dedicated tab */}
            {chain.faucets && chain.faucets.length > 0 && (
              <FaucetsSection faucets={chain.faucets} />
            )}

            {/* Explorers */}
            {chain.explorers && chain.explorers.length > 0 && (
              <ExplorersSection explorers={chain.explorers} />
            )}
          </div>
          <div className="h-14" />
          <ChainPageTabs
            chainSlug={params.chain_id}
            enabledServices={chain.services
              .filter((s) => s.enabled)
              .map((s) => s.service)}
          />
          <div className="h-8" />
          <div>{children}</div>
        </main>
      </section>
    </>
  );
}
