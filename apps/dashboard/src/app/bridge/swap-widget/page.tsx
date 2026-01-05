import type { Metadata } from "next";
import "@workspace/ui/global.css";
import type { SupportedFiatCurrency } from "thirdweb/react";
import { isValidCurrency } from "../_common/isValidCurrency";
import {
  onlyAddress,
  onlyNumber,
  parseQueryParams,
} from "../_common/parseQueryParams";
import { BridgeProvidersLite } from "../(general)/components/client/Providers.client";
import { SwapWidgetEmbed } from "./SwapWidgetEmbed.client";

const title = "thirdweb Swap: Cross-Chain Token Swaps";
const description =
  "Swap tokens across any chain with the best rates. Cross-chain swaps made simple with thirdweb.";

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

  // Buy token params
  const buyChainId = parseQueryParams(searchParams.buyChain, onlyNumber);
  const buyTokenAddress = parseQueryParams(
    searchParams.buyTokenAddress,
    onlyAddress,
  );
  const buyAmount = parseQueryParams(searchParams.buyAmount, (v) => v);

  // Sell token params
  const sellChainId = parseQueryParams(searchParams.sellChain, onlyNumber);
  const sellTokenAddress = parseQueryParams(
    searchParams.sellTokenAddress,
    onlyAddress,
  );
  const sellAmount = parseQueryParams(searchParams.sellAmount, (v) => v);

  // Optional params
  const showThirdwebBranding = parseQueryParams(
    searchParams.showThirdwebBranding,
    // biome-ignore lint/complexity/noUselessTernary: this is easier to understand
    (v) => (v === "false" ? false : true),
  );

  const persistTokenSelections = parseQueryParams(
    searchParams.persistTokenSelections,
    // biome-ignore lint/complexity/noUselessTernary: this is easier to understand
    (v) => (v === "false" ? false : true),
  );

  const theme =
    parseQueryParams(searchParams.theme, (v) =>
      v === "light" ? "light" : "dark",
    ) || "dark";

  const currency = parseQueryParams(searchParams.currency, (v) =>
    isValidCurrency(v) ? (v as SupportedFiatCurrency) : undefined,
  );

  return (
    <BridgeProvidersLite forcedTheme={theme}>
      <div className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
        <SwapWidgetEmbed
          buyChainId={buyChainId}
          buyTokenAddress={buyTokenAddress}
          buyAmount={buyAmount}
          sellChainId={sellChainId}
          sellTokenAddress={sellTokenAddress}
          sellAmount={sellAmount}
          showThirdwebBranding={showThirdwebBranding}
          theme={theme}
          currency={currency}
          persistTokenSelections={persistTokenSelections}
        />
      </div>
    </BridgeProvidersLite>
  );
}
