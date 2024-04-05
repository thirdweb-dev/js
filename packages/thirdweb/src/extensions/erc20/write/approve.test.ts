import { it, expect } from "vitest";
import { approve } from "./approve.js";
import { USDT_CONTRACT } from "~test/test-contracts.js";
import { VITALIK_WALLET } from "~test/addresses.js";
import { estimateGas } from "../../../transaction/actions/estimate-gas.js";

it.runIf(process.env.TW_SECRET_KEY)(
  "estimates erc20 approval gas correctly",
  async () => {
    const transaction = approve({
      contract: USDT_CONTRACT,
      amount: 100,
      spender: VITALIK_WALLET,
    });
    const result = await estimateGas({
      transaction,
      from: VITALIK_WALLET,
    });
    expect(result).toMatchInlineSnapshot(`48549n`);
  },
);
