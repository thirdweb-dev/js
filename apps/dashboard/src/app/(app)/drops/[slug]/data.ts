import type { Metadata } from "next";

type DropPageData = {
  slug: string;
  contractAddress: string;
  chainId: number;
  hideQuantitySelector?: boolean;
  hideMintToCustomAddress?: boolean;
  // If not defined, we will use the image of the NFT or contract's image
  thumbnail?: string;
  metadata: Metadata;
} & ({ type: "erc1155"; tokenId: bigint } | { type: "erc721" });

export const DROP_PAGES: DropPageData[] = [
  {
    chainId: 11155111,
    contractAddress: "0xBD9d7f15f3C850B35c30b8F9F698B511c20b7263",
    hideMintToCustomAddress: true,
    hideQuantitySelector: true,
    metadata: {
      description: "none",
      title: "Test mint page",
    },
    slug: "test",
    thumbnail: "/drops/zerion.mp4",
    tokenId: 0n,
    type: "erc1155",
  },
  {
    chainId: 543210,
    contractAddress: "0x78264a0af02d894f2d9ae3e11E4a503b352CC437",
    hideMintToCustomAddress: true,
    hideQuantitySelector: true,
    metadata: {
      description:
        "This exclusive commemorative NFT marks the official launch of ZERϴ's mainnet and our exciting partnership with thirdweb. Own a piece of this milestone in blockchain history as we make onchain transactions free with zero.network",
      openGraph: {
        description:
          "This exclusive commemorative NFT marks the official launch of ZERϴ's mainnet and our exciting partnership with thirdweb. Own a piece of this milestone in blockchain history as we make onchain transactions free with zero.network",
        title: "ZERO x thirdweb",
      },
      title: "ZERO x thirdweb",
    },
    slug: "zero-chain-announcement",
    thumbnail: "/drops/zerion.mp4",
    tokenId: 0n,
    type: "erc1155",
  },

  // Add more chains here
];
