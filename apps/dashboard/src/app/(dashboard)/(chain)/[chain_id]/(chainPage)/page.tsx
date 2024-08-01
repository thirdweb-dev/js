import { Button } from "@/components/ui/button";
import { CircleAlertIcon, TicketCheckIcon } from "lucide-react";
import { StarButton } from "../../components/client/star-button";
import { getChain, getChainMetadata } from "../../utils";
import { ChainHeader } from "./components/chain-header";
import { BuyFundsSection } from "./components/server/BuyFundsSection";
import { ChainOverviewSection } from "./components/server/ChainOverviewSection";
import { ClaimChainSection } from "./components/server/ClaimChainSection";
import { ChainCTA } from "./components/server/cta-card";
import { ExplorersSection } from "./components/server/explorer-section";
import { FaucetsSection } from "./components/server/faucets-section";

export default async function Page(props: {
  params: { chain_id: string };
}) {
  const chain = await getChain(props.params.chain_id);
  const chainMetadata = await getChainMetadata(chain.chainId);
  const isDeprecated = chain.status === "deprecated";

  return (
    <div className="pb-10">
      {/* Icon + Background */}
      <ChainHeader
        headerImageUrl={chainMetadata?.headerImgUrl}
        logoUrl={chain.icon?.url}
        chainSlug={chain.slug}
      />

      <div className="h-4 md:h-8" />

      <div className="flex flex-col gap-2">
        {/* Gas Sponsored badge - Mobile */}
        {chainMetadata?.gasSponsored && (
          <div className="md:hidden flex">
            <GasSponseredBadge />
          </div>
        )}

        {/* Chain name */}
        <div className="flex flex-row gap-1.5 items-center">
          <h1 className="text-xl font-semibold lg:text-3xl lg:font-semibold tracking-tight">
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
        <Button className="sm:hidden w-full" variant="primary">
          Get started with thirdweb
        </Button>
      </div>

      <div className="h-8" />

      {/* Sections */}
      <div className="flex flex-col gap-12">
        {/* Custom CTA */}
        {chainMetadata?.cta && <ChainCTA {...chainMetadata.cta} />}

        {/* Deprecated Alert */}
        {isDeprecated && (
          <section className="bg-destructive rounded-lg text-destructive-foreground border border-destructive-foreground/20">
            <div className="container py-4 flex flex-row items-center gap-4">
              <CircleAlertIcon className="size-6 flex-shrink-0" />
              <h3 className="font-medium">
                This chain has been marked as deprecated. Some or all services
                may no longer function.
              </h3>
            </div>
          </section>
        )}

        {/* Buy Funds */}
        {chain.services.find((c) => c.service === "pay" && c.enabled) && (
          <BuyFundsSection chainId={chain.chainId} chainName={chain.name} />
        )}

        {/* Chain Overview */}
        <ChainOverviewSection chain={chain} />

        {/* Explorers */}
        {chain.explorers && chain.explorers.length > 0 && (
          <ExplorersSection explorers={chain.explorers} />
        )}

        {/* Faucets */}
        {chain.faucets && chain.faucets.length > 0 && (
          <FaucetsSection faucets={chain.faucets} />
        )}

        {/* Claim Chain */}
        {!chainMetadata && <ClaimChainSection />}
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
