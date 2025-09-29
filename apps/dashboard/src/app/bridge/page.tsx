import { cn } from "@workspace/ui/lib/utils";
import type { Metadata } from "next";
import type { Address } from "thirdweb";
import { defineChain } from "thirdweb/chains";
import { getContract } from "thirdweb/contract";
import { getCurrencyMetadata } from "thirdweb/extensions/erc20";
import { FaqSection } from "@/components/blocks/faq-section";
import { AppFooter } from "@/components/footers/app-footer";
import { BridgeVeil } from "./components/BridgeVeil";
import { PillLink } from "./components/client/pill-link";
import { UniversalBridgeEmbed } from "./components/client/UniversalBridgeEmbed";
import { PageHeader } from "./components/header";
import { bridgeAppThirdwebClient } from "./constants";

const title = "thirdweb Bridge: Buy, Bridge & Swap Crypto on 85+ Chains";
const description =
  "Bridge, swap, and on-ramp across 9M+ token routes on 85+ chains (Ethereum, Base, Optimism, Arbitrum, BNB & more). Best-price routing and near-instant fast finality";

export const metadata: Metadata = {
  description,
  openGraph: {
    description,
    title,
  },
  title,
};

export default async function BridgePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[]>>;
}) {
  const { chainId, tokenAddress, amount } = await searchParams;

  let symbol: string | undefined;
  let decimals: number | undefined;
  let tokenName: string | undefined;

  if (chainId && tokenAddress) {
    try {
      const metadata = await getCurrencyMetadata({
        contract: getContract({
          address: tokenAddress as Address,
          // eslint-disable-next-line no-restricted-syntax
          chain: defineChain(Number(chainId)),
          client: bridgeAppThirdwebClient,
        }),
      });
      ({ symbol, decimals, name: tokenName } = metadata);
    } catch (error) {
      console.warn("Failed to fetch token metadata:", error);
      // Continue with undefined values; the component should handle gracefully
    }
  }

  return (
    <div className="grow flex flex-col relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-dvh  md:h-[1200px] fade-in-0 animate-in duration-700">
        <BridgeVeil />
      </div>

      <div className="relative z-10">
        <PageHeader />

        <div className="h-20" />

        <div className="relative z-10">
          <div className="container">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tighter text-center leading-none text-pretty">
              Bridge and Swap tokens <br className="max-sm:hidden" /> across any
              chain, instantly
            </h1>

            <div className="flex-wrap flex gap-3 items-center justify-center">
              <DataPill>85+ Chains Supported</DataPill>
              <DataPill>3200+ Tokens Supported</DataPill>
              <DataPill>9+ Million Routes Available</DataPill>
            </div>
          </div>

          <div className="h-16" />

          <div className="flex grow items-center justify-center px-4 relative">
            <DotsBackgroundPattern />
            <UniversalBridgeEmbed
              amount={amount as string}
              chainId={chainId ? Number(chainId) : undefined}
              token={
                symbol && decimals && tokenName
                  ? {
                      address: tokenAddress as Address,
                      name: tokenName,
                      symbol,
                    }
                  : undefined
              }
            />
          </div>
        </div>

        <div className="h-32" />

        <div className="flex flex-col gap-4 items-center container">
          <PillLink
            href="https://portal.thirdweb.com/bridge"
            linkType="integrate-bridge"
          >
            Integrate Bridge in your apps in minutes, and start generating
            revenue
          </PillLink>

          <PillLink
            href="https://thirdweb.com/tokens"
            linkType="trending-tokens"
          >
            Discover Trending Tokens
          </PillLink>
        </div>

        <div className="h-32" />

        <div className="container max-w-2xl">
          <BridgeFaqSection />
        </div>

        <div className="h-32" />

        <div className="relative">
          <AppFooter />
        </div>
      </div>
    </div>
  );
}

function DataPill(props: { children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-1.5 text-foreground/50 text-xs bg-accent/30 backdrop-blur-lg border border-border/70 rounded-full px-3 py-1.5 hover:text-foreground transition-colors duration-300">
      {props.children}
    </p>
  );
}

function DotsBackgroundPattern(props: { className?: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute -inset-x-36 -inset-y-24 text-pink-700/30 dark:text-pink-500/20",
        props.className,
      )}
      style={{
        backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)",
        backgroundSize: "24px 24px",
        maskImage:
          "radial-gradient(ellipse 100% 100% at 50% 50%, black 30%, transparent 50%)",
      }}
    />
  );
}

const bridgeFaqs: Array<{ title: string; description: string }> = [
  {
    title: "What is bridging in crypto?",
    description:
      "Crypto bridging (cross-chain bridging) moves tokens between blockchains so you can use assets across networks. In thirdweb Bridge, connect your wallet, choose the source token/network and destination token/network, review the route and price, then confirm. Assets arrive after finality, often under ~10 seconds on fast routes, though timing depends on networks and congestion.",
  },
  {
    title: "How does crypto bridging work?",
    description:
      "Bridge smart contracts lock or burn tokens on the source chain and mint or release equivalents on the destination via verified cross-chain providers. thirdweb Bridge automatically finds the fastest, lowest-cost route and may use different mechanisms based on networks and liquidity. Arrival can range from seconds to minutes depending on finality; many routes complete in ~10 seconds",
  },
  {
    title: "What is a crypto asset swap?",
    description:
      "A crypto swap exchanges one token for another via a DEX or aggregator. thirdweb Bridge lets you bridge + swap in one step. For example, ETH on Ethereum to USDC on Base, by selecting your start and end tokens/networks and confirming.",
  },
  {
    title: "How can I get stablecoins like USDC or USDT?",
    description:
      "Use thirdweb Bridge to convert assets you hold into USDC or USDT on your chosen network: select your current token/network, pick the stablecoin (USDC, USDT, etc) on the destination, and confirm. You can also buy stablecoins with fiat in the Buy flow and bridge if needed. Always verify official token contract addresses.",
  },
  {
    title: "What is the cost of bridging and swapping?",
    description:
      "Costs include gas on each chain, bridge/liquidity provider fees, and any DEX swap fees or price impact. thirdweb Bridge compares routes and selects the best price route. Save by using lower-gas times or combining bridge + swap in one flow.",
  },
];

function BridgeFaqSection() {
  return <FaqSection faqs={bridgeFaqs} />;
}
