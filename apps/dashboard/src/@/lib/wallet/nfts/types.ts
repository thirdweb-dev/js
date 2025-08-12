import type { NFT } from "thirdweb";

export type OwnedNFT = {
  id: string;
  contractAddress: string;
  type: NFT["type"];
  metadata: NFT["metadata"];
};
