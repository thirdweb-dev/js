import { describe, it, expect, vi, afterEach } from "vitest";
import { DOODLES_CONTRACT, USDC_CONTRACT } from "~test/test-contracts.js";
import { decimals, detectDecimals } from "./decimals.js";
import { VITALIK_WALLET } from "~test/addresses.js";

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

describe("erc20.detectDecimals", () => {
  it("should return true for a contract with a decimals function", async () => {
    const result = await detectDecimals({
      ...USDC_CONTRACT,
      // TODO: need bytecode merging (for implementation contract)
      address: "0x43506849D7C04F9138D1A2050bbF3A0c054402dd",
    });
    expect(result).toBe(true);
  });

  it("should return false if something is not a contract", async () => {
    const result = await detectDecimals({
      ...USDC_CONTRACT,
      address: VITALIK_WALLET,
    });
    expect(result).toBe(false);
  });

  it("should return false if something is a contract without decimals", async () => {
    const result = await detectDecimals({
      ...DOODLES_CONTRACT,
    });
    expect(result).toBe(false);
  });
});
