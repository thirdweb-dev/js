import { describe, expect, it } from "vitest";
import { TEST_CLIENT } from "~test/test-clients.js";
import {
  type NFT,
  type NFTMetadata,
  type ParseNFTOptions,
  parseNFT,
  parseNftUri,
} from "./parseNft.js";

const base: NFTMetadata = {
  id: 0n,
  uri: "ipfs://",
};

const client = TEST_CLIENT;

describe("parseNft", () => {
  it("should parse ERC721 token", () => {
    const option: ParseNFTOptions = {
      chainId: 1,
      tokenAddress: "0x1234567890123456789012345678901234567890",
      tokenId: 0n,
      tokenUri: "ipfs://",
      type: "ERC721",
    };
    const result = parseNFT(base, option);
    const expectedResult: NFT = {
      chainId: option.chainId,
      id: option.tokenId,
      metadata: base,
      owner: option.owner ?? null,
      tokenAddress: option.tokenAddress,
      tokenURI: option.tokenUri,
      type: option.type,
    };
    expect(result).toMatchObject(expectedResult);
  });

  it("should parse ERC1155 token", () => {
    const option: ParseNFTOptions = {
      chainId: 1,
      supply: 10n,
      tokenAddress: "0x1234567890123456789012345678901234567890",
      tokenId: 0n,
      tokenUri: "ipfs://",
      type: "ERC1155",
    };
    const expectedResult: NFT = {
      chainId: option.chainId,
      id: option.tokenId,
      metadata: base,
      owner: option.owner ?? null,
      supply: option.supply,
      tokenAddress: option.tokenAddress,
      tokenURI: option.tokenUri,
      type: option.type,
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

  it("should throw an error for an invalid EIP namespace", async () => {
    const uri = "invalid:1/erc721:0x1234567890abcdef1234567890abcdef12345678/1";
    await expect(parseNftUri({ client, uri })).rejects.toThrow(
      'Invalid EIP namespace, expected EIP155, got: "invalid"',
    );
  });

  it("should throw an error for a missing chain ID", async () => {
    const uri = "eip155:/erc721:0x1234567890abcdef1234567890abcdef12345678/1";
    await expect(parseNftUri({ client, uri })).rejects.toThrow(
      "Chain ID not found",
    );
  });

  it("should throw an error for an invalid contract address", async () => {
    const uri = "eip155:1/erc721:invalid-address/1";
    await expect(parseNftUri({ client, uri })).rejects.toThrow(
      "Contract address not found",
    );
  });

  it("should throw an error for a missing token ID", async () => {
    const uri = "eip155:1/erc721:0x1234567890abcdef1234567890abcdef12345678/";
    await expect(parseNftUri({ client, uri })).rejects.toThrow(
      "Token ID not found",
    );
  });

  it("should throw an error for an invalid ERC namespace", async () => {
    const uri = "eip155:1/invalid:0x1234567890abcdef1234567890abcdef12345678/1";
    await expect(parseNftUri({ client, uri })).rejects.toThrow(
      'Invalid ERC namespace, expected ERC721 or ERC1155, got: "invalid"',
    );
  });
});
