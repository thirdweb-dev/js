import { describe, expect, it } from "vitest";

import { VITALIK_WALLET } from "~test/addresses.js";
import { USDT_CONTRACT } from "~test/test-contracts.js";
import { getBalance } from "./getBalance.js";

describe.runIf(process.env.TW_SECRET_KEY)("erc20.getBalance", () => {
  it("should return the getBalance result", async () => {
    const balance = await getBalance({
      address: VITALIK_WALLET,
      contract: USDT_CONTRACT,
    });
    expect(balance.displayValue).toBe("1544.900798");
    expect(balance.name).toBe("Tether USD");
    expect(balance.symbol).toBe("USDT");
    expect(balance.value).toBe(1544900798n);
    expect(balance.decimals).toBe(6);
  });
});
