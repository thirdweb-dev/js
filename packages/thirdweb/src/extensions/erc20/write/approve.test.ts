import { it, expect } from "vitest";
import { approve } from "./approve.js";
import { USDC_CONTRACT } from "~test/test-contracts.js";
import { VITALIK_WALLET } from "~test/addresses.js";
import { estimateGas } from "../../../transaction/actions/estimate-gas.js";

it("estimate erc20 approve", async () => {
  const transaction = approve({
    contract: USDC_CONTRACT,
    amount: 100,
    spender: VITALIK_WALLET,
  });
  const result = await estimateGas({
    transaction,
    from: VITALIK_WALLET,
  });
  expect(result).toMatchInlineSnapshot(`55937n`);
});
