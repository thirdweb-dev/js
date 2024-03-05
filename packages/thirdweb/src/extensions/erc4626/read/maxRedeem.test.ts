import { describe, it, expect, vi, afterEach } from "vitest";
import { FRAX_ETHER_CONTRACT } from "~test/test-contracts.js";
import { maxRedeem } from "./maxRedeem.js";

const fetchSpy = vi.spyOn(globalThis, "fetch");

describe("erc4626.maxRedeem", () => {
  afterEach(() => {
    fetchSpy.mockClear();
  });
  it("should return the maxRedeem result", async () => {
    const shares = await maxRedeem({
      contract: FRAX_ETHER_CONTRACT,
      owner: "0x78bB3aEC3d855431bd9289fD98dA13F9ebB7ef15", // a known FRAX whale
    });
    expect(shares).toMatchInlineSnapshot(`50993304437341001537764n`);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });
});
