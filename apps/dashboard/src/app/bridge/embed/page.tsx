import type { Metadata } from "next";
import { isAddress, NATIVE_TOKEN_ADDRESS } from "thirdweb";
import { UniversalBridgeEmbed } from "../(general)/components/client/UniversalBridgeEmbed";
import { bridgeStats } from "../(general)/data";
import "@workspace/ui/global.css";
import { NEXT_PUBLIC_BRIDGE_IFRAME_CLIENT_ID } from "@/constants/public-envs";
import { BridgeProviders } from "../(general)/components/client/Providers.client";

const title = `thirdweb Bridge: Buy, Bridge & Swap Crypto on ${bridgeStats.supportedChains} Chains`;
const description = `Bridge and swap ${bridgeStats.supportedTokens} tokens across ${bridgeStats.supportedChains} chains (Ethereum, Base, Optimism, Arbitrum, BNB & more). Best-price routing with near-instant finality`;

export const metadata: Metadata = {
  description,
  openGraph: {
    description,
    title,
  },
  title,
};

type SearchParams = {
  [key: string]: string | string[] | undefined;
};

export default async function Page(props: {
  searchParams: Promise<SearchParams>;
}) {
  const searchParams = await props.searchParams;

  const onlyAddress = (v: string) => (isAddress(v) ? v : undefined);
  const onlyNumber = (v: string) =>
    Number.isNaN(Number(v)) ? undefined : Number(v);

  // output is buy, input is sell
  const sellChain = parse(searchParams.inputChain, onlyNumber);
  const sellCurrency = parse(searchParams.inputCurrency, onlyAddress);

  const buyChain = parse(searchParams.outputChain, onlyNumber);
  const buyCurrency = parse(searchParams.outputCurrency, onlyAddress);

  const theme =
    parse(searchParams.theme, (v) => (v === "light" ? "light" : "dark")) ||
    "dark";

  return (
    <Providers theme={theme}>
      <div className="flex items-center justify-center min-h-screen py-6 bg-background">
        <UniversalBridgeEmbed
          pageType="bridge-iframe"
          buyTab={{
            buyToken: buyChain
              ? {
                  chainId: buyChain,
                  tokenAddress: buyCurrency || NATIVE_TOKEN_ADDRESS,
                }
              : undefined,
          }}
          swapTab={{
            sellToken: sellChain
              ? {
                  chainId: sellChain,
                  tokenAddress: sellCurrency || NATIVE_TOKEN_ADDRESS,
                }
              : undefined,
            buyToken: buyChain
              ? {
                  chainId: buyChain,
                  tokenAddress: buyCurrency || NATIVE_TOKEN_ADDRESS,
                }
              : undefined,
          }}
        />
      </div>
    </Providers>
  );
}

function parse<T>(
  value: string | string[] | undefined,
  fn: (value: string) => T | undefined,
): T | undefined {
  if (typeof value === "string") {
    return fn(value);
  }
  return undefined;
}

function Providers({
  children,
  theme,
}: {
  children: React.ReactNode;
  theme: string;
}) {
  if (!NEXT_PUBLIC_BRIDGE_IFRAME_CLIENT_ID) {
    throw new Error("NEXT_PUBLIC_BRIDGE_IFRAME_CLIENT_ID is not set");
  }
  return (
    <BridgeProviders
      clientId={NEXT_PUBLIC_BRIDGE_IFRAME_CLIENT_ID}
      forcedTheme={theme}
    >
      {children}
    </BridgeProviders>
  );
}
