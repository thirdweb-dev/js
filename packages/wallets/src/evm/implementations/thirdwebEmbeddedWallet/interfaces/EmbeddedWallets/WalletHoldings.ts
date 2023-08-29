import type { Chain } from "@paperxyz/sdk-common-utilities";

export type WalletHoldingInputType = {
  chain: Chain;
  limit: number;
  offset: number;
};

export type WalletHoldingNftsReturnType = Array<{
  imageUrl: string;
  name: string;
}>;

export interface INftMetadata {
  amount: number | null;
  animationUrl: string | null;
  contractAddress: string | null;
  chainName: string | null;
  description: string | null;
  image: string | null;
  marketplaceUrls: { opensea: string };
  name: string | null;
  tokenCount: number | null;
  tokenId: string | number | null;
  tokenType: "erc1155" | "erc721" | null;
}

export type WalletHoldingTokensReturnType = INftMetadata[];
