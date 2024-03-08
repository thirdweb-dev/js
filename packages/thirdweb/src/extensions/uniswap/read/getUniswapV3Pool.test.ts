import { describe, it, expect, vi, afterEach } from "vitest";

import { getUniswapV3Pool } from "./getUniswapV3Pool.js";
import {
  UNISWAPV3_FACTORY_CONTRACT,
  OHM_CONTRACT_ADDRESS,
  WETH_CONTRACT_ADDRESS,
  MOG_CONTRACT_ADDRESS,
} from "~test/test-contracts.js";

const fetchSpy = vi.spyOn(globalThis, "fetch");

describe("uniswap.getUniswapV3Pool", () => {
  afterEach(() => {
    fetchSpy.mockClear();
  });

  it("should return the WETH/OHM pool address and fee", async () => {
    const balance = await getUniswapV3Pool({
      contract: UNISWAPV3_FACTORY_CONTRACT,
      tokenA: WETH_CONTRACT_ADDRESS,
      tokenB: OHM_CONTRACT_ADDRESS,
    });
    expect(balance).toMatchInlineSnapshot(`
      {
        "poolAddress": "0x88051B0eea095007D3bEf21aB287Be961f3d8598",
        "poolFee": 3000,
      }
    `);
  });

  it("should throw an error when no pool exists for the pair", async () => {
    await expect(
      getUniswapV3Pool({
        contract: UNISWAPV3_FACTORY_CONTRACT,
        tokenA: MOG_CONTRACT_ADDRESS,
        tokenB: OHM_CONTRACT_ADDRESS,
      }),
    ).rejects.toThrow("No pool exists for this token pair.");
  });
});
