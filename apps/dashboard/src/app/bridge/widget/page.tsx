import type { Metadata } from "next";
import { isAddress, NATIVE_TOKEN_ADDRESS } from "thirdweb";
import { UniversalBridgeEmbed } from "../(general)/components/client/UniversalBridgeEmbed";
import { bridgeStats } from "../(general)/data";
import "@workspace/ui/global.css";
import type { SupportedFiatCurrency } from "thirdweb/react";
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
  const sellAmount = parse(searchParams.inputCurrencyAmount, onlyNumber);

  const buyChain = parse(searchParams.outputChain, onlyNumber);
  const buyCurrency = parse(searchParams.outputCurrency, onlyAddress);
  const buyAmount = parse(searchParams.outputCurrencyAmount, onlyNumber);

  const showThirdwebBranding = parse(
    searchParams.showThirdwebBranding,
    (v) => v !== "false",
  );

  const persistTokenSelections =
    parse(searchParams.persistTokenSelections, (v) =>
      v === "false" ? "false" : "true",
    ) || "true";

  const theme =
    parse(searchParams.theme, (v) => (v === "light" ? "light" : "dark")) ||
    "dark";

  const currency = parse(searchParams.currency, (v) =>
    VALID_CURRENCIES.includes(v as SupportedFiatCurrency)
      ? (v as SupportedFiatCurrency)
      : undefined,
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

const VALID_CURRENCIES: SupportedFiatCurrency[] = [
  "USD",
  "EUR",
  "GBP",
  "JPY",
  "KRW",
  "CNY",
  "INR",
  "NOK",
  "SEK",
  "CHF",
  "AUD",
  "CAD",
  "NZD",
  "MXN",
  "BRL",
  "CLP",
  "CZK",
  "DKK",
  "HKD",
  "HUF",
  "IDR",
  "ILS",
  "ISK",
];

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
