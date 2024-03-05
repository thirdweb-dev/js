import { describe, it, expect, vi, afterEach } from "vitest";
import { FRAX_ETHER_CONTRACT } from "~test/test-contracts.js";
import { convertToShares } from "./convertToShares.js";

const fetchSpy = vi.spyOn(globalThis, "fetch");

describe("erc4626.convertToShares", () => {
  afterEach(() => {
    fetchSpy.mockClear();
  });
  it("should return the convertToShares result", async () => {
    const shares = await convertToShares({
      contract: FRAX_ETHER_CONTRACT,
      assets: 100000000n,
    });
    expect(shares).toMatchInlineSnapshot(`93118703n`);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });
});
