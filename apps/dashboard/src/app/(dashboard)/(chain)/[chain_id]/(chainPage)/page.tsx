import { Button } from "@/components/ui/button";
import { fetchTopContracts } from "lib/search";
import { ArrowRightIcon, CircleAlertIcon } from "lucide-react";
import Link from "next/link";
import { getRawAccount } from "../../../../account/settings/getAccount";
import { TrendingContractSection } from "../../../trending/components/trending-table";
import { getChain, getChainMetadata } from "../../utils";
import { BuyFundsSection } from "./components/server/BuyFundsSection";
import { ChainOverviewSection } from "./components/server/ChainOverviewSection";
import { ClaimChainSection } from "./components/server/ClaimChainSection";
import { FaucetSection } from "./components/server/FaucetSection";
import { SupportedProductsSection } from "./components/server/SupportedProductsSection";
import { ChainCTA } from "./components/server/cta-card";
import { ExplorersSection } from "./components/server/explorer-section";

export default async function Page(props: {
  params: Promise<{ chain_id: string }>;
}) {
  const params = await props.params;
  const chain = await getChain(params.chain_id);
  const chainMetadata = await getChainMetadata(chain.chainId);
  const isDeprecated = chain.status === "deprecated";

  const [account, topContracts] = await Promise.all([
    getRawAccount(),
    fetchTopContracts({
      chainId: chain.chainId,
      perPage: 3,
      timeRange: "month",
    }),
  ]);

  return (
    <div className="flex flex-col gap-10">
      {/* Custom CTA */}
      {(chainMetadata?.cta?.title || chainMetadata?.cta?.description) && (
        <ChainCTA {...chainMetadata.cta} />
      )}

      {/* Deprecated Alert */}
      {isDeprecated && (
        <section className="rounded-lg border border-destructive-foreground/20 bg-destructive text-destructive-foreground">
          <div className="container flex flex-row items-center gap-4 py-4">
            <CircleAlertIcon className="size-6 flex-shrink-0" />
            <h3 className="font-medium">
              This chain has been marked as deprecated. Some or all services may
              no longer function.
            </h3>
          </div>
        </section>
      )}

      {/* Faucet / Buy Funds */}
      {chain.testnet ? (
        <FaucetSection chain={chain} twAccount={account} />
      ) : chain.services.find((c) => c.service === "pay" && c.enabled) ? (
        <BuyFundsSection chain={chain} />
      ) : null}

      {/* Chain Overview */}
      <ChainOverviewSection chain={chain} />

      {/* Explorers */}
      {chain.explorers && chain.explorers.length > 0 && (
        <ExplorersSection explorers={chain.explorers} />
      )}

      {topContracts.length > 0 && (
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold text-xl tracking-tight">
              Popular Contracts
            </h2>
            <Button asChild variant="outline">
              <Link
                href={`/${chain.slug}/popular`}
                className="flex items-center gap-2"
              >
                See All
                <ArrowRightIcon className="size-4" />
              </Link>
            </Button>
          </div>
          <TrendingContractSection
            topContracts={topContracts}
            chainId={chain.chainId}
            showPagination={false}
            searchParams={undefined}
          />
        </section>
      )}

      {chain.services.filter((s) => s.enabled).length > 0 && (
        <SupportedProductsSection services={chain.services} />
      )}

      {/* Claim Chain */}
      {!chainMetadata && <ClaimChainSection />}
    </div>
  );
}
