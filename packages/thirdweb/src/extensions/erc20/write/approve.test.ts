import { expect, it } from "vitest";
import { VITALIK_WALLET } from "~test/addresses.js";
import { USDT_CONTRACT } from "~test/test-contracts.js";
import { estimateGas } from "../../../transaction/actions/estimate-gas.js";
import { approve } from "./approve.js";

it.runIf(process.env.TW_SECRET_KEY)(
  "estimates erc20 approval gas correctly",
  async () => {
    const transaction = approve({
      amount: 100,
      contract: USDT_CONTRACT,
      spender: VITALIK_WALLET,
    });
    const result = await estimateGas({
      from: VITALIK_WALLET,
      transaction,
    });
    expect(result).toMatchInlineSnapshot("48549n");
  },
);
