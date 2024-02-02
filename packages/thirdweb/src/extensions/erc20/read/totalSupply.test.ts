import { describe, it, expect, vi, afterEach } from "vitest";
import { USDC_CONTRACT } from "~test/test-contracts.js";
import { totalSupply } from "./totalSupply.js";

const fetchSpy = vi.spyOn(globalThis, "fetch");

describe("erc20.totalSupply", () => {
  afterEach(() => {
    fetchSpy.mockClear();
  });
  it("should respond with the correct value", async () => {
    const total_supply = await totalSupply({
      contract: USDC_CONTRACT,
    });
    expect(total_supply).toMatchInlineSnapshot(`23398309739224410n`);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });
});
