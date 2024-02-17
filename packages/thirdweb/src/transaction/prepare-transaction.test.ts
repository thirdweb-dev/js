import { describe, test, expect } from "vitest";

import { TEST_CLIENT } from "../../test/src/test-clients.js";
import { TEST_WALLET_A, TEST_WALLET_B } from "../../test/src/addresses.js";
import { parseEther } from "../utils/index.js";
import { estimateGas } from "./actions/estimate-gas.js";
import { prepareTransaction } from "./prepare-transaction.js";
import { ethereum } from "../chains/index.js";

describe("prepareTransaction", () => {
  test("should prepare a transaction", () => {
    const preparedTx = prepareTransaction({
      chain: ethereum,
      client: TEST_CLIENT,
      to: TEST_WALLET_B,
      value: parseEther("0.1"),
    });
    expect(preparedTx.to).toBe(TEST_WALLET_B);
    expect(preparedTx.value).toMatchInlineSnapshot(`100000000000000000n`);
  });

  test("should estimate the gas correctly", async () => {
    const preparedTx = prepareTransaction({
      chain: ethereum,
      client: TEST_CLIENT,
      to: TEST_WALLET_B,
      value: parseEther("0.1"),
    });
    const estimate = await estimateGas({
      transaction: preparedTx,
      from: TEST_WALLET_A,
    });
    // TODO: figure out why this is not `21000n`?
    // - a raw transfer SHOULD be 21000gwei always?
    expect(estimate).toMatchInlineSnapshot(`21060n`);
  });
});
