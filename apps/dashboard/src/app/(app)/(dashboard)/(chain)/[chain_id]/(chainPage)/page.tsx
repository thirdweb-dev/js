import { CircleAlertIcon } from "lucide-react";
import { getRawAccount } from "@/api/account/get-account";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { getChain, getCustomChainMetadata } from "../../utils";
import { fetchChainSeo } from "./apis/chain-seo";
import { BuyFundsSection } from "./components/client/BuyFundsSection";
import { ChainOverviewSection } from "./components/server/ChainOverviewSection";
import { ChainCTA } from "./components/server/cta-card";
import { ExplorersSection } from "./components/server/explorer-section";
import { FaucetSection } from "./components/server/FaucetSection";
import { FaqSection } from "./components/server/faq-section";
import { SupportedProductsSection } from "./components/server/SupportedProductsSection";

type Props = {
  params: Promise<{ chain_id: string }>;
};

export default async function Page(props: Props) {
  const params = await props.params;
  const chain = await getChain(params.chain_id);
  const customChainMetadata = getCustomChainMetadata(Number(params.chain_id));
  const chainSeo = await fetchChainSeo(Number(chain.chainId)).catch(
    () => undefined,
  );
  const client = getClientThirdwebClient();
  const isDeprecated = chain.status === "deprecated";
  const account = await getRawAccount();

  return (
    <div className="flex flex-col gap-10">
      {/* Custom CTA */}
      {(customChainMetadata?.cta?.title ||
        customChainMetadata?.cta?.description) && (
        <ChainCTA {...customChainMetadata.cta} />
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
        <BuyFundsSection chain={chain} />
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

      {chainSeo?.faqs && chainSeo.faqs.length > 0 && (
        <FaqSection faqs={chainSeo.faqs} />
      )}
    </div>
  );
}
