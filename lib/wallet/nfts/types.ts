import type { NFT } from "@thirdweb-dev/sdk";

export type WalletNFT = NFT & {
  contractAddress: string;
  tokenId: number;
};
