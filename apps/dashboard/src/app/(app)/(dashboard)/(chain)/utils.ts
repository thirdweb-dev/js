import "server-only";

import { notFound } from "next/navigation";
import type { ChainMetadata } from "thirdweb/chains";
import { getChainServices, getChains } from "@/api/chain";
import { NEXT_PUBLIC_THIRDWEB_API_HOST } from "@/constants/public-envs";
import type { ChainMetadataWithServices, ChainServices } from "@/types/chain";
import type { ChainCTAProps } from "./[chain_id]/(chainPage)/components/server/cta-card";
import zeroGCTA from "./temp-assets/0gCTA.png";
import zeroGBanner from "./temp-assets/0gLabsBanner.png";
import alephZeroBaner from "./temp-assets/AlephZeroBanner.jpg";
import alephZeroCTA from "./temp-assets/AlephZeroCTA.jpg";
import ancient8Banner from "./temp-assets/ancient8-banner.png";
import appChainBanner from "./temp-assets/appChainBanner.jpg";
// TEMPORARY
import appchainCTA from "./temp-assets/appchainCTA.png";
import assetChainBanner from "./temp-assets/assetChainBanner.png";
import assetChainCTABG from "./temp-assets/assetChainCTABanner.png";
import baseBanner from "./temp-assets/base-banner.jpeg";
import cotiBanner from "./temp-assets/COTI_Banner.jpg";
import cotiCTA from "./temp-assets/COTI_CTA.jpg";
import creatorBanner from "./temp-assets/creatorBanner.png";
import creatorCTA from "./temp-assets/creatorCTA.png";
import xaiCTABg from "./temp-assets/cta-bg-xai-connect.png";
import thirdwebCTA from "./temp-assets/cta-thirdweb.png";
import cyberChainBanner from "./temp-assets/cyberChainBanner.png";
import cyberCTA from "./temp-assets/cyberCTA.png";
import eduBanner from "./temp-assets/EDUBanner.jpeg";
import eduCTA from "./temp-assets/EDUCTA.png";
import etherlinkBanner from "./temp-assets/etherlinkBanner.png";
import etherlinkCTA from "./temp-assets/etherlinkCTA.png";
import flowBanner from "./temp-assets/flowBanner.png";
import flowCTA from "./temp-assets/flowCTA.png";
import funkiBanner from "./temp-assets/funkiBanner.jpg";
import funkiCTA from "./temp-assets/funkiCTA.jpg";
import gptChainBanner from "./temp-assets/gptChainBanner.jpg";
import gptCTA from "./temp-assets/gptCTA.jpg";
import hemiSepoliaBanner from "./temp-assets/HemiBanner.png";
import hemiSepoliaCTA from "./temp-assets/HemiCTA.png";
import hashfireBanner from "./temp-assets/hashfireBanner.png";
import hashfireCTA from "./temp-assets/hashfireCTA.png";
import inkBanner from "./temp-assets/inkBanner.jpg";
import laosBanner from "./temp-assets/laosBanner.jpg";
import laosCTA from "./temp-assets/laosCTA.jpg";
import liskBanner from "./temp-assets/liskBanner.png";
import liskCTA from "./temp-assets/liskCTA.png";
import lumiaBanner from "./temp-assets/lumiaBanner.png";
import mantleBanner from "./temp-assets/mantle.png";
import metalBanner from "./temp-assets/metalBanner.png";
import NeoXBanner from "./temp-assets/NeoXBanner.jpg";
import NeoXCTA from "./temp-assets/NeoXCTA.jpg";
import onyxBanner from "./temp-assets/onyxBanner.png";
import onyxCTA from "./temp-assets/onyxCTA.png";
import plumeBanner from "./temp-assets/plumeBanner.png";
import plumeCTA from "./temp-assets/plumeCTA.png";
import reactiveBanner from "./temp-assets/reactiveBanner.jpg";
import reactiveCTA from "./temp-assets/reactiveCTA.jpg";
import rivalzBanner from "./temp-assets/rivalzBanner.png";
import rivalzCTA from "./temp-assets/rivalzCTA.png";
import rootStockBanner from "./temp-assets/rootstock-banner.png";
import rootStockCTABG from "./temp-assets/rootstock-cta.png";
import saakuruBanner from "./temp-assets/saakuruBanner.png";
import saakuruCTA from "./temp-assets/saakuruCTA.png";
import shidoBanner from "./temp-assets/shidoBanner.png";
import shidoCta from "./temp-assets/shidoCta.png";
import somniaBanner from "./temp-assets/somniaBanner.png";
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
import zkCandyBanner from "./temp-assets/zkCandyBanner.jpg";
import zytronBanner from "./temp-assets/zytronBanner.png";
import zytronCTA from "./temp-assets/zytronCTA.jpg";
// END TEMPORARY

export async function getChainsWithServices() {
  const [chains, chainServices] = await Promise.all([
    getChains(),
    getChainServices(),
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
      `${NEXT_PUBLIC_THIRDWEB_API_HOST}/v1/chains/${chainIdOrSlug}`,
      // revalidate every 15 minutes
      { next: { revalidate: 15 * 60 } },
    ).then((res) => res.json()) as Promise<{ data: ChainMetadata }>,
    fetch(
      `${NEXT_PUBLIC_THIRDWEB_API_HOST}/v1/chains/${chainIdOrSlug}/services`,
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
  cta: ChainCTAProps;
}>;

const chainMetaRecord = {
  // Flare
  14: {
    about:
      "Flare is the blockchain for data, offering developers and users secure, decentralized access to high-integrity data from other chains and the internet. Flare's Layer-1 network uniquely supports enshrined data protocols at the network layer, making it the only EVM-compatible smart contract platform optimized for decentralized data acquisition, including price and time-series data, blockchain event and state data, and Web2 API data.",
  },
  // rootstock
  30: {
    about:
      "Deploy EVM compatible smart contracts on Rootstock and leverage the security of the Bitcoin network.",
    cta: {
      backgroundImageUrl: rootStockCTABG.src,
      buttonLink: "https://rootstock.io/",
      buttonText: "Learn more",
      title: "Fully EVM-compatible Bitcoin L2",
    },
    headerImgUrl: rootStockBanner.src,
  },
  //viction Mainnet
  88: {
    about:
      "Viction is a global layer-1 EVM blockchain that empowers builders at every level, provides both the foundation and enhancements necessary for projects to achieve stability and soar to their higher selves. \n We provide seamless interoperability, scalability, flexible development, zero gas fees, enhanced security, and speed to enable builders with tech capabilities. Beyond technical advantages, Viction offers holistic guidance through consultation, resources, funding, and strong network connections to foster project growth.",
    cta: {
      backgroundImageUrl: victionCTA.src,
      buttonLink: "https://thirdweb.com/viction",
      buttonText: "Learn More",
      title:
        "Build, own, win, and be part of Viction World Wide Chain where everyone scales beyond limits.",
    },
    headerImgUrl: victionBanner.src,
  },
  //viction Testnet
  89: {
    about:
      "Viction is a global layer-1 EVM blockchain that empowers builders at every level, provides both the foundation and enhancements necessary for projects to achieve stability and soar to their higher selves. \n We provide seamless interoperability, scalability, flexible development, zero gas fees, enhanced security, and speed to enable builders with tech capabilities. Beyond technical advantages, Viction offers holistic guidance through consultation, resources, funding, and strong network connections to foster project growth.",
    cta: {
      backgroundImageUrl: victionCTA.src,
      buttonLink: "https://thirdweb.com/viction",
      buttonText: "Learn More",
      title:
        "Build, own, win, and be part of Viction World Wide Chain where everyone scales beyond limits.",
    },
    headerImgUrl: victionBanner.src,
  },
  //Fuse
  122: {
    about:
      "Build and grow on the leading web3 platform for business and finance, powered by a performant zkEVM tailor made to get millions of consumers on-chain.",
    cta: {
      backgroundImageUrl: thirdwebCTA.src,
      buttonLink: "https://www.fuse.io/",
      buttonText: "Learn more",
      title: "",
    },
    headerImgUrl: thirdwebBanner.src,
  },
  //zkCandy Testnet
  302: {
    about:
      "Explore our cutting-edge Layer2 Ethereum scaling ZK Chain built for gaming and entertainment with the latest zk-proof technology.",
    cta: {
      backgroundImageUrl: thirdwebCTA.src,
      buttonLink: "https://zkcandy.io/",
      buttonText: "Learn more",
      title: "",
    },
    headerImgUrl: thirdwebBanner.src,
  },

  //zkCandy Mainnet
  320: {
    about:
      "ZKcandy is an AI-powered Layer-2 aiming to redefine what’s possible in gaming and entertainment. As a ZK Chain built on ZKsync’s Elastic Network, it focuses on building immersive gaming ecosystems where players make the most of today’s AI capabilities. Emerged from a groundbreaking collaboration between ZKsync and the award-winning game studio iCandy Interactive, It's the first L2 ZK chain for gaming in the ZKsync ecosystem.",
    cta: {
      backgroundImageUrl: zkCandyBanner.src,
      buttonLink: "https://litepaper.zkcandy.io/dev-guide/",
      buttonText: "Learn More",
      title: " ",
    },
    headerImgUrl: zkCandyBanner.src,
  },
  //zkSync
  324: {
    about:
      "ZKsync is an ever expanding verifiable blockchain network, secured by math.",
    cta: {
      backgroundImageUrl: thirdwebCTA.src,
      buttonLink: "https://zksync.io/",
      buttonText: "Learn more",
      title: "",
    },
    headerImgUrl: thirdwebBanner.src,
  },
  //Appchain
  466: {
    about:
      "Appchain is building useful onchain apps. We're an L2 on top of Ethereum, built on the Arbitrum Orbit stack. We are a low cost, high throughput chain with the goal of building apps for all internet users",
    cta: {
      backgroundImageUrl: appchainCTA.src,
      buttonLink: "https://appchain.xyz/",
      buttonText: "Learn more",
      title: "Bringing the world onchain through useful apps.",
    },
    headerImgUrl: appChainBanner.src,
  },
  // World Chain Mainnet
  480: {
    about:
      "World Chain is the blockchain for real humans, offering priority blockspace and gas-free transactions for World ID-verified users.",
    headerImgUrl: worldChainBanner.src,
  },
  //EVM on Flow testnet
  545: {
    about:
      "Flow is a secure, high-performance, decentralized L1 EVM equivalent chain, with innovative next-generation features not available on other EVM compatible chains, the lowest fees anywhere, and a vibrant ecosystem of major consumer brands",
    cta: {
      backgroundImageUrl: flowCTA.src,
      buttonLink: "https://developers.flow.com/evm/how-it-works",
      buttonText: "Learn More",
      title:
        "Explore Flow's innovative features not available on any other EVM compatible chain",
    },
    headerImgUrl: flowBanner.src,
  },
  //EVM on Flow Mainnet
  747: {
    about:
      "Flow is a secure, high-performance, decentralized L1 EVM equivalent chain, with innovative next-generation features not available on other EVM compatible chains, the lowest fees anywhere, and a vibrant ecosystem of major consumer brands",
    cta: {
      backgroundImageUrl: flowCTA.src,
      buttonLink: "https://developers.flow.com/evm/how-it-works",
      buttonText: "Learn More",
      title:
        "Learn about innovative features not available on any other EVM compatible chains!",
    },
    headerImgUrl: flowBanner.src,
  },
  //Rivalz Mainnet
  753: {
    about:
      "Rivalz merges real-world economies with AI, redefining how agents interact with global resources. Through its modular infrastructure, Rivalz enables AI agents to tap into the global workforce, digital services, and DePIN—from computers to smart homes—seamlessly connecting AI with reality.",
    cta: {
      backgroundImageUrl: rivalzCTA.src,
      buttonLink: "https://rivalz.ai/download",
      buttonText: "Learn More",
      title: "Empower the Age of AI Agents with Rivalz",
    },
    headerImgUrl: rivalzBanner.src,
  },
  //Lisk Mainnet
  1135: {
    about:
      "Lisk is focused on serving builders in high-growth markets like Africa and Southeast Asia. When you build on Lisk, you become part of the strongest Ethereum collective, alongside Coinbase, Sony, World, Kraken and Uniswap -- the OP Superchain.",
    headerImgUrl: liskBanner.src,
  },
  //Reactive Mainnet
  1597: {
    about:
      "Web3’s first IFTTT infrastructure. Automate multi-chain workflows with event-driven logic – execute actions without compromising decentralization.",
    cta: {
      backgroundImageUrl: reactiveCTA.src,
      buttonLink: "https://dev.reactive.network",
      buttonText: "Learn More",
      title: "Turn Smart Contracts Reactive",
    },
    headerImgUrl: reactiveBanner.src,
  },
  //Metal L2
  1750: {
    about:
      "Metal L2 is a banking-focused Layer 2 blockchain built on the Optimism Superchain, designed to enable direct on-chain fiat deposits through its connection to The Digital Banking Network—an open-source blockchain banking protocol developed by Metallicus",
    headerImgUrl: metalBanner.src,
  },
  //Soneium Mainnet
  1868: {
    about:
      "Soneium, an Ethereum layer-2 developed by Sony Block Solutions Labs. This versatile chain is a general-purpose blockchain platform that aims to evoke emotion, empower creativity, and meet diverse needs to go mainstream. Soneium will be simplifying blockchain experiences while empowering developers, creators, and communities. Built on accessibility, scalability, and efficiency, it aims to solve real-world problems across industries globally. Soneium will change the way we interact with the internet, opening up a world of innovative applications and unlimited potential for users worldwide.",
    headerImgUrl: soneiumBanner.src,
  },
  //Soneium Testnet
  1946: {
    about:
      "Soneium, an Ethereum layer-2 developed by Sony Block Solutions Labs. This versatile chain is a general-purpose blockchain platform that aims to evoke emotion, empower creativity, and meet diverse needs to go mainstream. Soneium will be simplifying blockchain experiences while empowering developers, creators, and communities. Built on accessibility, scalability, and efficiency, it aims to solve real-world problems across industries globally. Soneium will change the way we interact with the internet, opening up a world of innovative applications and unlimited potential for users worldwide.",
    headerImgUrl: soneiumBanner.src,
  },
  // vanar
  2040: {
    about:
      "Discover VANAR – The future of blockchain technology tailored for global adoption. This cutting-edge, L1 EVM blockchain offers high-speed transactions and scalability, powered by Google's renewable energy sources. With a suite of apps, low fixed transaction costs and a zero-cost option for brands, VANAR makes blockchain scalable, accessible and affordable.",
    cta: {
      backgroundImageUrl: vanarCTABG.src,
      buttonLink: "https://docs.vanarchain.com",
      buttonText: "Learn more",
      title: "Fully EVM compatible L1 for Entertainment",
    },
    headerImgUrl: vanarBanner.src,
  },
  //Lisk Testnet
  4202: {
    about:
      "Lisk is focused on serving builders in high-growth markets like Africa and Southeast Asia. When you build on Lisk, you become part of the strongest Ethereum collective, alongside Coinbase, Sony, World, Kraken and Uniswap -- the OP Superchain.",
    cta: {
      backgroundImageUrl: liskCTA.src,
      buttonLink: "https://lisk.com",
      buttonText: "Learn more",
      title: "Ready to reshape the world?",
    },
    headerImgUrl: liskBanner.src,
  },
  //Hashfire
  4227: {
    about:
      "Imagine a world where every agreement is dynamic, verified, and automated. This is Hashfire—a platform that transforms how agreements are managed by leveraging blockchain technology to provide unparalleled security, automation, and transparency. With Hashfire, signing a document activates a powerful chain of actions, ensuring that agreements are secure, automated, and continuously verified.",
    cta: {
      backgroundImageUrl: hashfireCTA.src,
      buttonLink: "https://www.hashfire.xyz/",
      buttonText: "Learn more",
      title:
        "Transform contracts into secure, maximally enforceable agreements",
    },
    headerImgUrl: hashfireBanner.src,
  },
  //World Chain Testnet
  4801: {
    about:
      "World Chain is the blockchain for real humans, offering priority blockspace and gas-free transactions for World ID-verified users.",
    cta: {
      backgroundImageUrl: worldChainCTA.src,
      buttonLink: "https://world.org/world-chain",
      buttonText: "Learn More",
      title: "Build for real humans with World Chain",
    },
    headerImgUrl: worldChainBanner.src,
  },
  // mantle
  5000: {
    about: `Build dApps with exceptional UX, all while relying on Ethereum's unrivaled security, with our high-performance Ethereum layer-2 network built with modular architecture.`,
    cta: {
      backgroundImageUrl: mantleBanner.src,
      buttonLink: "https://x.com/0xMantleDevs",
      buttonText: "Learn More",
      title: "Reach out to bring your brilliant ideas to life",
    },
    headerImgUrl: mantleBanner.src,
  },
  //LAOS Mainnet
  6283: {
    about:
      "LAOS is the first Layer 1 protocol connected without bridges to Ethereum, Polygon and other EVM-compatible chains, capable of offloading more than 20% of all their transactions. It enables unlimited NFT minting on these networks at lower costs, bypassing native gas fees. This approach eliminates the need for bridges or wrapped currencies while maintaining compatibility with existing DApps",
    cta: {
      backgroundImageUrl: laosCTA.src,
      buttonLink: "https://laosnetwork.io/build",
      buttonText: "Learn more",
      title: "Mint NFTs at Scale on any EVM Chain with LAOS",
    },
    headerImgUrl: laosBanner.src,
  },
  //Rivalz Testnet
  6966: {
    about:
      "Rivalz merges real-world economies with AI, redefining how agents interact with global resources. Through its modular infrastructure, Rivalz enables AI agents to tap into the global workforce, digital services, and DePIN—from computers to smart homes—seamlessly connecting AI with reality.",
    cta: {
      backgroundImageUrl: rivalzCTA.src,
      buttonLink: "https://rivalz.ai/download",
      buttonText: "Learn More",
      title: "Empower the Age of AI Agents with Rivalz",
    },
    headerImgUrl: rivalzBanner.src,
  },
  // Zetachain
  7000: {
    about:
      "ZetaChain is the first Universal Blockchain with native access to Bitcoin, Ethereum, Solana, and more, offering seamless UX and unified liquidity to the next billions of users. With its Universal EVM, ZetaChain empowers developers to build Universal Apps that operate natively across any blockchain, creating a fluid crypto ecosystem from a single platform.",
    cta: {
      backgroundImageUrl: zetachainCTA.src,
      buttonLink: "https://www.zetachain.com/docs/",
      buttonText: "Learn more",
      title: "The First Universal Blockchain",
    },
    headerImgUrl: zetachainBanner.src,
  },
  // ZetaChain Testnet
  7001: {
    about:
      "ZetaChain is the first Universal Blockchain with native access to Bitcoin, Ethereum, Solana, and more, offering seamless UX and unified liquidity to the next billions of users. With its Universal EVM, ZetaChain empowers developers to build Universal Apps that operate natively across any blockchain, creating a fluid crypto ecosystem from a single platform.",
    cta: {
      backgroundImageUrl: zetachainCTA.src,
      buttonLink: "https://www.zetachain.com/docs/",
      buttonText: "Learn more",
      title: "The First Universal Blockchain",
    },
    headerImgUrl: zetachainBanner.src,
  },
  // cyber
  7560: {
    about:
      "Cyber is a Layer 2 blockchain specifically designed for social applications. Built on the Optimism Superchain, it combines high-performance infrastructure with specialized tools for social features to simplify developer workflows and accelerate their time to market.",
    cta: {
      backgroundImageUrl: cyberCTA.src,
      buttonLink: "https://cyber.co/",
      buttonText: "Learn more",
      title: "Discover Web3 Social with Cyber",
    },
    headerImgUrl: cyberChainBanner.src,
  },
  // B3 Mainnet
  8333: {
    about:
      "Created by a team of Base/Coinbase alumni and OG ETH contributors, B3 is a horizontally scaled gaming ecosystem built on Base. \n\nOur rollup network settles on Base, ensuring B3 transactions inherit the security of the EVM.",
    cta: {
      backgroundImageUrl: thirdwebCTA.src,
      buttonLink: "https://b3.fun/",
      buttonText: "Learn more",
      title: "",
    },
    headerImgUrl: thirdwebBanner.src,
  },
  // base
  8453: {
    about:
      "Base is a secure, low-cost, builder-friendly Ethereum L2 built to bring the next billion users onchain.",
    headerImgUrl: baseBanner.src,
  },
  //Shido
  9008: {
    about:
      "Shido Network is a superfast EVM chain with the lowest fees. Seamlessly interoperable with Cosmos, EVM and WASM. Bringing you the future of DeFi, unlocking unified liquidity through chain abstraction.",
    cta: {
      backgroundImageUrl: shidoCta.src,
      buttonLink: "https://shido.io/",
      buttonText: "Learn more",
      title: "Endless scalability with Shido Network",
    },
    headerImgUrl: shidoBanner.src,
  },
  //zytron
  9901: {
    about:
      "Discover Zytron - a highly customizable Layer 3 roll up stack, natively supporting Zypher’s blockchain abstraction layer for games. It is designed for production level gaming experiences, from autonomous worlds to TON-based hyper casual games.",
    cta: {
      backgroundImageUrl: zytronCTA.src,
      buttonLink: "https://zytron.zypher.network/",
      buttonText: "Learn more",
      title: "Unlock ZK Gaming with Zytron Layer3.",
    },
    headerImgUrl: zytronBanner.src,
  },
  //0G-Newton-Testnet
  16600: {
    about:
      "ZeroGravity (0G) is the first infinitely scalable and decentralized data availability layer with a built-in general-purpose storage layer.",
    cta: {
      backgroundImageUrl: zeroGCTA.src,
      buttonLink: "https://docs.0g.ai/0g-doc",
      buttonText: "Learn more",
      title: "Unlock web3's full potential with 0G",
    },
    headerImgUrl: zeroGBanner.src,
  },
  //Funki Mainnet
  33979: {
    about:
      "Funki is a fun-first L2 using OP stack, focused on onchain gaming and social experiments.\nFunki is the playground where innovative ideas come to life. We’re dedicated to building an ecosystem that upholds bold, persistent experiments.",
    cta: {
      backgroundImageUrl: funkiCTA.src,
      buttonLink: "https://docs.funkichain.com/docs",
      buttonText: "Learn More",
      title: "Enter the Rabbit hole",
    },
    headerImgUrl: funkiBanner.src,
  },
  // Aleph 0 Mainnet
  41455: {
    about:
      "Aleph Zero is a privacy-enhancing blockchain ecosystem boasting a WASM L1 and an EVM L2 that offer instant transactions, the fastest ZK-based privacy features, and a seamless developer experience.",
    cta: {
      backgroundImageUrl: alephZeroCTA.src,
      buttonLink: "https://zkos.alephzero.org/",
      buttonText: "Learn more",
      title: "See how Aleph Zero redefines EVM privacy",
    },
    headerImgUrl: alephZeroBaner.src,
  },
  //EDUMainnet
  41923: {
    about:
      "Education On-Chain - A Layer 3 blockchain preparing students and learners for the future of work while advancing onchain education finance (EduFi).",
    cta: {
      backgroundImageUrl: eduCTA.src,
      buttonLink: "https://educhain.xyz/",
      buttonText: "Learn More",
      title: "Education On-Chain",
    },
    headerImgUrl: eduBanner.src,
  },
  //Donatuz
  42026: {
    about:
      "Monetize your passion, your way. Discover the freedom to grow with our creator-focused platform.",
    headerImgUrl: thirdwebBanner.src,
  },
  //AssetChain
  42421: {
    about:
      "Asset Chain is the native blockchain for Xend Finance's Real-World Asset OAE (Onchain Asset Environment), with its consensus based on Fantom's Lachesis consensus mechanism.",
    cta: {
      backgroundImageUrl: assetChainCTABG.src,
      buttonLink: "https://docs.assetchain.org",
      buttonText: "Learn more",
      title: "Start Building",
    },
    headerImgUrl: assetChainBanner.src,
  },
  //Etherlink mainnet
  42793: {
    about:
      "Etherlink is powered by a Smart Rollup, an enshrined, optimistic rollup technology implemented by Tezos. Smoothly deploy any EVM codebase enabling seamless interaction across interoperable chains with subsecond block times and (nearly) free transactions.",
    cta: {
      backgroundImageUrl: etherlinkCTA.src,
      buttonLink: "https://www.etherlink.com",
      buttonText: "Learn More",
      title: "The fast, fair and (nearly) free L2",
    },
    headerImgUrl: etherlinkBanner.src,
  },
  //NEO X
  47763: {
    about:
      "Neo X is an EVM-compatible sidechain built by Neo, incorporating Neo's distinctive dBFT consensus mechanism. Serving as a bridge between Neo N3 and the widely used EVM network, Neo X will play a crucial role in expanding the Neo ecosystem and offering developers more opportunities for innovation.",
    cta: {
      backgroundImageUrl: NeoXCTA.src,
      buttonLink: "https://x.neo.org/",
      buttonText: "Learn More",
      title: "Learn more about Neo X",
    },
    headerImgUrl: NeoXBanner.src,
  },
  //Somnia Devnet
  50311: {
    about:
      "We are committed to building technology to make fully on-chain, real-time mass-scale applications possible and practical. We believe this is essential for creating a composable, open internet. We believe in a collection of applications, each with distinct, interconnected experiences, much like countries within a global community, sharing utilities that enhance mutual growth. \nCentral to our vision is the principle of composability—the ability for builders to build upon each other’s work, creating a culture of collaboration in which the collective output surpasses the sum of its parts. We will empower builders with the freedom to build sustainable models of engagement and ownership. This includes safeguarding the rights to digital assets and creating an environment where platform constraints do not stifle innovation.",
    cta: {
      backgroundImageUrl: somniaBanner.src,
      buttonLink: "https://codex.somnia.network",
      buttonText: "Learn More",
      title: "Somnia Devnet",
    },
    headerImgUrl: somniaBanner.src,
  },
  // Superposition Mainnet
  55244: {
    about:
      "Superposition is the first blockchain that pays you to use it. It is a DeFi native Layer-3 that focuses on novel incentives and order-flow for growth and value capture for developers and users alike.\n\nSuperpositions includes a native on-chain orderbook with faster execution speeds through Stylus, providing shared and permissionless liquidity for all apps onchain, and Super Assets, which pay yield when you both hold and use them.",
    cta: {
      backgroundImageUrl: superpositionCTA.src,
      buttonLink: "https://superposition.so/",
      buttonText: "Learn more",
      title: "The Blockchain that pays you to use it",
    },
    headerImgUrl: superpositionBanner.src,
  },

  // Ink
  57073: {
    about:
      "Ink is an Ethereum OP Stack layer 2 blockchain designed to be the house of DeFi for the Superchain, a powerful base layer for deploying innovative DeFi protocols.",
    headerImgUrl: inkBanner.src,
  },
  //Treasure Mainnet
  61166: {
    about:
      'Treasure is the decentralized game console. Powered by $MAGIC, the Treasure L2 serves as the base layer for the best cryptonative games and projects. Treasure and its network of "Infinity Chains" L3s offers EVM compatibility, massive scale, and decentralized infrastructure enshrined throughout. Combined with a passionate community and builder support, developers on Treasure are equipped with all of the tools they need to not only build great games and products, but also distribute to the masses.',
    cta: {
      backgroundImageUrl: treasureCTA.src,
      buttonLink: "https://portal.treasure.lol",
      buttonText: "Learn more",
      title: "Start building on Treasure!",
    },
    headerImgUrl: treasureBanner.src,
  },
  //Creator Mainnet
  66665: {
    about:
      "From Builders to Builders, From Idea to Creation ⚡\nCreator is AI Superhero Layer 2 Blockchain 🦇\nBuilt on the OP Stack, leveraging the robust foundation of Optimism 🟡🔴. We adopt the OP Stack's design principles because, as builders, we know they work and align perfectly with our values.\nWhy Creator?\nWe're constructing our Testnet on the Bedrock release of the OP Stack, ensuring a scalable and modular infrastructure that supports innovative and decentralized applications.\nCore Features:\n- Lightning Fast Transactions: Say goodbye to slow speeds with Creator's Layer 2 technology.\n- Low Fees: Lower transaction costs make blockchain accessible to all.\n- Scalable Infrastructure: Creator's network adapts effortlessly as you grow.",
    cta: {
      backgroundImageUrl: creatorCTA.src,
      buttonLink: "https://www.creatorchain.io/",
      buttonText: "Learn More",
      title: "From Builders to Builders, From Idea to Creation ⚡",
    },
    headerImgUrl: creatorBanner.src,
  },
  //Onyx Mainnet
  80888: {
    about:
      "Onyx is a layer 3 blockchain secured by Ethereum and Base providing developers and institutions a secure financial-purposed decentralized blockchain for banking and securities based applications. Powered by XCN.",
    cta: {
      backgroundImageUrl: onyxCTA.src,
      buttonLink: "https://onyx.org/",
      buttonText: "Learn More",
      title: "Unlock the potential of your application with Onyx Connect",
    },
    headerImgUrl: onyxBanner.src,
  },
  //Plume Testnet
  98864: {
    about:
      "Plume Network is the first full-stack L1 RWA Chain and ecosystem purpose-built for RWAfi, enabling the rapid adoption and demand-driven integration of real world assets. With 180+ projects building on the network, Plume offers a composable, EVM-compatible environment for onboarding and managing diverse real world assets. Coupled with an end-to-end tokenization engine and a network of financial infrastructure partners, Plume simplifies asset onboarding and enables seamless DeFi integration for RWAs so anyone can tokenize real world assets, distribute them globally, and make them useful for native crypto users.",
    cta: {
      backgroundImageUrl: plumeCTA.src,
      buttonLink: "https://miles.plumenetwork.xyz/",
      buttonText: "Learn more",
      title: "Participate on the Testnet Now!",
    },
    headerImgUrl: plumeBanner.src,
  },
  //Plume Mainnet
  98865: {
    about:
      "Plume Network is the first full-stack L1 RWA Chain and ecosystem purpose-built for RWAfi, enabling the rapid adoption and demand-driven integration of real world assets. With 180+ projects building on the network, Plume offers a composable, EVM-compatible environment for onboarding and managing diverse real world assets. Coupled with an end-to-end tokenization engine and a network of financial infrastructure partners, Plume simplifies asset onboarding and enables seamless DeFi integration for RWAs so anyone can tokenize real world assets, distribute them globally, and make them useful for native crypto users.",
    cta: {
      backgroundImageUrl: plumeCTA.src,
      buttonLink: "https://miles.plumenetwork.xyz/",
      buttonText: "Learn more",
      title: "Bringing the Real World Onchain",
    },
    headerImgUrl: plumeBanner.src,
  },
  //Plume Mainnet
  98866: {
    about:
      "Plume Network is the first full-stack L1 RWA Chain and ecosystem purpose-built for RWAfi, enabling the rapid adoption and demand-driven integration of real world assets. With 180+ projects building on the network, Plume offers a composable, EVM-compatible environment for onboarding and managing diverse real world assets. Coupled with an end-to-end tokenization engine and a network of financial infrastructure partners, Plume simplifies asset onboarding and enables seamless DeFi integration for RWAs so anyone can tokenize real world assets, distribute them globally, and make them useful for native crypto users.",
    cta: {
      backgroundImageUrl: plumeCTA.src,
      buttonLink: "https://miles.plumenetwork.xyz/",
      buttonText: "Learn more",
      title: "Bringing the Real World Onchain",
    },
    headerImgUrl: plumeBanner.src,
  },
  //Plume Mainnet
  98867: {
    about:
      "Plume Network is the first full-stack L1 RWA Chain and ecosystem purpose-built for RWAfi, enabling the rapid adoption and demand-driven integration of real world assets. With 180+ projects building on the network, Plume offers a composable, EVM-compatible environment for onboarding and managing diverse real world assets. Coupled with an end-to-end tokenization engine and a network of financial infrastructure partners, Plume simplifies asset onboarding and enables seamless DeFi integration for RWAs so anyone can tokenize real world assets, distribute them globally, and make them useful for native crypto users.",
    cta: {
      backgroundImageUrl: plumeCTA.src,
      buttonLink: "https://miles.plumenetwork.xyz/",
      buttonText: "Learn more",
      title: "Bringing the Real World Onchain",
    },
    headerImgUrl: plumeBanner.src,
  },
  // Superposition Testnet
  98985: {
    about:
      "Superposition is the first blockchain that pays you to use it. It is a DeFi native Layer-3 that focuses on novel incentives and order-flow for growth and value capture for developers and users alike.\n\nSuperpositions includes a native on-chain orderbook with faster execution speeds through Stylus, providing shared and permissionless liquidity for all apps onchain, and Super Assets, which pay yield when you both hold and use them.",
    cta: {
      backgroundImageUrl: superpositionCTA.src,
      buttonLink: "https://superposition.so/",
      buttonText: "Learn more",
      title: "The Blockchain that pays you to use it",
    },
    headerImgUrl: superpositionBanner.src,
  },

  //Etherlink Testnet
  128123: {
    about:
      "Etherlink is powered by a Smart Rollup, an enshrined, optimistic rollup technology implemented by Tezos. Smoothly deploy any EVM codebase enabling seamless interaction across interoperable chains with subsecond block times and (nearly) free transactions.",
    cta: {
      backgroundImageUrl: etherlinkCTA.src,
      buttonLink: "https://www.etherlink.com",
      buttonText: "Learn More",
      title: "The fast, fair and (nearly) free L2",
    },
    headerImgUrl: etherlinkBanner.src,
  },
  //Saakuru Testnet
  247253: {
    about:
      "Saakuru Labs is a Web3 GameFi innovation and growth hub, dedicated to empowering game studios through tailored collaborations that cater to their unique needs and stages of game development. By providing a structured process to evaluate and support studios, Saakuru Labs aims to expand the Saakuru gaming ecosystem while ensuring the success of its partners.",
    cta: {
      backgroundImageUrl: saakuruCTA.src,
      buttonLink: "https://saakuru.com/",
      buttonText: "Learn More",
      title: "Empowering Next-Gen Blockchain Gaming",
    },
    headerImgUrl: saakuruBanner.src,
  },
  //CampNetwork Testnet v2
  325000: {
    about:
      "Camp Network is the user identity layer across blockchains. Camp aggregates online user data, enabling users to own and monetize their identity while helping teams better understand user behavior.",
    cta: {
      backgroundImageUrl: thirdwebCTA.src,
      buttonLink: "https://www.campnetwork.xyz/",
      buttonText: "Learn more",
      title: "",
    },
    headerImgUrl: thirdwebBanner.src,
  },
  //EDU Testnet <Open Campus Codex>
  656476: {
    about:
      "Education On-Chain - A Layer 3 blockchain preparing students and learners for the future of work while advancing onchain education finance (EduFi).",
    cta: {
      backgroundImageUrl: eduCTA.src,
      buttonLink: "https://educhain.xyz/",
      buttonText: "Learn More",
      title: "Education On-Chain",
    },
    headerImgUrl: eduBanner.src,
  },
  // XAI
  660279: {
    about:
      "Xai was developed to enable real economies and open trade in the next generation of video games. With Xai, potentially billions of traditional gamers can own and trade valuable in-game items in their favorite games for the first time, without the need to use crypto-wallets.",

    cta: {
      backgroundImageUrl: xaiCTABg.src,
      buttonLink: "https://connect.xai.games",
      buttonText: "Learn more",
      title: "Unlock ultimate possibility with Xai Connect",
    },
    headerImgUrl: xaiBanner.src,
  },
  //HemiSepolia
  743111: {
    about:
      "The Hemi Network is a modular Layer-2 protocol for superior scaling, security, and interoperability, powered by Bitcoin and Ethereum.",
    cta: {
      backgroundImageUrl: hemiSepoliaCTA.src,
      buttonLink: "https://hemi.xyz/",
      buttonText: "Learn More",
      title: "One Network, Powered by Bitcoin and Ethereum",
    },
    headerImgUrl: hemiSepoliaBanner.src,
  },
  //treasure-Ruby
  978657: {
    about:
      'Treasure is the decentralized game console. Powered by $MAGIC, the Treasure L2 serves as the base layer for the best cryptonative games and projects. Treasure and its network of "Infinity Chains" L3s offers EVM compatibility, massive scale, and decentralized infrastructure enshrined throughout. Combined with a passionate community and builder support, developers on Treasure are equipped with all of the tools they need to not only build great games and products, but also distribute to the masses.',
    cta: {
      backgroundImageUrl: treasureCTA.src,
      buttonLink: "https://portal.treasure.lol",
      buttonText: "Learn more",
      title: "Start building on Treasure!",
    },
    headerImgUrl: treasureBanner.src,
  },
  //Treasure Topaz
  978658: {
    about:
      'Treasure is the decentralized game console. Powered by $MAGIC, the Treasure L2 serves as the base layer for the best cryptonative games and projects. Treasure and its network of "Infinity Chains" L3s offers EVM compatibility, massive scale, and decentralized infrastructure enshrined throughout. Combined with a passionate community and builder support, developers on Treasure are equipped with all of the tools they need to not only build great games and products, but also distribute to the masses.',
    cta: {
      backgroundImageUrl: treasureCTA.src,
      buttonLink: "https://portal.treasure.lol",
      buttonText: "Learn more",
      title: "Start building on Treasure!",
    },
    headerImgUrl: treasureBanner.src,
  },
  //COTI Mainnet
  2632500: {
    about:
      "COTI is the fastest, lightest privacy layer in Web3, powered by the breakthrough cryptographic protocol Garbled Circuits. Build with privacy. Scale with speed.",
    cta: {
      backgroundImageUrl: cotiCTA.src,
      buttonLink: "https://thirdweb.com/coti",
      buttonText: "Learn More",
      title: "The Fastest, Lightest Privacy Layer in Web3",
    },
    headerImgUrl: cotiBanner.src,
  },
  //Funki Testnet
  3397901: {
    about:
      "Funki is a fun-first L2 using OP stack, focused on onchain gaming and social experiments.\nFunki is the playground where innovative ideas come to life. We’re dedicated to building an ecosystem that upholds bold, persistent experiments.",
    cta: {
      backgroundImageUrl: funkiCTA.src,
      buttonLink: "https://docs.funkichain.com/docs",
      buttonText: "Learn More",
      title: "Enter the Rabbit hole",
    },
    headerImgUrl: funkiBanner.src,
  },
  //COTI Testnet
  7082400: {
    about:
      "COTI is the fastest, lightest privacy layer in Web3, powered by the breakthrough cryptographic protocol Garbled Circuits. Build with privacy. Scale with speed.",
    cta: {
      backgroundImageUrl: cotiCTA.src,
      buttonLink: "https://thirdweb.com/coti",
      buttonText: "Learn More",
      title: "The Fastest, Lightest Privacy Layer in Web3",
    },
    headerImgUrl: cotiBanner.src,
  },
  //Saakuru Mainnet
  7225878: {
    about:
      "Saakuru Labs is a Web3 GameFi innovation and growth hub, dedicated to empowering game studios through tailored collaborations that cater to their unique needs and stages of game development. By providing a structured process to evaluate and support studios, Saakuru Labs aims to expand the Saakuru gaming ecosystem while ensuring the success of its partners.",
    cta: {
      backgroundImageUrl: saakuruCTA.src,
      buttonLink: "https://saakuru.com/",
      buttonText: "Learn More",
      title: "Empowering Next-Gen Blockchain Gaming",
    },
    headerImgUrl: saakuruBanner.src,
  },
  //NEO X Testnet
  12227332: {
    about:
      "Neo X is an EVM-compatible sidechain built by Neo, incorporating Neo's distinctive dBFT consensus mechanism. Serving as a bridge between Neo N3 and the widely used EVM network, Neo X will play a crucial role in expanding the Neo ecosystem and offering developers more opportunities for innovation.",
    cta: {
      backgroundImageUrl: NeoXCTA.src,
      buttonLink: "https://x.neo.org/",
      buttonText: "Learn More",
      title: "Learn more about Neo X",
    },
    headerImgUrl: NeoXBanner.src,
  },

  // ancient8
  888888888: {
    about:
      "Ancient8 is building an ETH gaming Layer 2 built with OP Stack, offering a suite of Web3 gaming infrastructure tools that serve as the distribution and marketing channel for games globally. With Space3 Game Publishing Platform, Ancient8 Gaming Guild, Reneverse Web3 Ads engine, A8ID, and Gosu Network, Ancient8 is dedicated to onboard millions of gamers to Web3 gaming, while providing unparalleled support to game developers looking to reach more players. Ancient8’s products have helped 100+ Web3 games and 200K+ users better navigate Web3.\n\nAncient8 has raised $10M in total financing from leading investors including Pantera, Dragonfly, Hashed, Makers Fund, Mechanism, Coinbase, IOSG, Jump and Animoca.",
    headerImgUrl: ancient8Banner.src,
  },
  // lumia Mainnet
  994873017: {
    about:
      "Lumia is the only full-cycle RWA chain, merging zkEVM technology with a robust infrastructure purpose-built for institutional and retail asset tokenization. Featuring advanced compliance tools such as on-chain KYC/AML via PolygonID, OFAC sanctions screening at the sequencer level, and AI-powered threat detection, Lumia Chain ensures security and regulatory adherence. Its unique volition architecture enables users to toggle between cost-efficient validium mode and highly secure rollup mode, providing flexibility for diverse needs. Lumia goes beyond tokenization by seamlessly integrating RWAs into DeFi. RWAs minted on Lumia Chain are instantly composable with native DeFi protocols like lending, AMMs, and perpetual markets, creating a tailored environment for RWA owners. With ERC-20 compatibility, native interoperability, and integration with major DeFi aggregators like 1inch and 0x, Lumia ensures that tokenized RWAs are not only secure and scalable but also accessible across the broader DeFi ecosystem.",
    cta: {
      backgroundImageUrl: lumiaBanner.src,
      buttonLink:
        "https://docs.lumia.org/build/smartcontracts/deployment#deploy-contract-on-shiden",
      buttonText: "Learn more",
      title:
        "Build Smarter. Scale Faster. Lumia - The Only Full-Cycle RWA Chain",
    },
    headerImgUrl: lumiaBanner.src,
  },
  //GPT Mainnet
  1511670449: {
    about:
      "GPT Protocol combines cutting-edge L2 EVM technology with seamless AI integration to power the future of decentralized applications. By enabling ultra-fast transactions, unmatched scalability, and eco-friendly solutions, GPT Protocol opens doors to developers, brands, and users alike. With innovative tools, a robust ecosystem, and low transaction costs, GPT Protocol is designed for a smarter, more connected blockchain experience. Join us in building the next generation of decentralized innovation.",
    cta: {
      backgroundImageUrl: gptCTA.src,
      buttonLink: "https://www.gptprotocol.com/",
      buttonText: "Learn more",
      title: "Build on the blockchain for AI",
    },
    headerImgUrl: gptChainBanner.src,
  },
  //Gemuchain -- Deprecated
  1903648807: {
    about:
      "Is a new Layer 2 integrating Al, Cybersecurity, ZK and a new Consensus layer - Proof Of Longevity. It will protect projects from bad actors and practices including hacks, manipulations, MEV bots and more, penalize bad actors and reward good actors and long term holders, so unlike anything out there today.",
    cta: {
      backgroundImageUrl: thirdwebCTA.src,
      buttonLink: "https://gemuchain.io/",
      buttonText: "Learn more",
      title: "",
    },
    headerImgUrl: thirdwebBanner.src,
  },
  // lumia Testnet
  1952959480: {
    about:
      "Lumia is the only full-cycle RWA chain, merging zkEVM technology with a robust infrastructure purpose-built for institutional and retail asset tokenization. Featuring advanced compliance tools such as on-chain KYC/AML via PolygonID, OFAC sanctions screening at the sequencer level, and AI-powered threat detection, Lumia Chain ensures security and regulatory adherence. Its unique volition architecture enables users to toggle between cost-efficient validium mode and highly secure rollup mode, providing flexibility for diverse needs. Lumia goes beyond tokenization by seamlessly integrating RWAs into DeFi. RWAs minted on Lumia Chain are instantly composable with native DeFi protocols like lending, AMMs, and perpetual markets, creating a tailored environment for RWA owners. With ERC-20 compatibility, native interoperability, and integration with major DeFi aggregators like 1inch and 0x, Lumia ensures that tokenized RWAs are not only secure and scalable but also accessible across the broader DeFi ecosystem.",
    cta: {
      backgroundImageUrl: lumiaBanner.src,
      buttonLink:
        "https://docs.lumia.org/build/smartcontracts/deployment#deploy-contract-on-shiden",
      buttonText: "Learn more",
      title:
        "Build Smarter. Scale Faster. Lumia - The Only Full-Cycle RWA Chain",
    },
    headerImgUrl: lumiaBanner.src,
  },
} satisfies Record<number, ExtraChainMetadata>;
// END TEMPORARY

export async function getChainMetadata(
  chainId: number,
): Promise<(ExtraChainMetadata & { gasSponsored?: true }) | null> {
  // TODO: fetch this from the API
  if (chainId in chainMetaRecord) {
    return {
      // this will OVERRIDE the op CTA if there is a custom one configured
      ...chainMetaRecord[chainId as keyof typeof chainMetaRecord],
    };
  }
  return null;
}
