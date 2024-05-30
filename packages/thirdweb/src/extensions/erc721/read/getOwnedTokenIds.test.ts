import { describe, expect, it } from "vitest";
import { DOODLES_CONTRACT } from "~test/test-contracts.js";
import { getOwnedTokenIds } from "./getOwnedTokenIds.js";

describe.runIf(process.env.TW_SECRET_KEY)("erc721.getAllOwners", () => {
  it("should return the correct result", async () => {
    const owner = "0x3010775D16E7B79AF280035c64a1Df5F705CfdDb";
    const tokenIds = await getOwnedTokenIds({
      contract: DOODLES_CONTRACT,
      owner,
    });

    // The following code is based on the test result from "./getAllOwners.test.ts"
    expect(tokenIds.length).toBe(1);
    expect(tokenIds[0]).toBe(0n);
  });
});
