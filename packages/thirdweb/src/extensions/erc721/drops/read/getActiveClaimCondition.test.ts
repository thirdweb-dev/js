import { describe, it, expect, vi, afterEach } from "vitest";

import { NFT_DROP_CONTRACT } from "../../../../../test/src/test-contracts.js";
import { getActiveClaimCondition } from "./getActiveClaimCondition.js";

const fetchSpy = vi.spyOn(globalThis, "fetch");

describe("erc721.getClaimConditions", () => {
  afterEach(() => {
    fetchSpy.mockClear();
  });
  it("should return the correct claim conditions", async () => {
    const cc = await getActiveClaimCondition({
      contract: NFT_DROP_CONTRACT,
    });
    expect(cc).toEqual({
      currency: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      maxClaimableSupply:
        115792089237316195423570985008687907853269984665640564039457584007913129639935n,
      merkleRoot:
        "0xa271043594b8089d5463d5f8be64927aa2118785146920c9d9f01a4f6043e50d",
      metadata: "ipfs://QmXdSpyno8GDDZbpHecsjMZkb82A5EgSsHzgbJWRGV97jN/0",
      pricePerToken: 0n,
      quantityLimitPerWallet: 0n,
      startTimestamp: 1704652200n,
      supplyClaimed: 5598n,
    });
    // 1 call for the condition id and 1 call for the condition
    expect(fetchSpy).toHaveBeenCalledTimes(2);
  });
});
