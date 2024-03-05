import { describe, it, expect, vi, afterEach } from "vitest";
import { FRAX_ETHER_CONTRACT } from "~test/test-contracts.js";
import { totalAssets } from "./totalAssets.js";

const fetchSpy = vi.spyOn(globalThis, "fetch");

describe("erc4626.totalAssets", () => {
  afterEach(() => {
    fetchSpy.mockClear();
  });
  it("should return the balanceOf result", async () => {
    const totalManagedAssets = await totalAssets({
      contract: FRAX_ETHER_CONTRACT,
    });
    expect(totalManagedAssets).toMatchInlineSnapshot(
      `224719432053619380319100n`,
    );
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });
});
