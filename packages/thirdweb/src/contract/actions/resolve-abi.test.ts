import { describe, it, expect, vi, afterEach } from "vitest";
import { resolveContractAbi } from "./resolve-abi.js";
import { USDC_CONTRACT } from "~test/test-contracts.js";
import { USDC_ABI } from "~test/abis/usdc.js";

const fetchSpy = vi.spyOn(globalThis, "fetch");

describe("contract: resolve-abi", () => {
  afterEach(() => {
    fetchSpy.mockClear();
  });
  it("should resolve abi from contract", async () => {
    const abi = await resolveContractAbi(USDC_CONTRACT);
    expect(abi).toMatchObject(USDC_ABI);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  it("should cache the result on a contract level", async () => {
    // we do this so we don't hit any PRIOR cache
    const USDC_CONTRACT_CLONE = { ...USDC_CONTRACT };
    const abi1 = await resolveContractAbi(USDC_CONTRACT_CLONE);
    expect(abi1).toMatchObject(USDC_ABI);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(fetchSpy).toHaveBeenCalledWith(
      `https://contract.thirdweb.com/metadata/1/${USDC_CONTRACT_CLONE.address}`,
      expect.any(Object),
    );
    const abi2 = await resolveContractAbi(USDC_CONTRACT_CLONE);
    expect(abi2).toMatchObject(USDC_ABI);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });
});
