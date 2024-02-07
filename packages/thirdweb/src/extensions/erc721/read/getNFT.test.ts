import { describe, it, expect, vi, afterEach } from "vitest";

import { getNFT } from "./getNFT.js";
import { DOODLES_CONTRACT } from "~test/test-contracts.js";

const fetchSpy = vi.spyOn(globalThis, "fetch");

describe("erc721.getNFT", () => {
  afterEach(() => {
    fetchSpy.mockClear();
  });
  it("without owner", async () => {
    const nft = await getNFT({
      contract: DOODLES_CONTRACT,
      tokenId: 1n,
      includeOwner: false,
    });
    expect(nft).toMatchInlineSnapshot(`
      {
        "id": 1n,
        "metadata": {
          "error": "The API key was not found.",
          "errorCode": "KEY_NOT_FOUND",
        },
        "owner": null,
        "supply": 1n,
        "tokenURI": "ipfs://QmPMc4tcBsMqLRuCQtPmPe84bpSjrC3Ky7t3JWuHXYB4aS/1",
        "type": "ERC721",
      }
    `);
    // 2 fetch calls: 1 for RPC, 1 for fetching the tokenUri
    expect(fetchSpy).toHaveBeenCalledTimes(2);
  });

  it("with owner", async () => {
    const nft = await getNFT({
      contract: { ...DOODLES_CONTRACT },
      tokenId: 1n,
      includeOwner: true,
    });
    expect(nft).toMatchInlineSnapshot(`
      {
        "id": 1n,
        "metadata": {
          "error": "The API key was not found.",
          "errorCode": "KEY_NOT_FOUND",
        },
        "owner": "0xbE9936FCFC50666f5425FDE4A9decC59cEF73b24",
        "supply": 1n,
        "tokenURI": "ipfs://QmPMc4tcBsMqLRuCQtPmPe84bpSjrC3Ky7t3JWuHXYB4aS/1",
        "type": "ERC721",
      }
    `);
  });
});
