import { describe, it, expect } from "vitest";

import { getBalance } from "./getBalance.js";
import { USDC_CONTRACT } from "~test/test-contracts.js";
import { VITALIK_WALLET } from "~test/addresses.js";

describe.runIf(process.env.TW_SECRET_KEY)("erc20.getBalance", () => {
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
  });
});
