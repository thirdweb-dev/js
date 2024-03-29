import { describe, it, expect, vi } from "vitest";

import { getBalance } from "./getBalance.js";
import { USDC_CONTRACT } from "~test/test-contracts.js";
import { VITALIK_WALLET } from "~test/addresses.js";

const fetchSpy = vi.spyOn(global, "fetch");

describe("erc20.getBalance", () => {
  it("should return the getBalance result", async () => {
    const balance = await getBalance({
      contract: USDC_CONTRACT,
      address: VITALIK_WALLET,
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
