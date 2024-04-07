import { TemplateTagId } from "./tags";

export interface TemplateCardProps {
  id: string;
  title: string;
  // Homepage is usually just <id>.thirdweb-example.com, but just to be safe.
  homepage: string;
  // Repo is usually just github.com/thirdweb-example/<id>, but just to be safe.
  repo: string;
  description: string;
  img: string;
  hoverBorderColor: string;
  tags: TemplateTagId[];
  authorIcon: string;
  authorENS: string;
  contractName?: string;
  contractLink?: string;

  // Hidden on the front-end - for search purpose only
  // To improve the search result, put as many relevant tagId in here as possible
  keywords?: TemplateTagId[];
}

export const TEMPLATE_DATA: TemplateCardProps[] = [
  {
    id: "unity-pioneer",
    title: "Pioneer",
    homepage: "https://thirdweb-example.github.io/unity-take-flight/",
    repo: "https://github.com/thirdweb-example/unity-take-flight",
    description: "Unity template with seamless onboarding experience",
    img: "/assets/templates/unity-pioneer.png",
    hoverBorderColor: "hsl(248deg 89% 79% / 15%)",
    tags: ["unity"],
    authorENS: "thirdweb.eth",
    authorIcon: "/assets/templates/thirdweb-eth.png",
  },
  {
    id: "unity-take-flight",
    title: "Take Flight",
    homepage: "https://thirdweb-example.github.io/unity-pioneer/",
    repo: "https://github.com/thirdweb-example/unity-pioneer",
    description:
      "Unity template featuring Account Abstraction, Session Keys, and Storage",
    img: "/assets/templates/unity-take-flight.png",
    hoverBorderColor: "hsl(248deg 89% 79% / 15%)",
    tags: ["unity"],
    authorENS: "thirdweb.eth",
    authorIcon: "/assets/templates/thirdweb-eth.png",
  },
  {
    id: "unity-blockventure",
    title: "Blockventure",
    homepage: "https://github.com/thirdweb-example/unity-blockventure",
    repo: "https://github.com/thirdweb-example/unity-blockventure",
    description: "Lite RPG Gathering, Shopping and Trading Systems.",
    img: "/assets/templates/unity-blockventure.png",
    hoverBorderColor: "hsl(248deg 89% 79% / 15%)",
    tags: ["unity"],
    authorENS: "thirdweb.eth",
    authorIcon: "/assets/templates/thirdweb-eth.png",
  },
  {
    id: "unity-iap-client",
    title: "Unity IAP Client",
    homepage:
      "https://blog.thirdweb.com/guides/enhancing-unity-iap-with-blockchain-interactions/",
    repo: "https://github.com/thirdweb-example/unity-iap-client/",
    description:
      "Blockchain integration with Unity IAP and server side validation.",
    img: "/assets/templates/unity-iap.png",
    hoverBorderColor: "hsl(248deg 89% 79% / 15%)",
    tags: ["engine", "unity"],
    authorENS: "thirdweb.eth",
    authorIcon: "/assets/templates/thirdweb-eth.png",
  },
  {
    id: "unity-iap-server",
    title: "Unity IAP Server",
    homepage:
      "https://blog.thirdweb.com/guides/enhancing-unity-iap-with-blockchain-interactions/",
    repo: "https://github.com/thirdweb-example/unity-iap-server/",
    description:
      "Server implementation compatible with Unity IAP Apple and Google receipts",
    img: "/assets/templates/unity-iap.png",
    hoverBorderColor: "hsl(248deg 89% 79% / 15%)",
    tags: ["engine", "unity"],
    authorENS: "thirdweb.eth",
    authorIcon: "/assets/templates/thirdweb-eth.png",
  },
  {
    id: "mintcaster",
    title: "Mintcaster",
    homepage: "https://mintcaster.thirdweb-example.com/",
    repo: "https://github.com/thirdweb-example/mintcaster/",
    description:
      "Bootstrap your own client on Farcaster — with a feed, cast functionality, and Sign-in with Farcaster auth. Add NFT minting functionality with thirdweb Engine.",
    img: "/assets/templates/mintcaster.png",
    hoverBorderColor: "hsl(248deg 89% 79% / 15%)",
    tags: ["engine", "unity"],
    authorENS: "thirdweb.eth",
    authorIcon: "/assets/templates/thirdweb-eth.png",
  },
  {
    id: "web3warriors",
    title: "Web3 Warriors",
    homepage: "https://web3warriors.thirdweb.com/",
    repo: "https://blog.thirdweb.com/how-we-built-web3-warriors/",
    description: "Dungeon crawler demo game built with thirdweb Unity SDK.",
    img: "/assets/templates/web3-warriors.png",
    hoverBorderColor: "hsl(248deg 89% 79% / 15%)",
    tags: ["engine", "unity"],
    authorENS: "thirdweb.eth",
    authorIcon: "/assets/templates/thirdweb-eth.png",
  },
  {
    id: "catattacknft",
    title: "Cat Attack",
    homepage: "https://catattack.thirdweb.com",
    repo: "https://github.com/thirdweb-example/catattacknft",
    description: "Strategy demo game built with thirdweb SDKs.",
    img: "/assets/templates/cat-attack.png",
    hoverBorderColor: "hsl(248deg 89% 79% / 15%)",
    tags: ["gaming", "typescript"],
    authorENS: "thirdweb.eth",
    authorIcon: "/assets/templates/thirdweb-eth.png",
  },
  {
    id: "unreal_demo",
    title: "Speed Racers",
    homepage: "https://engine-express.thirdweb-preview.com/",
    repo: "https://github.com/thirdweb-example/unreal_demo",
    description: "Racing demo game using Unreal and thirdweb Engine.",
    img: "/assets/templates/speed-racer.png",
    hoverBorderColor: "hsl(248deg 89% 79% / 15%)",
    tags: ["gaming", "engine", "unreal"],
    authorENS: "thirdweb.eth",
    authorIcon: "/assets/templates/thirdweb-eth.png",
  },
  {
    id: "phygital-experience",
    title: "Phygital Experience",
    homepage: "https://engine-phygital.vercel.app/qrs",
    repo: "https://github.com/thirdweb-example/engine-phygital",
    description:
      "Allow users to scan a QR code received with a physical product to mint an NFT using thirdweb engine.",
    img: "/assets/templates/phygital-experience.png",
    hoverBorderColor: "hsl(248deg 89% 79% / 15%)",
    tags: ["erc721", "engine", "phygital"],
    authorENS: "thirdweb.eth",
    authorIcon: "/assets/templates/thirdweb-eth.png",
  },
  {
    id: "engine-nft-checkout",
    title: "Fiat NFT checkout",
    homepage: "https://engine-nft-checkout.thirdweb-example.com/",
    repo: "https://github.com/thirdweb-example/engine-nft-checkout",
    description:
      "Allow users to buy an NFT via a fiat checkout flow using thirdweb engine.",
    img: "/assets/templates/engine-nft-checkout.png",
    hoverBorderColor: "hsl(248deg 89% 79% / 15%)",
    tags: ["engine", "erc721"],
    authorENS: "thirdweb.eth",
    authorIcon: "/assets/templates/thirdweb-eth.png",
  },
  {
    id: "loyalty-card",
    title: "Loyalty Card",
    homepage: "https://loyalty-card.thirdweb-example.com",
    repo: "https://github.com/thirdweb-example/loyalty-card/",
    description:
      "Allow users to generate a loyalty card and admins to manage the loyalty cards.",
    img: "/assets/templates/loyalty-card.png",
    hoverBorderColor: "hsl(248deg 89% 79% / 15%)",
    tags: ["signature-minting", "loyalty-card"],
    authorENS: "thirdweb.eth",
    authorIcon: "/assets/templates/thirdweb-eth.png",
  },
  {
    id: "erc721",
    title: "NFT Drop",
    homepage: "https://nft-drop.thirdweb-example.com/",
    repo: "https://github.com/thirdweb-example/nft-drop",
    description:
      "Allow users to claim tokens under the criteria of claim conditions to receive ERC721 NFT(s).",
    img: "/assets/templates/nft-drop.png",
    hoverBorderColor: "hsl(248deg 89% 79% / 15%)",
    tags: ["erc721", "claim-conditions"],
    authorENS: "thirdweb.eth",
    authorIcon: "/assets/templates/thirdweb-eth.png",
    contractName: "NFTDrop",
    contractLink: "/thirdweb.eth/DropERC721",
  },
  {
    id: "marketplace-v3",
    title: "Marketplace",
    homepage: "https://marketplace-v3.thirdweb-example.com/",
    repo: "https://github.com/thirdweb-example/marketplace-v3",
    description:
      "Allow holders of your NFTs to trade in a marketplace with a built-in escrow and auctioning system.",
    img: "/assets/templates/marketplace.png",
    hoverBorderColor: "hsl(309deg 54% 81% / 15%)",
    tags: ["multi-currency", "buy-&-sell", "marketplace"],
    authorENS: "thirdweb.eth",
    authorIcon: "/assets/templates/thirdweb-eth.png",
    contractName: "Marketplace",
    contractLink: "/thirdweb.eth/MarketplaceV3",
  },
  {
    id: "nft-gated-website",
    title: "NFT Gated Website",
    homepage: "https://nft-gated-website.thirdweb-example.com/",
    repo: "https://github.com/thirdweb-example/nft-gated-website",
    description:
      "Allow users to access your website only if they own a specific NFT.",
    img: "/assets/templates/nft-gated-site.png",
    hoverBorderColor: "hsl(309deg 54% 81% / 15%)",
    tags: ["nft", "react", "loyalty"],
    authorENS: "thirdweb.eth",
    authorIcon: "/assets/templates/thirdweb-eth.png",
  },
  {
    id: "nft-gallery",
    title: "NFT Gallery",
    homepage: "https://nft-gallery.thirdweb-example.com/",
    repo: "https://github.com/thirdweb-example/nft-gallery",
    description:
      "View the metadata of all NFTs in your collection, where you can filter and sort by traits & properties.",
    img: "/assets/templates/nft-gallery.png",
    hoverBorderColor: "hsl(309deg 54% 81% / 15%)",
    tags: ["erc721", "erc1155"],
    authorENS: "thirdweb.eth",
    authorIcon: "/assets/templates/thirdweb-eth.png",
  },
  {
    id: "vite-starter",
    title: "Vite Starter",
    homepage: "vite-starter.thirdweb-example.com",
    repo: "https://github.com/thirdweb-example/vite-starter",
    description: "Vite Starter template using V5 of the thirdweb SDK",
    img: "/assets/templates/vite-starter.png",
    hoverBorderColor: "hsl(309deg 54% 81% / 15%)",
    tags: ["vite-js", "starter"],
    authorENS: "thirdweb.eth",
    authorIcon: "/assets/templates/thirdweb-eth.png",
  },
  {
    id: "next-starter",
    title: "Next Starter",
    homepage: "next-starter.thirdweb-example.com",
    repo: "https://github.com/thirdweb-example/next-starter",
    description: "Next Starter template using V5 of the thirdweb SDK",
    img: "/assets/templates/next-starter.png",
    hoverBorderColor: "hsl(309deg 54% 81% / 15%)",
    tags: ["next-js", "starter"],
    authorENS: "thirdweb.eth",
    authorIcon: "/assets/templates/thirdweb-eth.png",
  },
];
