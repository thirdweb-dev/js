import type { Address } from "thirdweb";

export type Erc721 = {
  chainName: string;
  chainId: number;
  contractAddress: Address;
  tokenId: number;
  name: string;
  description: string;
  image_url: string;
};
