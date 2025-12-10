import type { Metadata } from "next";
import { isAddress, NATIVE_TOKEN_ADDRESS } from "thirdweb";
import { BridgePageUI } from "./components/bridge-page";
import { bridgeStats } from "./data";

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

  return (
    <BridgePageUI
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
      title={
        <h1 className="text-3xl md:text-5xl font-semibold tracking-tighter text-balance text-center">
          Bridge and Swap tokens <br className="max-sm:hidden" /> across any
          chain, instantly
        </h1>
      }
    />
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
