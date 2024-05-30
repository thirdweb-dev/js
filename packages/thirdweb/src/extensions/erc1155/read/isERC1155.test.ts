import { describe, expect, it } from "vitest";
import { DOODLES_CONTRACT, DROP1155_CONTRACT } from "~test/test-contracts.js";
import { isERC1155 } from "./isERC1155.js";

describe("isERC1155", () => {
  it("should return TRUE if contract is an ERC1155 contract", async () => {
    const result = await isERC1155({ contract: DROP1155_CONTRACT });
    expect(result).toBe(true);
  });

  it("should return FALSE if contract is NOT an ERC1155 contract", async () => {
    const result = await isERC1155({ contract: DOODLES_CONTRACT });
    expect(result).toBe(false);
  });
});
