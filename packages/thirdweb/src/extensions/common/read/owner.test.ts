import { describe, it, expect, vi, afterEach } from "vitest";
import { USDC_CONTRACT } from "~test/test-contracts.js";
import { owner } from "./owner.js";

const fetchSpy = vi.spyOn(globalThis, "fetch");

describe("shared.owner", () => {
  afterEach(() => {
    fetchSpy.mockClear();
  });
  it("should respond with the correct value", async () => {
    const ownerAddress = await owner({
      contract: USDC_CONTRACT,
    });
    expect(ownerAddress).toBe(`0xFcb19e6a322b27c06842A71e8c725399f049AE3a`);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });
});
