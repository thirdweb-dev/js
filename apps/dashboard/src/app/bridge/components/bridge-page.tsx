import type { Format } from "@number-flow/react";
import { cn } from "@workspace/ui/lib/utils";
import Image, { type StaticImageData } from "next/image";
import type { BuyAndSwapEmbedProps } from "@/components/blocks/BuyAndSwapEmbed";
import { FaqAccordion } from "@/components/blocks/faq-section";
import ChainsImage from "../assets/chains.png";
import RoutesImage from "../assets/routes.png";
import TokensImage from "../assets/tokens.png";
import { bridgeStats, bridgeStatsNumbers } from "../data";
import { AnimatedNumbers } from "./client/animated-numbers";
import { UniversalBridgeEmbed } from "./client/UniversalBridgeEmbed";
import { BridgePageHeader } from "./header";

export function BridgePageUI(props: {
  title: React.ReactNode;
  buyTab: BuyAndSwapEmbedProps["buyTab"];
  swapTab: BuyAndSwapEmbedProps["swapTab"];
}) {
  return (
    <div className="grow flex flex-col">
      <BridgePageHeader />

      <div className="flex grow items-center justify-center px-4 relative pt-12 pb-20 lg:py-28 min-h-[calc(100dvh-60px)] overflow-hidden">
        <DotsBackgroundPattern />
        <UniversalBridgeEmbed buyTab={props.buyTab} swapTab={props.swapTab} />
      </div>

      <HeadingSection title={props.title} />

      <div className="h-20 lg:h-40" />

      <BridgeFaqSection />

      <div className="h-32" />
    </div>
  );
}

function HeadingSection(props: { title: React.ReactNode }) {
  return (
    <div className="container">
      <div className="mb-3 lg:mb-6">{props.title}</div>

      <p className="text-muted-foreground text-sm text-pretty text-center lg:text-lg mb-6 lg:mb-8">
        Seamlessly move your assets across {bridgeStats.supportedChains} chains
        with the best rates and fastest execution
      </p>

      <div className="flex gap-3 items-center lg:justify-center flex-wrap">
        <DataSquare
          data={bridgeStatsNumbers.supportedChains}
          label="Chains Supported"
          src={ChainsImage}
        />
        <DataSquare
          data={bridgeStatsNumbers.supportedTokens}
          label="Tokens Supported"
          src={TokensImage}
          format={{ notation: "compact" }}
        />
        <DataSquare
          data={bridgeStatsNumbers.supportedRoutes}
          format={{ notation: "compact" }}
          label="Routes Available"
          src={RoutesImage}
        />
      </div>
    </div>
  );
}

function DataSquare(props: {
  data: number;
  label: string;
  src: StaticImageData;
  format?: Format;
  imageClassName?: string;
}) {
  return (
    <div className="py-2 lg:py-0 size-full lg:size-[220px] rounded-xl border hover:bg-card bg-card/50 relative shrink-0 overflow-hidden">
      <div className="p-4">
        <div className="flex items-center gap-1 text-3xl lg:text-5xl font-medium tracking-tight font-mono mb-1 h-[45px] lg:h-[56px]">
          <AnimatedNumbers
            value={props.data}
            format={props.format}
            suffix="+"
          />
        </div>
        <p className="text-sm text-foreground">{props.label}</p>
      </div>
      <Image
        draggable={false}
        src={props.src}
        className={cn(
          "object-cover h-full lg:h-auto absolute right-0 top-0 bottom-0 left-1/2 lg:left-0 lg:top-auto invert dark:invert-0 opacity-50 lg:opacity-100",
          props.imageClassName,
        )}
        alt=""
      />
    </div>
  );
}

function DotsBackgroundPattern(props: { className?: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute -inset-x-36 -inset-y-24 text-foreground/20 dark:text-muted-foreground/20 hidden lg:block",
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
  return (
    <section className="container max-w-2xl">
      <h2 className="text-2xl md:text-3xl font-semibold mb-4 lg:mb-8 tracking-tight text-center">
        Frequently Asked Questions
      </h2>
      <FaqAccordion faqs={bridgeFaqs} />
    </section>
  );
}
