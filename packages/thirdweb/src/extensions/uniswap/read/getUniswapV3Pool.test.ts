import { describe, it, expect, vi, afterEach } from "vitest";

import { getUniswapV3Pool } from "./getUniswapV3Pool.js";
import {
  UNISWAPV3_FACTORY_CONTRACT,
  DAI_CONTRACT_ADDRESS,
  USDC_CONTRACT_ADDRESS,
} from "~test/test-contracts.js";

const fetchSpy = vi.spyOn(globalThis, "fetch");

describe("uniswap.getUniswapV3Pool", () => {
  afterEach(() => {
    fetchSpy.mockClear();
  });
  it("should return the USDC/DAI pool address and fee", async () => {
    const balance = await getUniswapV3Pool({
      contract: UNISWAPV3_FACTORY_CONTRACT,
      tokenA: USDC_CONTRACT_ADDRESS,
      tokenB: DAI_CONTRACT_ADDRESS,
    });
    expect(balance).toMatchInlineSnapshot(`
      {
        "decimals": 6,
        "displayValue": "81.831338",
        "name": "USD Coin",
        "symbol": "USDC",
        "value": 81831338n,
      }
    `);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });
});
