import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Bridge, NATIVE_TOKEN_ADDRESS } from "thirdweb";
import type { ChainMetadata } from "thirdweb/chains";
import { serverThirdwebClient } from "@/constants/thirdweb-client.server";
import { fetchChain } from "@/utils/fetchChain";
import { BridgePageUI } from "../../components/bridge-page";
import { generateTokenPairSlugs, getTokenPairData } from "./slug-map";

type Params = {
  "token-pair": string;
};

type PageProps = {
  params: Promise<Params>;
};

export async function generateStaticParams(): Promise<Params[]> {
  return generateTokenPairSlugs().map((slug) => ({
    "token-pair": slug,
  }));
}

export async function generateMetadata(
  props: PageProps,
): Promise<Metadata | undefined> {
  const params = await props.params;
  const tokenPair = params["token-pair"];
  const tokenMetadata = await getTokenMetadata(tokenPair).catch(
    () => undefined,
  );

  if (!tokenMetadata) {
    return undefined;
  }

  const title = getTitle(tokenMetadata);
  const description =
    "Bridge and swap 4500+ tokens across 85+ chains (Ethereum, Base, Optimism, Arbitrum, BNB & more). Best-price routing with near-instant finality";

  const result: Metadata = {
    title,
    description,
    openGraph: {
      title,
      description,
    },
  };

  return result;
}

export default async function Page(props: { params: Promise<Params> }) {
  const params = await props.params;

  const tokenMetadata = await getTokenMetadata(params["token-pair"]);
  if (!tokenMetadata) {
    redirect("/bridge");
  }

  const { fromToken, toToken, fromChain, toChain } = tokenMetadata;

  return (
    <BridgePageUI
      buyTab={{
        buyToken: {
          tokenAddress: toToken.address,
          chainId: toToken.chainId,
        },
      }}
      swapTab={{
        sellToken: {
          tokenAddress: fromToken.address,
          chainId: fromToken.chainId,
        },
        buyToken: {
          tokenAddress: toToken.address,
          chainId: toToken.chainId,
        },
      }}
      title={
        <h1 className="text-center text-2xl md:text-5xl font-semibold tracking-tighter text-balance max-w-5xl block mx-auto">
          {getTitle({
            fromToken,
            toToken,
            fromChain,
            toChain,
          })}
        </h1>
      }
    />
  );
}

function cleanedChainName(chainName: string) {
  return chainName.replaceAll("mainnet", "").replaceAll("Mainnet", "").trim();
}

function cleanTokenName(tokenName: string) {
  return tokenName.replaceAll("Token", "").replaceAll("token", "").trim();
}

async function getTokenMetadata(slug: string) {
  const tokenPairData = getTokenPairData(slug);
  if (!tokenPairData) {
    redirect("/bridge");
  }

  const [fromTokenTokens, toTokenTokens, fromChain, toChain] =
    await Promise.all([
      Bridge.tokens({
        client: serverThirdwebClient,
        chainId: tokenPairData.from.chainId,
        tokenAddress: tokenPairData.from.tokenAddress,
      }).catch(() => undefined),
      Bridge.tokens({
        client: serverThirdwebClient,
        chainId: tokenPairData.to.chainId,
        tokenAddress: tokenPairData.to.tokenAddress,
      }).catch(() => undefined),
      fetchChain(tokenPairData.from.chainId),
      fetchChain(tokenPairData.to.chainId),
    ]);

  const fromToken = fromTokenTokens?.[0];
  const toToken = toTokenTokens?.[0];

  if (!fromToken || !toToken || !fromChain || !toChain) {
    return undefined;
  }

  return {
    fromToken,
    toToken,
    fromChain,
    toChain,
  };
}

function getTitle(data: {
  fromToken: {
    name: string;
    symbol: string;
    address: string;
  };
  toToken: {
    name: string;
    symbol: string;
    address: string;
  };
  fromChain: ChainMetadata;
  toChain: ChainMetadata;
}) {
  const isSameChain = data.fromChain.chainId === data.toChain.chainId;
  const fromTokenName = cleanTokenName(data.fromToken.name);
  const toTokenName = cleanTokenName(data.toToken.name);

  const fromTokenFullName =
    fromTokenName === data.fromToken.symbol ||
    data.fromToken.address.toLowerCase() === NATIVE_TOKEN_ADDRESS.toLowerCase()
      ? data.fromToken.symbol
      : `${fromTokenName} (${data.fromToken.symbol})`;

  const toTokenFullName =
    toTokenName === data.toToken.symbol ||
    data.toToken.address.toLowerCase() === NATIVE_TOKEN_ADDRESS.toLowerCase()
      ? data.toToken.symbol
      : `${toTokenName} (${data.toToken.symbol})`;

  // if both symbol are same: Swap {symbol} from {fromChain} to {toChain}
  if (fromTokenFullName === toTokenFullName) {
    return `Swap ${fromTokenFullName} from ${cleanedChainName(data.fromChain.name)} to ${cleanedChainName(data.toChain.name)}`;
  }

  const line1 = `Swap ${fromTokenFullName} to ${toTokenFullName}`;
  const line2 = isSameChain
    ? `on ${cleanedChainName(data.fromChain.name)}`
    : `cross-chain from ${cleanedChainName(data.fromChain.name)} to ${cleanedChainName(data.toChain.name)}`;

  return `${line1} ${line2}`;
}
