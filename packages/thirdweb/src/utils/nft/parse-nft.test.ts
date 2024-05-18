import { describe, expect, it } from "vitest";
import {
  type NFT,
  type NFTMetadata,
  type ParseNFTOptions,
  parseNFT,
} from "./parseNft.js";

const base: NFTMetadata = {
  id: 0n,
  uri: "ipfs://",
};

describe("parseNft", () => {
  it("should parse ERC721 token", () => {
    const option: ParseNFTOptions = {
      tokenId: 0n,
      tokenUri: "ipfs://",
      type: "ERC721",
    };
    const result = parseNFT(base, option);
    const expectedResult: NFT = {
      metadata: base,
      owner: option.owner ?? null,
      id: option.tokenId,
      tokenURI: option.tokenUri,
      type: option.type,
    };
    expect(result).toMatchObject(expectedResult);
  });

  it("should parse ERC1155 token", () => {
    const option: ParseNFTOptions = {
      tokenId: 0n,
      tokenUri: "ipfs://",
      type: "ERC1155",
      supply: 10n,
    };
    const expectedResult: NFT = {
      metadata: base,
      owner: option.owner ?? null,
      id: option.tokenId,
      tokenURI: option.tokenUri,
      type: option.type,
      supply: option.supply,
    };
    const result = parseNFT(base, option);
    expect(result).toMatchObject(expectedResult);
  });

  it("should throw an error for unexpected NFT token type", () => {
    const option = {
      tokenId: 0n,
      tokenUri: "ipfs://",
      type: "ERC-NOT-EXIST",
    };
    // @ts-ignore For testing purpose
    expect(() => parseNFT(base, option)).toThrowError(/Invalid NFT type/);
  });
});
