import type { Metadata } from "next";
import { NATIVE_TOKEN_ADDRESS } from "thirdweb";
import { UniversalBridgeEmbed } from "../(general)/components/client/UniversalBridgeEmbed";
import { bridgeStats } from "../(general)/data";
import "@workspace/ui/global.css";
import { NEXT_PUBLIC_BRIDGE_IFRAME_CLIENT_ID } from "@/constants/public-envs";
import { isValidCurrency } from "../_common/isValidCurrency";
import {
  onlyAddress,
  onlyNumber,
  parseQueryParams,
} from "../_common/parseQueryParams";
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

  // output is buy, input is sell
  const sellChain = parseQueryParams(searchParams.inputChain, onlyNumber);
  const sellCurrency = parseQueryParams(
    searchParams.inputCurrency,
    onlyAddress,
  );
  const sellAmount = parseQueryParams(
    searchParams.inputCurrencyAmount,
    onlyNumber,
  );

  const buyChain = parseQueryParams(searchParams.outputChain, onlyNumber);
  const buyCurrency = parseQueryParams(
    searchParams.outputCurrency,
    onlyAddress,
  );
  const buyAmount = parseQueryParams(
    searchParams.outputCurrencyAmount,
    onlyNumber,
  );

  const showThirdwebBranding = parseQueryParams(
    searchParams.showThirdwebBranding,
    (v) => v !== "false",
  );

  const persistTokenSelections =
    parseQueryParams(searchParams.persistTokenSelections, (v) =>
      v === "false" ? "false" : "true",
    ) || "true";

  const theme =
    parseQueryParams(searchParams.theme, (v) =>
      v === "light" ? "light" : "dark",
    ) || "dark";

  const currency = parseQueryParams(searchParams.currency, (v) =>
    isValidCurrency(v) ? v : undefined,
  );

  return (
    <Providers theme={theme}>
      <div className="flex items-center justify-center min-h-screen py-6 bg-background">
        <UniversalBridgeEmbed
          persistTokenSelections={persistTokenSelections === "true"}
          pageType="bridge-iframe"
          currency={currency}
          showThirdwebBranding={showThirdwebBranding}
          buyTab={{
            buyToken: buyChain
              ? {
                  chainId: buyChain,
                  tokenAddress: buyCurrency || NATIVE_TOKEN_ADDRESS,
                  amount:
                    buyAmount === undefined ? undefined : buyAmount.toString(),
                }
              : undefined,
          }}
          swapTab={{
            sellToken: sellChain
              ? {
                  chainId: sellChain,
                  tokenAddress: sellCurrency || NATIVE_TOKEN_ADDRESS,
                  amount:
                    sellAmount === undefined
                      ? undefined
                      : sellAmount.toString(),
                }
              : undefined,
            buyToken: buyChain
              ? {
                  chainId: buyChain,
                  tokenAddress: buyCurrency || NATIVE_TOKEN_ADDRESS,
                  amount:
                    buyAmount === undefined ? undefined : buyAmount.toString(),
                }
              : undefined,
          }}
        />
      </div>
    </Providers>
  );
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
