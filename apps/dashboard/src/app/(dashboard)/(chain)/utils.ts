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

import hemiSepoliaBanner from "./temp-assets/HemiBanner.png";
import hemiSepoliaCTA from "./temp-assets/HemiCTA.png";
import appChainBanner from "./temp-assets/appChainBanner.jpg";
// TEMPORARY
import appchainCTA from "./temp-assets/appchainCTA.png";
import baseBanner from "./temp-assets/base-banner.jpeg";
import superchainCTABG from "./temp-assets/cta-bg-superchain.png";
import xaiCTABg from "./temp-assets/cta-bg-xai-connect.png";
import thirdwebCTA from "./temp-assets/cta-thirdweb.png";
import cyberCTA from "./temp-assets/cyberCTA.png";
import cyberChainBanner from "./temp-assets/cyberChainBanner.png";
import etherlinkBanner from "./temp-assets/etherlinkBanner.png";
import etherlinkCTA from "./temp-assets/etherlinkCTA.png";
import funkiBanner from "./temp-assets/funkiBanner.jpg";
import funkiCTA from "./temp-assets/funkiCTA.jpg";
import gptCTA from "./temp-assets/gptCTA.jpg";
import gptChainBanner from "./temp-assets/gptChainBanner.jpg";
import hashfireBanner from "./temp-assets/hashfireBanner.png";
import hashfireCTA from "./temp-assets/hashfireCTA.png";
import inkBanner from "./temp-assets/inkBanner.jpg";
import laosBanner from "./temp-assets/laosBanner.jpg";
import laosCTA from "./temp-assets/laosCTA.jpg";
import liskBanner from "./temp-assets/liskBanner.png";
import liskCTA from "./temp-assets/liskCTA.png";

import creatorBanner from "./temp-assets/creatorBanner.png";
import creatorCTA from "./temp-assets/creatorCTA.png";
import lumiaBanner from "./temp-assets/lumiaBanner.png";
import somniaBanner from "./temp-assets/somniaBanner.png";

import flowBanner from "./temp-assets/flowBanner.png";
import flowCTA from "./temp-assets/flowCTA.png";
import mantleBanner from "./temp-assets/mantle.png";
import metalBanner from "./temp-assets/metalBanner.png";
import plumeBanner from "./temp-assets/plumeBanner.png";

import plumeCTA from "./temp-assets/plumeCTA.png";
import rivalzBanner from "./temp-assets/rivalzBanner.png";
import rivalzCTA from "./temp-assets/rivalzCTA.png";
import rootStockBanner from "./temp-assets/rootstock-banner.png";
import rootStockCTABG from "./temp-assets/rootstock-cta.png";
import saakuruBanner from "./temp-assets/saakuruBanner.png";
import saakuruCTA from "./temp-assets/saakuruCTA.png";
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
import victionBanner from "./temp-assets/victionBanner.png";
import victionCTA from "./temp-assets/victionCTA.png";
import worldChainBanner from "./temp-assets/worldChainBanner.jpg";
import worldChainCTA from "./temp-assets/worldChainCTA.jpg";
import xaiBanner from "./temp-assets/xai-banner.jpg";
import zetachainBanner from "./temp-assets/zetachainBanner.png";
import zetachainCTA from "./temp-assets/zetachainCTA.png";
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
  //celo Mainnet
  42220: {
    cta: OP_CTA,
    gasSponsored: true,
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
    headerImgUrl: cyberChainBanner.src,
    about:
      "Cyber is a Layer 2 blockchain specifically designed for social applications. Built on the Optimism Superchain, it combines high-performance infrastructure with specialized tools for social features to simplify developer workflows and accelerate their time to market.",
    cta: {
      backgroundImageUrl: cyberCTA.src,
      title: "Discover Web3 Social with Cyber",
      buttonLink: "https://cyber.co/",
      buttonText: "Learn more",
    },
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
  // Flare
  14: {
    about:
      "Flare is the blockchain for data, offering developers and users secure, decentralized access to high-integrity data from other chains and the internet. Flare's Layer-1 network uniquely supports enshrined data protocols at the network layer, making it the only EVM-compatible smart contract platform optimized for decentralized data acquisition, including price and time-series data, blockchain event and state data, and Web2 API data.",
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
  //Superseed
  5330: {
    cta: OP_CTA,
    gasSponsored: true,
  },
  // Ink
  57073: {
    headerImgUrl: inkBanner.src,
    about:
      "Ink is an Ethereum OP Stack layer 2 blockchain designed to be the house of DeFi for the Superchain, a powerful base layer for deploying innovative DeFi protocols.",
    cta: OP_CTA,
    gasSponsored: true,
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
      "Lumia is the only full-cycle RWA chain, merging zkEVM technology with a robust infrastructure purpose-built for institutional and retail asset tokenization. Featuring advanced compliance tools such as on-chain KYC/AML via PolygonID, OFAC sanctions screening at the sequencer level, and AI-powered threat detection, Lumia Chain ensures security and regulatory adherence. Its unique volition architecture enables users to toggle between cost-efficient validium mode and highly secure rollup mode, providing flexibility for diverse needs. Lumia goes beyond tokenization by seamlessly integrating RWAs into DeFi. RWAs minted on Lumia Chain are instantly composable with native DeFi protocols like lending, AMMs, and perpetual markets, creating a tailored environment for RWA owners. With ERC-20 compatibility, native interoperability, and integration with major DeFi aggregators like 1inch and 0x, Lumia ensures that tokenized RWAs are not only secure and scalable but also accessible across the broader DeFi ecosystem.",
    cta: {
      backgroundImageUrl: lumiaBanner.src,
      title:
        "Build Smarter. Scale Faster. Lumia - The Only Full-Cycle RWA Chain",
      buttonLink:
        "https://docs.lumia.org/build/smartcontracts/deployment#deploy-contract-on-shiden",
      buttonText: "Learn more",
    },
  },
  // lumia Testnet
  1952959480: {
    headerImgUrl: lumiaBanner.src,
    about:
      "Lumia is the only full-cycle RWA chain, merging zkEVM technology with a robust infrastructure purpose-built for institutional and retail asset tokenization. Featuring advanced compliance tools such as on-chain KYC/AML via PolygonID, OFAC sanctions screening at the sequencer level, and AI-powered threat detection, Lumia Chain ensures security and regulatory adherence. Its unique volition architecture enables users to toggle between cost-efficient validium mode and highly secure rollup mode, providing flexibility for diverse needs. Lumia goes beyond tokenization by seamlessly integrating RWAs into DeFi. RWAs minted on Lumia Chain are instantly composable with native DeFi protocols like lending, AMMs, and perpetual markets, creating a tailored environment for RWA owners. With ERC-20 compatibility, native interoperability, and integration with major DeFi aggregators like 1inch and 0x, Lumia ensures that tokenized RWAs are not only secure and scalable but also accessible across the broader DeFi ecosystem.",
    cta: {
      backgroundImageUrl: lumiaBanner.src,
      title:
        "Build Smarter. Scale Faster. Lumia - The Only Full-Cycle RWA Chain",
      buttonLink:
        "https://docs.lumia.org/build/smartcontracts/deployment#deploy-contract-on-shiden",
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
  //Arena Z Mainnet
  7897: {
    cta: OP_CTA,
    gasSponsored: true,
  },
  //Appchain
  466: {
    headerImgUrl: appChainBanner.src,
    about:
      "Appchain is building useful onchain apps. We're an L2 on top of Ethereum, built on the Arbitrum Orbit stack. We are a low cost, high throughput chain with the goal of building apps for all internet users",
    cta: {
      title: "Bringing the world onchain through useful apps.",
      backgroundImageUrl: appchainCTA.src,
      buttonLink: "https://appchain.xyz/",
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
  //Creator Mainnet
  66665: {
    headerImgUrl: creatorBanner.src,
    about:
      "From Builders to Builders, From Idea to Creation ⚡\nCreator is AI Superhero Layer 2 Blockchain 🦇\nBuilt on the OP Stack, leveraging the robust foundation of Optimism 🟡🔴. We adopt the OP Stack's design principles because, as builders, we know they work and align perfectly with our values.\nWhy Creator?\nWe're constructing our Testnet on the Bedrock release of the OP Stack, ensuring a scalable and modular infrastructure that supports innovative and decentralized applications.\nCore Features:\n- Lightning Fast Transactions: Say goodbye to slow speeds with Creator's Layer 2 technology.\n- Low Fees: Lower transaction costs make blockchain accessible to all.\n- Scalable Infrastructure: Creator's network adapts effortlessly as you grow.",
    cta: {
      backgroundImageUrl: creatorCTA.src,
      title: "From Builders to Builders, From Idea to Creation ⚡",
      buttonLink: "https://www.creatorchain.io/",
      buttonText: "Learn More",
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
  //Etherlink Testnet
  128123: {
    headerImgUrl: etherlinkBanner.src,
    about:
      "Etherlink is powered by a Smart Rollup, an enshrined, optimistic rollup technology implemented by Tezos. Smoothly deploy any EVM codebase enabling seamless interaction across interoperable chains with subsecond block times and (nearly) free transactions.",
    cta: {
      backgroundImageUrl: etherlinkCTA.src,
      title: "The fast, fair and (nearly) free L2",
      buttonLink: "https://www.etherlink.com",
      buttonText: "Learn More",
    },
  },
  //Etherlink mainnet
  42793: {
    headerImgUrl: etherlinkBanner.src,
    about:
      "Etherlink is powered by a Smart Rollup, an enshrined, optimistic rollup technology implemented by Tezos. Smoothly deploy any EVM codebase enabling seamless interaction across interoperable chains with subsecond block times and (nearly) free transactions.",
    cta: {
      backgroundImageUrl: etherlinkCTA.src,
      title: "The fast, fair and (nearly) free L2",
      buttonLink: "https://www.etherlink.com",
      buttonText: "Learn More",
    },
  },
  //EVM on Flow testnet
  545: {
    headerImgUrl: flowBanner.src,
    about:
      "Flow is a secure, high-performance, decentralized L1 EVM equivalent chain, with innovative next-generation features not available on other EVM compatible chains, the lowest fees anywhere, and a vibrant ecosystem of major consumer brands",
    cta: {
      backgroundImageUrl: flowCTA.src,
      title:
        "Explore Flow's innovative features not available on any other EVM compatible chain",
      buttonLink: "https://developers.flow.com/evm/how-it-works",
      buttonText: "Learn More",
    },
  },
  //EVM on Flow Mainnet
  747: {
    headerImgUrl: flowBanner.src,
    about:
      "Flow is a secure, high-performance, decentralized L1 EVM equivalent chain, with innovative next-generation features not available on other EVM compatible chains, the lowest fees anywhere, and a vibrant ecosystem of major consumer brands",
    cta: {
      backgroundImageUrl: flowCTA.src,
      title:
        "Learn about innovative features not available on any other EVM compatible chains!",
      buttonLink: "https://developers.flow.com/evm/how-it-works",
      buttonText: "Learn More",
    },
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
  //Funki Mainnet
  33979: {
    headerImgUrl: funkiBanner.src,
    about:
      "Funki is a fun-first L2 using OP stack, focused on onchain gaming and social experiments.\nFunki is the playground where innovative ideas come to life. We’re dedicated to building an ecosystem that upholds bold, persistent experiments.",
    cta: {
      backgroundImageUrl: funkiCTA.src,
      title: "Enter the Rabbit hole",
      buttonLink: "https://docs.funkichain.com/docs",
      buttonText: "Learn More",
    },
  },
  //Funki Testnet
  3397901: {
    headerImgUrl: funkiBanner.src,
    about:
      "Funki is a fun-first L2 using OP stack, focused on onchain gaming and social experiments.\nFunki is the playground where innovative ideas come to life. We’re dedicated to building an ecosystem that upholds bold, persistent experiments.",
    cta: {
      backgroundImageUrl: funkiCTA.src,
      title: "Enter the Rabbit hole",
      buttonLink: "https://docs.funkichain.com/docs",
      buttonText: "Learn More",
    },
  },
  //Gemuchain -- Deprecated
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
  //GPT Mainnet
  1511670449: {
    headerImgUrl: gptChainBanner.src,
    about:
      "GPT Protocol combines cutting-edge L2 EVM technology with seamless AI integration to power the future of decentralized applications. By enabling ultra-fast transactions, unmatched scalability, and eco-friendly solutions, GPT Protocol opens doors to developers, brands, and users alike. With innovative tools, a robust ecosystem, and low transaction costs, GPT Protocol is designed for a smarter, more connected blockchain experience. Join us in building the next generation of decentralized innovation.",
    cta: {
      backgroundImageUrl: gptCTA.src,
      title: "Build on the blockchain for AI",
      buttonLink: "https://www.gptprotocol.com/",
      buttonText: "Learn more",
    },
  },
  //HemiSepolia
  743111: {
    headerImgUrl: hemiSepoliaBanner.src,
    about:
      "The Hemi Network is a modular Layer-2 protocol for superior scaling, security, and interoperability, powered by Bitcoin and Ethereum.",
    cta: {
      backgroundImageUrl: hemiSepoliaCTA.src,
      title: "One Network, Powered by Bitcoin and Ethereum",
      buttonLink: "https://hemi.xyz/",
      buttonText: "Learn More",
    },
  },
  //Hashfire
  4227: {
    headerImgUrl: hashfireBanner.src,
    about:
      "Imagine a world where every agreement is dynamic, verified, and automated. This is Hashfire—a platform that transforms how agreements are managed by leveraging blockchain technology to provide unparalleled security, automation, and transparency. With Hashfire, signing a document activates a powerful chain of actions, ensuring that agreements are secure, automated, and continuously verified.",
    cta: {
      backgroundImageUrl: hashfireCTA.src,
      title:
        "Transform contracts into secure, maximally enforceable agreements",
      buttonLink: "https://www.hashfire.xyz/",
      buttonText: "Learn more",
    },
  },
  //LAOS Mainnet
  6283: {
    headerImgUrl: laosBanner.src,
    about:
      "LAOS is the first Layer 1 protocol connected without bridges to Ethereum, Polygon and other EVM-compatible chains, capable of offloading more than 20% of all their transactions. It enables unlimited NFT minting on these networks at lower costs, bypassing native gas fees. This approach eliminates the need for bridges or wrapped currencies while maintaining compatibility with existing DApps",
    cta: {
      backgroundImageUrl: laosCTA.src,
      title: "Mint NFTs at Scale on any EVM Chain with LAOS",
      buttonLink: "https://laosnetwork.io/build",
      buttonText: "Learn more",
    },
  },
  //Lisk Testnet
  4202: {
    headerImgUrl: liskBanner.src,
    about:
      "Lisk is focused on serving builders in high-growth markets like Africa and Southeast Asia. When you build on Lisk, you become part of the strongest Ethereum collective, alongside Coinbase, Sony, World, Kraken and Uniswap -- the OP Superchain.",
    cta: {
      backgroundImageUrl: liskCTA.src,
      title: "Ready to reshape the world?",
      buttonLink: "https://lisk.com",
      buttonText: "Learn more",
    },
  },
  //Lisk Mainnet
  1135: {
    headerImgUrl: liskBanner.src,
    about:
      "Lisk is focused on serving builders in high-growth markets like Africa and Southeast Asia. When you build on Lisk, you become part of the strongest Ethereum collective, alongside Coinbase, Sony, World, Kraken and Uniswap -- the OP Superchain.",
    // cta: {
    //   backgroundImageUrl: liskCTA.src,
    //   title: "Ready to reshape the world?",
    //   buttonLink: "https://lisk.com",
    //   buttonText: "Learn more",
    // },
    cta: OP_CTA,
    gasSponsored: true,
  },
  //Metal L2
  1750: {
    headerImgUrl: metalBanner.src,
    about:
      "Metal L2 is a banking-focused Layer 2 blockchain built on the Optimism Superchain, designed to enable direct on-chain fiat deposits through its connection to The Digital Banking Network—an open-source blockchain banking protocol developed by Metallicus",
    // cta: {
    //   backgroundImageUrl: metalCTA.src,
    //   title: "Connect to The Banking Layer, Metal L2",
    //   buttonLink: "https://metall2.com/",
    //   buttonText: "Connect Here",
    // },
    cta: OP_CTA,
    gasSponsored: true,
  },
  //Ozean Testnet
  7849306: {
    cta: OP_CTA,
    gasSponsored: true,
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
  //Plume Testnet
  98864: {
    headerImgUrl: plumeBanner.src,
    about:
      "Plume Network is the first full-stack L1 RWA Chain and ecosystem purpose-built for RWAfi, enabling the rapid adoption and demand-driven integration of real world assets. With 180+ projects building on the network, Plume offers a composable, EVM-compatible environment for onboarding and managing diverse real world assets. Coupled with an end-to-end tokenization engine and a network of financial infrastructure partners, Plume simplifies asset onboarding and enables seamless DeFi integration for RWAs so anyone can tokenize real world assets, distribute them globally, and make them useful for native crypto users.",
    cta: {
      backgroundImageUrl: plumeCTA.src,
      title: "Participate on the Testnet Now!",
      buttonLink: "https://miles.plumenetwork.xyz/",
      buttonText: "Learn more",
    },
  },
  //Plume Mainnet
  98865: {
    headerImgUrl: plumeBanner.src,
    about:
      "Plume Network is the first full-stack L1 RWA Chain and ecosystem purpose-built for RWAfi, enabling the rapid adoption and demand-driven integration of real world assets. With 180+ projects building on the network, Plume offers a composable, EVM-compatible environment for onboarding and managing diverse real world assets. Coupled with an end-to-end tokenization engine and a network of financial infrastructure partners, Plume simplifies asset onboarding and enables seamless DeFi integration for RWAs so anyone can tokenize real world assets, distribute them globally, and make them useful for native crypto users.",
    cta: {
      backgroundImageUrl: plumeCTA.src,
      title: "Bringing the Real World Onchain",
      buttonLink: "https://miles.plumenetwork.xyz/",
      buttonText: "Learn more",
    },
  },
  //Rivalz Mainnet
  753: {
    headerImgUrl: rivalzBanner.src,
    about:
      "Rivalz merges real-world economies with AI, redefining how agents interact with global resources. Through its modular infrastructure, Rivalz enables AI agents to tap into the global workforce, digital services, and DePIN—from computers to smart homes—seamlessly connecting AI with reality.",
    cta: {
      backgroundImageUrl: rivalzCTA.src,
      title: "Empower the Age of AI Agents with Rivalz",
      buttonLink: "https://rivalz.ai/download",
      buttonText: "Learn More",
    },
  },
  //Rivalz Testnet
  6966: {
    headerImgUrl: rivalzBanner.src,
    about:
      "Rivalz merges real-world economies with AI, redefining how agents interact with global resources. Through its modular infrastructure, Rivalz enables AI agents to tap into the global workforce, digital services, and DePIN—from computers to smart homes—seamlessly connecting AI with reality.",
    cta: {
      backgroundImageUrl: rivalzCTA.src,
      title: "Empower the Age of AI Agents with Rivalz",
      buttonLink: "https://rivalz.ai/download",
      buttonText: "Learn More",
    },
  },
  //Saakuru Mainnet
  7225878: {
    headerImgUrl: saakuruBanner.src,
    about:
      "Saakuru Labs is a Web3 GameFi innovation and growth hub, dedicated to empowering game studios through tailored collaborations that cater to their unique needs and stages of game development. By providing a structured process to evaluate and support studios, Saakuru Labs aims to expand the Saakuru gaming ecosystem while ensuring the success of its partners.",
    cta: {
      backgroundImageUrl: saakuruCTA.src,
      title: "Empowering Next-Gen Blockchain Gaming",
      buttonLink: "https://saakuru.com/",
      buttonText: "Learn More",
    },
  },
  //Saakuru Testnet
  247253: {
    headerImgUrl: saakuruBanner.src,
    about:
      "Saakuru Labs is a Web3 GameFi innovation and growth hub, dedicated to empowering game studios through tailored collaborations that cater to their unique needs and stages of game development. By providing a structured process to evaluate and support studios, Saakuru Labs aims to expand the Saakuru gaming ecosystem while ensuring the success of its partners.",
    cta: {
      backgroundImageUrl: saakuruCTA.src,
      title: "Empowering Next-Gen Blockchain Gaming",
      buttonLink: "https://saakuru.com/",
      buttonText: "Learn More",
    },
  },
  //Somnia Devnet
  50311: {
    headerImgUrl: somniaBanner.src,
    about:
      "We are committed to building technology to make fully on-chain, real-time mass-scale applications possible and practical. We believe this is essential for creating a composable, open internet. We believe in a collection of applications, each with distinct, interconnected experiences, much like countries within a global community, sharing utilities that enhance mutual growth. \nCentral to our vision is the principle of composability—the ability for builders to build upon each other’s work, creating a culture of collaboration in which the collective output surpasses the sum of its parts. We will empower builders with the freedom to build sustainable models of engagement and ownership. This includes safeguarding the rights to digital assets and creating an environment where platform constraints do not stifle innovation.",
    cta: {
      backgroundImageUrl: somniaBanner.src,
      title: "Somnia Devnet",
      buttonLink: "https://codex.somnia.network",
      buttonText: "Learn More",
    },
  },
  //Unichain Sepolis Testnet
  1301: {
    cta: OP_CTA,
    gasSponsored: true,
  },
  //viction Mainnet
  88: {
    headerImgUrl: victionBanner.src,
    about:
      "Viction is a global layer-1 EVM blockchain that empowers builders at every level, provides both the foundation and enhancements necessary for projects to achieve stability and soar to their higher selves. \n We provide seamless interoperability, scalability, flexible development, zero gas fees, enhanced security, and speed to enable builders with tech capabilities. Beyond technical advantages, Viction offers holistic guidance through consultation, resources, funding, and strong network connections to foster project growth.",
    cta: {
      backgroundImageUrl: victionCTA.src,
      title:
        "Build, own, win, and be part of Viction World Wide Chain where everyone scales beyond limits.",
      buttonLink: "https://thirdweb.com/viction",
      buttonText: "Learn More",
    },
  },
  //viction Testnet
  89: {
    headerImgUrl: victionBanner.src,
    about:
      "Viction is a global layer-1 EVM blockchain that empowers builders at every level, provides both the foundation and enhancements necessary for projects to achieve stability and soar to their higher selves. \n We provide seamless interoperability, scalability, flexible development, zero gas fees, enhanced security, and speed to enable builders with tech capabilities. Beyond technical advantages, Viction offers holistic guidance through consultation, resources, funding, and strong network connections to foster project growth.",
    cta: {
      backgroundImageUrl: victionCTA.src,
      title:
        "Build, own, win, and be part of Viction World Wide Chain where everyone scales beyond limits.",
      buttonLink: "https://thirdweb.com/viction",
      buttonText: "Learn More",
    },
  },
  // World Chain Mainnet
  480: {
    headerImgUrl: worldChainBanner.src,
    about:
      "World Chain is the blockchain for real humans, offering priority blockspace and gas-free transactions for World ID-verified users.",
    // cta: {
    //   backgroundImageUrl: worldChainCTA.src,
    //   title: "Build for real humans with World Chain",
    //   buttonLink: "https://world.org/world-chain",
    //   buttonText: "Learn More",
    // },
    cta: OP_CTA,
    gasSponsored: true,
  },
  //World Chain Testnet
  4801: {
    headerImgUrl: worldChainBanner.src,
    about:
      "World Chain is the blockchain for real humans, offering priority blockspace and gas-free transactions for World ID-verified users.",
    cta: {
      backgroundImageUrl: worldChainCTA.src,
      title: "Build for real humans with World Chain",
      buttonLink: "https://world.org/world-chain",
      buttonText: "Learn More",
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
  //treasure-Ruby
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
  //Treasure Topaz
  978658: {
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
  //Treasure Mainnet
  61166: {
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
  // Zetachain
  7000: {
    headerImgUrl: zetachainBanner.src,
    about:
      "ZetaChain is the first Universal Blockchain with native access to Bitcoin, Ethereum, Solana, and more, offering seamless UX and unified liquidity to the next billions of users. With its Universal EVM, ZetaChain empowers developers to build Universal Apps that operate natively across any blockchain, creating a fluid crypto ecosystem from a single platform.",
    cta: {
      backgroundImageUrl: zetachainCTA.src,
      title: "The First Universal Blockchain",
      buttonLink: "https://www.zetachain.com/docs/",
      buttonText: "Learn more",
    },
  },
  // ZetaChain Testnet
  7001: {
    headerImgUrl: zetachainBanner.src,
    about:
      "ZetaChain is the first Universal Blockchain with native access to Bitcoin, Ethereum, Solana, and more, offering seamless UX and unified liquidity to the next billions of users. With its Universal EVM, ZetaChain empowers developers to build Universal Apps that operate natively across any blockchain, creating a fluid crypto ecosystem from a single platform.",
    cta: {
      backgroundImageUrl: zetachainCTA.src,
      title: "The First Universal Blockchain",
      buttonLink: "https://www.zetachain.com/docs/",
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
  //Soneium Testnet
  1946: {
    headerImgUrl: soneiumBanner.src,
    about:
      "Soneium, an Ethereum layer-2 developed by Sony Block Solutions Labs. This versatile chain is a general-purpose blockchain platform that aims to evoke emotion, empower creativity, and meet diverse needs to go mainstream. Soneium will be simplifying blockchain experiences while empowering developers, creators, and communities. Built on accessibility, scalability, and efficiency, it aims to solve real-world problems across industries globally. Soneium will change the way we interact with the internet, opening up a world of innovative applications and unlimited potential for users worldwide.",
    cta: OP_CTA,
    gasSponsored: true,
  },
  //Soneium Mainnet
  1868: {
    headerImgUrl: soneiumBanner.src,
    about:
      "Soneium, an Ethereum layer-2 developed by Sony Block Solutions Labs. This versatile chain is a general-purpose blockchain platform that aims to evoke emotion, empower creativity, and meet diverse needs to go mainstream. Soneium will be simplifying blockchain experiences while empowering developers, creators, and communities. Built on accessibility, scalability, and efficiency, it aims to solve real-world problems across industries globally. Soneium will change the way we interact with the internet, opening up a world of innovative applications and unlimited potential for users worldwide.",
    cta: OP_CTA,
    gasSponsored: true,
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
