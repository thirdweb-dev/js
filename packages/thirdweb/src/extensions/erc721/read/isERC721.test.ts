import { describe, expect, it } from "vitest";
import { DOODLES_CONTRACT, DROP1155_CONTRACT } from "~test/test-contracts.js";
import { isERC721 } from "./isERC721.js";

describe("isERC721", () => {
  it("should return TRUE if contract is an ERC721 contract", async () => {
    const result = await isERC721({ contract: DOODLES_CONTRACT });
    expect(result).toBe(true);
  });

  it("should return FALSE if contract is NOT an ERC721 contract", async () => {
    const result = await isERC721({ contract: DROP1155_CONTRACT });
    expect(result).toBe(false);
  });
});
