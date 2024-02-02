import { describe, it, expect, vi, afterEach } from "vitest";
import { USDC_CONTRACT } from "~test/test-contracts.js";
import { decimals } from "./decimals.js";

const fetchSpy = vi.spyOn(globalThis, "fetch");

describe("erc20.decimals", () => {
  afterEach(() => {
    fetchSpy.mockClear();
  });
  it("should respond with the correct value", async () => {
    const balance = await decimals({
      contract: USDC_CONTRACT,
    });
    expect(balance).toBe(6);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });
  it("should cache the value for the same contract", async () => {
    // we do this because otherwise we hit the cache from the prior test-run (weak map is global)
    const CLONED_USDC = { ...USDC_CONTRACT };
    const balance1 = await decimals({
      contract: CLONED_USDC,
    });
    expect(balance1).toBe(6);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const balance2 = await decimals({
      contract: CLONED_USDC,
    });
    expect(balance2).toBe(6);
    // it should still only have been called once
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });
});
