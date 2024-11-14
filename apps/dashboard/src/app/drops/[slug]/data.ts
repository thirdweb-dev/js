import type { Metadata } from "next";
import type { GaslessOptions } from "thirdweb/transaction";

type DropPageData = {
  slug: string;
  contractAddress: string;
  chainId: number;
  hideQuantitySelector?: boolean;
  hideMintToCustomAddress?: boolean;
  // If not defined, we will use the image of the NFT or contract's image
  thumbnail?: string;
  metadata: Metadata;
  gasless?: GaslessOptions;
} & ({ type: "erc1155"; tokenId: bigint } | { type: "erc721" });

export const DROP_PAGES: DropPageData[] = [
  {
    slug: "test",
    type: "erc1155",
    contractAddress: "0xBD9d7f15f3C850B35c30b8F9F698B511c20b7263",
    tokenId: 0n,
    chainId: 11155111,
    hideQuantitySelector: true,
    hideMintToCustomAddress: true,
    thumbnail: "/drops/zerion.mp4",
    metadata: {
      title: "Test mint page",
      description: "none",
    },
  },
  {
    slug: "zero-chain-announcement",
    type: "erc1155",
    contractAddress: "0x78264a0af02d894f2d9ae3e11E4a503b352CC437",
    tokenId: 0n,
    chainId: 543210,
    hideMintToCustomAddress: true,
    hideQuantitySelector: true,
    thumbnail: "/drops/zerion.mp4",
    metadata: {
      title: "ZERO x thirdweb",
      description:
        "This exclusive commemorative NFT marks the official launch of ZERϴ's mainnet and our exciting partnership with thirdweb. Own a piece of this milestone in blockchain history as we make onchain transactions free with zero.network",
      openGraph: {
        title: "ZERO x thirdweb",
        description:
          "This exclusive commemorative NFT marks the official launch of ZERϴ's mainnet and our exciting partnership with thirdweb. Own a piece of this milestone in blockchain history as we make onchain transactions free with zero.network",
      },
    },
    gasless: {
      provider: "engine",
      relayerForwarderAddress: "",
      relayerUrl:
        "https://thirdweb.engine-usw2.thirdweb.com/relayer/790e2b34-a35d-4526-9396-f2163eb6e3a5",
    },
  },

  // Add more chains here
];
