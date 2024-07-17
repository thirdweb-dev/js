import { CopyTextButton } from "@/components/ui/CopyTextButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  ArrowLeftIcon,
  CircleAlertIcon,
  ExternalLinkIcon,
  TicketCheckIcon,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { defineChain } from "thirdweb";
import { StarButton } from "../components/client/star-button";
import { ChainIcon } from "../components/server/chain-icon";
import { getChain, getChainMetadata } from "../utils";
import { AddChainToWallet } from "./components/client/add-chain-to-wallet";
import { ChainPageTabs } from "./components/client/tabs";
import { ChainCTA } from "./components/server/cta-card";
import { ExplorersSection } from "./components/server/explorer-section";
import { PrimaryInfoItem } from "./components/server/primary-info-item";

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

  // Enable faucet for all testnet chains.
  if (chain.testnet) {
    chain.services = [
      ...chain.services,
      {
        service: "faucet",
        enabled: true,
      },
    ];
  }

  if (params.chain_id !== chain.slug) {
    redirect(chain.slug);
  }
  const chainMetadata = await getChainMetadata(chain.chainId);
  // true if we *have* chainMetadata for the chain
  const isVerified = !!chainMetadata;
  const isDeprecated = chain.status === "deprecated";

  return (
    <>
      {isDeprecated && (
        <>
          <div className="bg-destructive">
            <div className="container py-4 flex flex-row items-center gap-4 text-white">
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
        <header
          className={cn(
            "py-6 md:py-8 border-b relative overflow-hidden",
            !chainMetadata?.gasSponsored && !isVerified && "md:pb-2",
            chainMetadata?.headerImgUrl && "md:py-10",
          )}
        >
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
            <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-b from-secondary/0 to-secondary/0 shadow-inner" />
          </div>

          {/* end header shaningans */}
          <div className="container flex flex-col md:flex-row justify-between md:items-center">
            <div className="flex flex-col gap-2 md:gap-6">
              <Link
                href="/chainlist"
                className={cn(
                  "text-foreground mt-4 inline-flex items-center gap-1",
                  // if we have a header image always light text
                  chainMetadata?.headerImgUrl && "text-white",
                )}
              >
                <ArrowLeftIcon className="size-5" />
                Chainlist
              </Link>

              <div className="flex gap-3 md:gap-5 items-center">
                {chain.icon?.url && (
                  <div
                    className={cn(
                      "bg-secondary p-2 border rounded-full overflow-hidden",
                    )}
                  >
                    <ChainIcon
                      iconUrl={chain.icon.url}
                      className={cn(
                        "size-14 md:size-18 rounded-full",
                        // if we it's "mantle" chain, invert the icon in dark mode
                        chain.chainId === 5000 && "dark:invert",
                      )}
                    />
                  </div>
                )}

                {/* Chain Name */}
                <h1
                  className={cn(
                    "font-semibold tracking-tighter text-4xl md:text-6xl",
                    // if we have a header image always light text
                    chainMetadata?.headerImgUrl && "text-white",
                  )}
                >
                  {chain.name}
                </h1>
                <StarButton chainId={chain.chainId} variant="secondary" />
              </div>

              <div className="flex flex-row gap-2 md:gap-4 items-center h-8 mb-4 md:mb-6">
                {chainMetadata?.gasSponsored && (
                  <Badge
                    variant="secondary"
                    className="text-accent-foreground pointer-events-none flex flex-row items-center h-full gap-1.5 border border-border"
                  >
                    <TicketCheckIcon className="size-5" />
                    <span className="font-bold text-xs uppercase">
                      gas sponsored
                    </span>
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex flex-row md:flex-col gap-4">
              <AddChainToWallet
                chain={defineChain(chain)}
                hasBackground={!!chainMetadata?.headerImgUrl}
              />
              {isVerified ? null : (
                <Button
                  className="w-full md:min-w-40"
                  variant="outline"
                  asChild
                >
                  <Link
                    className="gap-2"
                    href="https://share.hsforms.com/1o01TyfsZRAao2eCrzuXSVgea58c"
                    target="_blank"
                  >
                    <span>Claim this chain</span>
                    <ExternalLinkIcon className="size-3" />
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </header>

        {chainMetadata?.cta && <ChainCTA {...chainMetadata.cta} />}

        <main className="container pb-20 flex-1">
          {/* About section */}
          {chainMetadata?.about && (
            <>
              <div className="border rounded-xl px-4 py-4 bg-card relative">
                <h2 className="text-xl font-semibold tracking-tight mb-4">
                  About
                </h2>

                <div className="[&_p]:mb-3 [&_p]:text-card-foreground">
                  <pre className="text-wrap font-sans">
                    {chainMetadata.about}
                  </pre>
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
                <CopyTextButton
                  textToCopy={chain.chainId.toString()}
                  textToShow={chain.chainId.toString()}
                  tooltip="Copy Chain ID"
                  variant="ghost"
                  className="text-lg -translate-x-2 py-0.5"
                  copyIconPosition="right"
                />
              </PrimaryInfoItem>

              {/* Native token */}
              <PrimaryInfoItem title="Native Token">
                <div className="text-lg">
                  {chain.nativeCurrency.name} ({chain.nativeCurrency.symbol})
                </div>
              </PrimaryInfoItem>
            </div>

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
