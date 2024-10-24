import { describe, expect, it } from "vitest";
import { MAX_UINT256 } from "~test/test-consts.js";
import { DROP1155_CONTRACT } from "../../../../../test/src/test-contracts.js";
import { getActiveClaimCondition } from "./getActiveClaimCondition.js";

describe.runIf(process.env.TW_SECRET_KEY)("erc1155.getClaimConditions", () => {
  it("should return the correct claim conditions", async () => {
    const cc = await getActiveClaimCondition({
      contract: DROP1155_CONTRACT,
      tokenId: 4n,
    });
    expect(cc).toEqual({
      currency: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      maxClaimableSupply: MAX_UINT256,
      merkleRoot:
        "0x0000000000000000000000000000000000000000000000000000000000000000",
      metadata: "ipfs://QmVu98eczZRpSYcF3UKYRDkHsM2RMQR62KUYmk29UDbWTP/0",
      pricePerToken: 438030000000000n,
      quantityLimitPerWallet: MAX_UINT256,
      startTimestamp: 1701814725n,
      supplyClaimed: 1382n,
    });
    // 1 call for the condition id and 1 call for the condition
  });
});
