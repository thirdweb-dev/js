import { describe, it, expect, vi, afterEach } from "vitest";
import { FRAX_ETHER_CONTRACT } from "~test/test-contracts.js";
import { maxWithdraw } from "./maxWithdraw.js";

const fetchSpy = vi.spyOn(globalThis, "fetch");

describe("erc4626.maxWithdraw", () => {
  afterEach(() => {
    fetchSpy.mockClear();
  });
  it("should return the maxWithdraw result", async () => {
    const assets = await maxWithdraw({
      contract: FRAX_ETHER_CONTRACT,
      owner: "0x78bB3aEC3d855431bd9289fD98dA13F9ebB7ef15", // a known FRAX whale
    });
    expect(assets).toMatchInlineSnapshot(`54761613495137391921916n`);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });
});
