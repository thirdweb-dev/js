import { describe, it, expect, vi, afterEach } from "vitest";

import { tokenURI } from "./tokenURI.js";
import { DOODLES_CONTRACT } from "~test/test-contracts.js";

const fetchSpy = vi.spyOn(globalThis, "fetch");

describe("erc721.tokenUri", () => {
  afterEach(() => {
    fetchSpy.mockClear();
  });
  it.only("should return the correct tokenUri", async () => {
    const uri = await tokenURI({
      contract: DOODLES_CONTRACT,
      tokenId: 1n,
    });
    expect(uri).toMatchInlineSnapshot(
      `"ipfs://QmPMc4tcBsMqLRuCQtPmPe84bpSjrC3Ky7t3JWuHXYB4aS/1"`,
    );
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });
});
