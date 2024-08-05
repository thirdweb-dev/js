import type { Address } from "thirdweb";

export type Erc721Token = {
  chainId: number;
  contractAddress: Address;
  contract: {
    type: "ERC721";
    name: string;
    symbol: string;
  };
  collection: {
    name: string;
    description: string;
    image_url: string;
  };
  tokenId: number;
  name: string;
  description: string;
  image_url: string;
};
