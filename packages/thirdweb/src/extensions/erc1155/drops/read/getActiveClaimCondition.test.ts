import { describe, it, expect, vi, afterEach } from "vitest";

import { DROP1155_CONTRACT } from "../../../../../test/src/test-contracts.js";
import { getActiveClaimCondition } from "./getActiveClaimCondition.js";

const fetchSpy = vi.spyOn(globalThis, "fetch");

describe("erc1155.getClaimConditions", () => {
  afterEach(() => {
    fetchSpy.mockClear();
  });
  it("should return the correct claim conditions", async () => {
    const cc = await getActiveClaimCondition({
      contract: DROP1155_CONTRACT,
      tokenId: 4n,
    });
    expect(cc).toEqual({
      currency: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      maxClaimableSupply:
        115792089237316195423570985008687907853269984665640564039457584007913129639935n,
      merkleRoot:
        "0x0000000000000000000000000000000000000000000000000000000000000000",
      metadata: "ipfs://QmVu98eczZRpSYcF3UKYRDkHsM2RMQR62KUYmk29UDbWTP/0",
      pricePerToken: 438030000000000n,
      quantityLimitPerWallet:
        115792089237316195423570985008687907853269984665640564039457584007913129639935n,
      startTimestamp: 1701814725n,
      supplyClaimed: 1382n,
    });
    // 1 call for the condition id and 1 call for the condition
    expect(fetchSpy).toHaveBeenCalledTimes(2);
  });
});
