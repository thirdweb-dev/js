import "server-only";

import { THIRDWEB_API_HOST } from "constants/urls";
import { ChainMetadataWithServices } from "../types/chain";
import { redirect } from "next/navigation";
// TEMPORARY
import xaiBanner from "./temp-assets/xai-banner.jpeg";
import baseBanner from "./temp-assets/base-banner.jpeg";
// END TEMPORARY

export async function getChain(
  chainIdOrSlug: string,
): Promise<ChainMetadataWithServices> {
  const res = await fetch(
    `${THIRDWEB_API_HOST}/v1/chains/${chainIdOrSlug}?includeServices=true`,
  );

  const result = await res.json();
  if (!result.data) {
    redirect("/404");
  }
  return result.data as ChainMetadataWithServices;
}

type ChainMetadata = Partial<{
  headerImgUrl: string;
  about: string;
  gasSponsored: boolean;
  verified: boolean;
}>;

// TEMPORARY
const chainMetaRecord = {
  // XAI
  660279: {
    headerImgUrl: xaiBanner.src,
    about:
      "Xai provides a user experience tailored for traditional gamers, abstracting web3 interaction on the backend. Game developers benefit from larger contract limits, while enjoying fast and cost-effective transactions similar to other Arbitrum chains. Xai ensures the same level of security as Ethereum and proudly operates as a completely carbon-neutral platform.",
    verified: true,
  },
  8453: {
    headerImgUrl: baseBanner.src,
    // base
    about:
      "Base is a secure, low-cost, builder-friendly Ethereum L2 built to bring the next billion users onchain.",
    gasSponsored: true,
    verified: true,
  },
} satisfies Record<number, ChainMetadata>;
// END TEMPORARY

export async function getChainMetadata(
  chainId: number,
): Promise<ChainMetadata | null> {
  // TODO: fetch this from the API
  if (chainId in chainMetaRecord) {
    return chainMetaRecord[chainId as keyof typeof chainMetaRecord];
  }
  return null;
}
