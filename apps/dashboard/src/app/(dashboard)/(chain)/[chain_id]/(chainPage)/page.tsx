import { CircleAlertIcon } from "lucide-react";
import { getChain, getChainMetadata } from "../../utils";
import { BuyFundsSection } from "./components/server/BuyFundsSection";
import { ChainOverviewSection } from "./components/server/ChainOverviewSection";
import { ClaimChainSection } from "./components/server/ClaimChainSection";
import { ChainCTA } from "./components/server/cta-card";
import { ExplorersSection } from "./components/server/explorer-section";

export default async function Page(props: {
  params: { chain_id: string };
}) {
  const chain = await getChain(props.params.chain_id);
  const chainMetadata = await getChainMetadata(chain.chainId);
  const isDeprecated = chain.status === "deprecated";

  return (
    <div className="pb-10">
      {/* Sections */}
      <div className="flex flex-col gap-8">
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

        {/* Claim Chain */}
        {!chainMetadata && <ClaimChainSection />}
      </div>
    </div>
  );
}
