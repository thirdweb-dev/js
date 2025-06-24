import { CircleAlertIcon } from "lucide-react";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { getRawAccount } from "../../../../account/settings/getAccount";
import { getChain, getChainMetadata } from "../../utils";
import { BuyFundsSection } from "./components/client/BuyFundsSection";
import NextSteps from "./components/client/NextSteps";
import { ChainOverviewSection } from "./components/server/ChainOverviewSection";
import { ClaimChainSection } from "./components/server/ClaimChainSection";
import { ChainCTA } from "./components/server/cta-card";
import { ExplorersSection } from "./components/server/explorer-section";
import { FaucetSection } from "./components/server/FaucetSection";
import { SupportedProductsSection } from "./components/server/SupportedProductsSection";

export default async function Page(props: {
  params: Promise<{ chain_id: string }>;
}) {
  const params = await props.params;
  const chain = await getChain(params.chain_id);
  const chainMetadata = await getChainMetadata(chain.chainId);
  const client = getClientThirdwebClient();
  const isDeprecated = chain.status === "deprecated";

  const account = await getRawAccount();

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
        <FaucetSection chain={chain} client={client} isLoggedIn={!!account} />
      ) : chain.services.find((c) => c.service === "pay" && c.enabled) ? (
        <BuyFundsSection chain={chain} client={client} />
      ) : null}

      {/* Chain Overview */}
      <ChainOverviewSection chain={chain} />

      {/* Explorers */}
      {chain.explorers && chain.explorers.length > 0 && (
        <ExplorersSection explorers={chain.explorers} />
      )}

      {chain.services.filter((s) => s.enabled).length > 0 && (
        <SupportedProductsSection services={chain.services} />
      )}
      {/*Next Steps */}
      <NextSteps chain={chain} />

      {/* Claim Chain */}
      {!chainMetadata && <ClaimChainSection />}
    </div>
  );
}
