import { describe, it, expect, vi, afterEach } from "vitest";
import { FRAX_ETHER_CONTRACT } from "~test/test-contracts.js";
import { maxDeposit } from "./maxDeposit.js";
import { VITALIK_WALLET } from "~test/addresses.js";

const fetchSpy = vi.spyOn(globalThis, "fetch");

describe("erc4626.maxDeposit", () => {
  afterEach(() => {
    fetchSpy.mockClear();
  });
  it("should return the maxDeposit result", async () => {
    const shares = await maxDeposit({
      contract: FRAX_ETHER_CONTRACT,
      receiver: VITALIK_WALLET,
    });
    expect(shares).toMatchInlineSnapshot(
      `115792089237316195423570985008687907853269984665640564039457584007913129639935n`,
    );
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });
});
