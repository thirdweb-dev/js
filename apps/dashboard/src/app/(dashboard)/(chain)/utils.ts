import "server-only";

import { redirect } from "next/navigation";
import type { ChainCTAProps } from "./[chain_id]/(chainPage)/components/server/cta-card";
import ancient8Banner from "./temp-assets/ancient8-banner.png";
// TEMPORARY
import baseBanner from "./temp-assets/base-banner.jpeg";
import superchainCTABG from "./temp-assets/cta-bg-superchain.png";
import xaiCTABg from "./temp-assets/cta-bg-xai-connect.png";
import mantleBanner from "./temp-assets/mantle-banner.jpeg";
import rootStockBanner from "./temp-assets/rootstock-banner.png";
import rootStockCTABG from "./temp-assets/rootstock-cta.png";
import vanarBanner from "./temp-assets/vanar-banner.png";
import vanarCTABG from "./temp-assets/vanar-cta.png";
import xaiBanner from "./temp-assets/xai-banner.jpg";
import type { ChainMetadataWithServices } from "./types/chain";

// END TEMPORARY

const THIRDWEB_API_HOST =
  process.env.NEXT_PUBLIC_THIRDWEB_API_HOST || "https://api.thirdweb.com";

export async function getChains() {
  const response = await fetch(
    `${THIRDWEB_API_HOST}/v1/chains?includeServices=true`,
    // revalidate every hour
    { next: { revalidate: 60 * 60 } },
  );

  if (!response.ok) {
    response.body?.cancel();
    throw new Error("Failed to fetch chains");
  }
  return (await response.json()).data as ChainMetadataWithServices[];
}

export async function getChain(
  chainIdOrSlug: string,
): Promise<ChainMetadataWithServices> {
  const res = await fetch(
    `${THIRDWEB_API_HOST}/v1/chains/${chainIdOrSlug}?includeServices=true`,
    // revalidate every 15 minutes
    { next: { revalidate: 15 * 60 } },
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
  cta: ChainCTAProps;
}>;

// TEMPORARY

const OP_CTA = {
  backgroundImageUrl: superchainCTABG.src,
  title: "Optimism Superchain App Accelerator",
  description:
    "Successful applicants receive gas grants for use across all supported Optimism Superchain networks. These grants can sponsor gas fees for any onchain activity using our Account Abstraction tools.",
  buttonText: "Apply now",
  buttonLink: "/dashboard/settings/gas-credits",
} satisfies ChainCTAProps;

const chainMetaRecord = {
  // XAI
  660279: {
    headerImgUrl: xaiBanner.src,
    about:
      "Xai was developed to enable real economies and open trade in the next generation of video games. With Xai, potentially billions of traditional gamers can own and trade valuable in-game items in their favorite games for the first time, without the need to use crypto-wallets.",

    cta: {
      title: "Unlock ultimate possibility with Xai Connect",
      backgroundImageUrl: xaiCTABg.src,
      buttonLink: "https://connect.xai.games",
      buttonText: "Learn more",
    },
  },
  // base
  8453: {
    headerImgUrl: baseBanner.src,
    about:
      "Base is a secure, low-cost, builder-friendly Ethereum L2 built to bring the next billion users onchain.",
    gasSponsored: true,

    cta: OP_CTA,
  },
  // optimism
  10: {
    cta: OP_CTA,
    gasSponsored: true,
  },
  // fraxtal
  252: {
    cta: OP_CTA,
    gasSponsored: true,
  },
  // zora
  7777777: {
    cta: OP_CTA,
    gasSponsored: true,
  },
  // mode
  34443: {
    cta: OP_CTA,
    gasSponsored: true,
  },
  // cyber
  7560: {
    cta: OP_CTA,
    gasSponsored: true,
  },
  // redstone
  690: {
    cta: OP_CTA,
    gasSponsored: true,
  },
  // ancient8
  888888888: {
    about:
      "Ancient8 is building an ETH gaming Layer 2 built with OP Stack, offering a suite of Web3 gaming infrastructure tools that serve as the distribution and marketing channel for games globally. With Space3 Game Publishing Platform, Ancient8 Gaming Guild, Reneverse Web3 Ads engine, A8ID, and Gosu Network, Ancient8 is dedicated to onboard millions of gamers to Web3 gaming, while providing unparalleled support to game developers looking to reach more players. Ancient8’s products have helped 100+ Web3 games and 200K+ users better navigate Web3.\n\nAncient8 has raised $10M in total financing from leading investors including Pantera, Dragonfly, Hashed, Makers Fund, Mechanism, Coinbase, IOSG, Jump and Animoca.",
    // TODO: add CTA
    headerImgUrl: ancient8Banner.src,
  },
  // mantle
  5000: {
    about:
      "A fast-growing, DAO-led web3 ecosystem whose mission is the mass adoption of token-governed technologies. Mantle Ecosystem comprises Mantle Network, an Ethereum layer 2; Mantle Governance, Mantle Treasury and Mantle LSP.",
    headerImgUrl: mantleBanner.src,
    // TODO: waiting on CTA copy
    // cta: {
    //   backgroundImageUrl: mantleCTA.src,
    //   title: "Title Goes Here",
    //   description: "Optional description goes here",
    //   buttonText: "Learn More",
    //   buttonLink: "https://www.mantle.xyz",
    // },
  },
  // rootstock
  30: {
    headerImgUrl: rootStockBanner.src,
    about:
      "Deploy EVM compatible smart contracts on Rootstock and leverage the security of the Bitcoin network.",
    cta: {
      backgroundImageUrl: rootStockCTABG.src,
      title: "Fully EVM-compatible Bitcoin L2",
      buttonLink: "https://rootstock.io/",
      buttonText: "Learn more",
    },
  },
  // vanar
  2040: {
    headerImgUrl: vanarBanner.src,
    about:
      "Discover VANAR – The future of blockchain technology tailored for global adoption. This cutting-edge, L1 EVM blockchain offers high-speed transactions and scalability, powered by Google's renewable energy sources. With a suite of apps, low fixed transaction costs and a zero-cost option for brands, VANAR makes blockchain scalable, accessible and affordable.",
    cta: {
      buttonLink: "https://docs.vanarchain.com",
      buttonText: "Learn more",
      backgroundImageUrl: vanarCTABG.src,
      title: "",
    },
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
