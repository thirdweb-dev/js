import { NFT } from "@thirdweb-dev/react";

export type WalletNFT = NFT<any> & {
  contractAddress: string;
  tokenId: number;
};
