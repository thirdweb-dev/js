import "server-only";

import { notFound } from "next/navigation";
import type { ChainCTAProps } from "./[chain_id]/(chainPage)/components/server/cta-card";
import zeroGCTA from "./temp-assets/0gCTA.png";
import zeroGBanner from "./temp-assets/0gLabsBanner.png";
import alephZeroBaner from "./temp-assets/AlephZeroBanner.jpg";
import alephZeroCTA from "./temp-assets/AlephZeroCTA.jpg";
import ancient8Banner from "./temp-assets/ancient8-banner.png";
import assetChainBanner from "./temp-assets/assetChainBanner.png";
import assetChainCTABG from "./temp-assets/assetChainCTABanner.png";

// TEMPORARY
import baseBanner from "./temp-assets/base-banner.jpeg";
import superchainCTABG from "./temp-assets/cta-bg-superchain.png";
import xaiCTABg from "./temp-assets/cta-bg-xai-connect.png";
import thirdwebCTA from "./temp-assets/cta-thirdweb.png";
import lumiaCTA from "./temp-assets/lumia-cta.png";
import lumiaBanner from "./temp-assets/lumiaBanner.png";
import mantleBanner from "./temp-assets/mantle.png";
import plumeBanner from "./temp-assets/plumeBanner.png";
import plumeCTA from "./temp-assets/plumeCTA.png";
import rootStockBanner from "./temp-assets/rootstock-banner.png";
import rootStockCTABG from "./temp-assets/rootstock-cta.png";
import shidoBanner from "./temp-assets/shidoBanner.png";
import shidoCta from "./temp-assets/shidoCta.png";
import soneiumBanner from "./temp-assets/soneiumBanner.png";
import superpositionBanner from "./temp-assets/superpositionBanner.png";
import superpositionCTA from "./temp-assets/superpositionCTA.png";
import thirdwebBanner from "./temp-assets/thirdweb-banner.png";
import treasureBanner from "./temp-assets/treasureBanner.png";
import treasureCTA from "./temp-assets/treasureCta.png";
import vanarBanner from "./temp-assets/vanar-banner.png";
import vanarCTABG from "./temp-assets/vanar-cta.png";
import xaiBanner from "./temp-assets/xai-banner.jpg";
import zytronBanner from "./temp-assets/zytronBanner.png";
import zytronCTA from "./temp-assets/zytronCTA.jpg";

// END TEMPORARY

import { API_SERVER_URL } from "@/constants/env";
import type { ChainMetadata } from "thirdweb/chains";
import type {
  ChainMetadataWithServices,
  ChainService,
  ChainServices,
} from "./types/chain";

export async function getChains() {
  const [chains, chainServices] = await Promise.all([
    fetch(
      `${API_SERVER_URL}/v1/chains`,
      // revalidate every 60 minutes
      { next: { revalidate: 60 * 60 } },
    ).then((res) => res.json()) as Promise<{ data: ChainMetadata[] }>,
    fetch(
      `${API_SERVER_URL}/v1/chains/services`,
      // revalidate every 60 minutes
      { next: { revalidate: 60 * 60 } },
    ).then((res) => res.json()) as Promise<{
      data: Record<number, Array<ChainService>>;
    }>,
  ]);

  if (!chains.data.length) {
    throw new Error("Failed to fetch chains");
  }
  return chains.data.map((c) => ({
    ...c,
    services: chainServices.data[c.chainId] || [],
  })) satisfies ChainMetadataWithServices[];
}

export async function getChain(
  chainIdOrSlug: string,
): Promise<ChainMetadataWithServices> {
  const [chain, chainServices] = await Promise.all([
    fetch(
      `${API_SERVER_URL}/v1/chains/${chainIdOrSlug}`,
      // revalidate every 15 minutes
      { next: { revalidate: 15 * 60 } },
    ).then((res) => res.json()) as Promise<{ data: ChainMetadata }>,
    fetch(
      `${API_SERVER_URL}/v1/chains/${chainIdOrSlug}/services`,
      // revalidate every 15 minutes
      { next: { revalidate: 15 * 60 } },
    ).then((res) => res.json()) as Promise<{ data: ChainServices }>,
  ]);

  if (!chain.data || !chainServices.data) {
    notFound();
  }
  return {
    ...chain.data,
    services: chainServices.data.services,
  } satisfies ChainMetadataWithServices;
}

type ExtraChainMetadata = Partial<{
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
  buttonLink: "/team/~/~/settings/credits",
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
    cta: OP_CTA,
    gasSponsored: true,
  },
  // mantle
  5000: {
    about: `Build dApps with exceptional UX, all while relying on Ethereum's unrivaled security, with our high-performance Ethereum layer-2 network built with modular architecture.`,
    headerImgUrl: mantleBanner.src,
    cta: {
      backgroundImageUrl: mantleBanner.src,
      title: "Reach out to bring your brilliant ideas to life",
      buttonText: "Learn More",
      buttonLink: "https://x.com/0xMantleDevs",
    },
    gasSponsored: true,
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
      title: "Fully EVM compatible L1 for Entertainment",
    },
  },
  // lumia Mainnet
  994873017: {
    headerImgUrl: lumiaBanner.src,
    about:
      "Lumia is a groundbreaking modular layer 2 blockchain designed to integrate real-world assets (RWA) with cross-chain liquidity. A seamless, efficient, and scalable aggregation layer that unifies liquidity from both centralized (CEX) and decentralized exchanges (DEX) to provide builders with immediate access to the biggest markets in Web3.",
    cta: {
      backgroundImageUrl: lumiaCTA.src,
      title: "",
      buttonLink: "https://docs.lumia.org/",
      buttonText: "Learn more",
    },
  },
  // Superposition Testnet
  98985: {
    headerImgUrl: superpositionBanner.src,
    about:
      "Superposition is the first blockchain that pays you to use it. It is a DeFi native Layer-3 that focuses on novel incentives and order-flow for growth and value capture for developers and users alike.\n\nSuperpositions includes a native on-chain orderbook with faster execution speeds through Stylus, providing shared and permissionless liquidity for all apps onchain, and Super Assets, which pay yield when you both hold and use them.",
    cta: {
      backgroundImageUrl: superpositionCTA.src,
      title: "The Blockchain that pays you to use it",
      buttonLink: "https://superposition.so/",
      buttonText: "Learn more",
    },
  },
  // Superposition Mainnet
  55244: {
    headerImgUrl: superpositionBanner.src,
    about:
      "Superposition is the first blockchain that pays you to use it. It is a DeFi native Layer-3 that focuses on novel incentives and order-flow for growth and value capture for developers and users alike.\n\nSuperpositions includes a native on-chain orderbook with faster execution speeds through Stylus, providing shared and permissionless liquidity for all apps onchain, and Super Assets, which pay yield when you both hold and use them.",
    cta: {
      backgroundImageUrl: superpositionCTA.src,
      title: "The Blockchain that pays you to use it",
      buttonLink: "https://superposition.so/",
      buttonText: "Learn more",
    },
  },
  // Aleph 0 Mainnet
  41455: {
    headerImgUrl: alephZeroBaner.src,
    about:
      "Aleph Zero is a privacy-enhancing blockchain ecosystem boasting a WASM L1 and an EVM L2 that offer instant transactions, the fastest ZK-based privacy features, and a seamless developer experience.",
    cta: {
      backgroundImageUrl: alephZeroCTA.src,
      title: "See how Aleph Zero redefines EVM privacy",
      buttonLink: "https://zkos.alephzero.org/",
      buttonText: "Learn more",
    },
  },
  // B3 Mainnet
  8333: {
    headerImgUrl: thirdwebBanner.src,
    about:
      "Created by a team of Base/Coinbase alumni and OG ETH contributors, B3 is a horizontally scaled gaming ecosystem built on Base. \n\nOur rollup network settles on Base, ensuring B3 transactions inherit the security of the EVM.",
    cta: {
      backgroundImageUrl: thirdwebCTA.src,
      title: "",
      buttonLink: "https://b3.fun/",
      buttonText: "Learn more",
    },
  },
  //CampNetwork Testnet v2
  325000: {
    headerImgUrl: thirdwebBanner.src,
    about:
      "Camp Network is the user identity layer across blockchains. Camp aggregates online user data, enabling users to own and monetize their identity while helping teams better understand user behavior.",
    cta: {
      backgroundImageUrl: thirdwebCTA.src,
      title: "",
      buttonLink: "https://www.campnetwork.xyz/",
      buttonText: "Learn more",
    },
  },
  //Donatuz
  42026: {
    headerImgUrl: thirdwebBanner.src,
    about:
      "Monetize your passion, your way. Discover the freedom to grow with our creator-focused platform.",
    cta: OP_CTA,
    gasSponsored: true,
  },
  //Fuse
  122: {
    headerImgUrl: thirdwebBanner.src,
    about:
      "Build and grow on the leading web3 platform for business and finance, powered by a performant zkEVM tailor made to get millions of consumers on-chain.",
    cta: {
      backgroundImageUrl: thirdwebCTA.src,
      title: "",
      buttonLink: "https://www.fuse.io/",
      buttonText: "Learn more",
    },
  },
  //Gemuchain
  1903648807: {
    headerImgUrl: thirdwebBanner.src,
    about:
      "Is a new Layer 2 integrating Al, Cybersecurity, ZK and a new Consensus layer - Proof Of Longevity. It will protect projects from bad actors and practices including hacks, manipulations, MEV bots and more, penalize bad actors and reward good actors and long term holders, so unlike anything out there today.",
    cta: {
      backgroundImageUrl: thirdwebCTA.src,
      title: "",
      buttonLink: "https://gemuchain.io/",
      buttonText: "Learn more",
    },
  },
  //0G-Newton-Testnet
  16600: {
    headerImgUrl: zeroGBanner.src,
    about:
      "ZeroGravity (0G) is the first infinitely scalable and decentralized data availability layer with a built-in general-purpose storage layer.",
    cta: {
      backgroundImageUrl: zeroGCTA.src,
      title: "Unlock web3's full potential with 0G",
      buttonLink: "https://docs.0g.ai/0g-doc",
      buttonText: "Learn more",
    },
  },
  //Plume
  161221135: {
    headerImgUrl: plumeBanner.src,
    about:
      "Plume is the first modular L2 blockchain dedicated for all real-world assets (RWAs) that integrates asset tokenization and compliance providers directly into the chain. Our mission is to simplify the convoluted processes of RWA project deployment and offer investors a blockchain ecosystem to cross-pollinate and invest in various RWAs. In addition, Plume enables RWA composability through its thriving DeFi applications and provides access to high-quality buyers to increase liquidity for all tokenized RWAs.",
    cta: {
      backgroundImageUrl: plumeCTA.src,
      title: "Participate on the Testnet Now!",
      buttonLink: "https://miles.plumenetwork.xyz/",
      buttonText: "Learn more",
    },
  },
  //zkCandy
  302: {
    headerImgUrl: thirdwebBanner.src,
    about:
      "Explore our cutting-edge Layer2 Ethereum scaling ZK Chain built for gaming and entertainment with the latest zk-proof technology.",
    cta: {
      backgroundImageUrl: thirdwebCTA.src,
      title: "",
      buttonLink: "https://zkcandy.io/",
      buttonText: "Learn more",
    },
  },
  //zkSync
  324: {
    headerImgUrl: thirdwebBanner.src,
    about:
      "ZKsync is an ever expanding verifiable blockchain network, secured by math.",
    cta: {
      backgroundImageUrl: thirdwebCTA.src,
      title: "",
      buttonLink: "https://zksync.io/",
      buttonText: "Learn more",
    },
  },
  //treasure
  978657: {
    headerImgUrl: treasureBanner.src,
    about:
      'Treasure is the decentralized game console. Powered by $MAGIC, the Treasure L2 serves as the base layer for the best cryptonative games and projects. Treasure and its network of "Infinity Chains" L3s offers EVM compatibility, massive scale, and decentralized infrastructure enshrined throughout. Combined with a passionate community and builder support, developers on Treasure are equipped with all of the tools they need to not only build great games and products, but also distribute to the masses.',
    cta: {
      backgroundImageUrl: treasureCTA.src,
      title: "Start building on Treasure!",
      buttonLink: "https://portal.treasure.lol",
      buttonText: "Learn more",
    },
  },
  //AssetChain
  42421: {
    headerImgUrl: assetChainBanner.src,
    about:
      "Asset Chain is the native blockchain for Xend Finance's Real-World Asset OAE (Onchain Asset Environment), with its consensus based on Fantom's Lachesis consensus mechanism.",
    cta: {
      backgroundImageUrl: assetChainCTABG.src,
      title: "Start Building",
      buttonLink: "https://docs.assetchain.org",
      buttonText: "Learn more",
    },
  },
  //zytron
  9901: {
    headerImgUrl: zytronBanner.src,
    about:
      "Discover Zytron - a highly customizable Layer 3 roll up stack, natively supporting Zypher’s blockchain abstraction layer for games. It is designed for production level gaming experiences, from autonomous worlds to TON-based hyper casual games.",
    cta: {
      backgroundImageUrl: zytronCTA.src,
      title: "Unlock ZK Gaming with Zytron Layer3.",
      buttonLink: "https://zytron.zypher.network/",
      buttonText: "Learn more",
    },
  },
  //Soneium
  1946: {
    headerImgUrl: soneiumBanner.src,
    about:
      "Soneium, an Ethereum layer-2 developed by Sony Block Solutions Labs. This versatile chain is a general-purpose blockchain platform that aims to evoke emotion, empower creativity, and meet diverse needs to go mainstream. Soneium will be simplifying blockchain experiences while empowering developers, creators, and communities. Built on accessibility, scalability, and efficiency, it aims to solve real-world problems across industries globally. Soneium will change the way we interact with the internet, opening up a world of innovative applications and unlimited potential for users worldwide.",
    cta: OP_CTA,
  },
  //Shido
  9008: {
    headerImgUrl: shidoBanner.src,
    about:
      "Shido Network is a superfast EVM chain with the lowest fees. Seamlessly interoperable with Cosmos, EVM and WASM. Bringing you the future of DeFi, unlocking unified liquidity through chain abstraction.",
    cta: {
      backgroundImageUrl: shidoCta.src,
      title: "Endless scalability with Shido Network",
      buttonLink: "https://shido.io/",
      buttonText: "Learn more",
    },
  },
} satisfies Record<number, ExtraChainMetadata>;
// END TEMPORARY

export async function getChainMetadata(
  chainId: number,
): Promise<ExtraChainMetadata | null> {
  // TODO: fetch this from the API
  if (chainId in chainMetaRecord) {
    return chainMetaRecord[chainId as keyof typeof chainMetaRecord];
  }
  return null;
}
