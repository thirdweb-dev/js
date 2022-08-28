import { Amount } from "./currency";
import { BigNumberish } from "ethers";

/**
 * Represents a certain amount of ERC20 tokens that can be wrapped
 */
export type ERC20Wrappable = {
  contractAddress: string;
  quantity: Amount;
};

/**
 * Represents a ERC721 NFT that can be wrapped
 */
export type ERC721Wrappable = {
  contractAddress: string;
  tokenId: BigNumberish;
};

/**
 * Represents a certain amount of ERC1155 NFTs that can be wrapped
 */
export type ERC1155Wrappable = {
  contractAddress: string;
  quantity: Amount;
  tokenId: BigNumberish;
};

/**
 * Input for wrapping any number of tokens
 */
export type TokensToWrap = {
  erc20Tokens?: ERC20Wrappable[];
  erc721Tokens?: ERC721Wrappable[];
  erc1155Tokens?: ERC1155Wrappable[];
};

/**
 * Output for the contents of a bundle wrapped token
 */
export type WrappedTokens = {
  erc20Tokens: ERC20Wrappable[];
  erc721Tokens: ERC721Wrappable[];
  erc1155Tokens: ERC1155Wrappable[];
};
