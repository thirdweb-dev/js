import { describe, test as it, expect } from "vitest";

import { TEST_CLIENT } from "../../test/src/test-clients.js";
import { TEST_WALLET_A, TEST_WALLET_B } from "../../test/src/addresses.js";

import { estimateGas } from "./actions/estimate-gas.js";
import { prepareTransaction } from "./prepare-transaction.js";
import { ethereum } from "../chains/chain-definitions/ethereum.js";
import { toWei } from "../utils/units.js";

describe("prepareTransaction", () => {
  it("should prepare a transaction", () => {
    const preparedTx = prepareTransaction({
      chain: ethereum,
      client: TEST_CLIENT,
      to: TEST_WALLET_B,
      value: toWei("0.1"),
    });
    expect(preparedTx.to).toBe(TEST_WALLET_B);
    expect(preparedTx.value).toMatchInlineSnapshot(`100000000000000000n`);
  });

  // skip this test if there is no secret key available to test with
  // TODO: remove reliance on secret key during unit tests entirely
  it.runIf(process.env.TW_SECRET_KEY)(
    "should estimate the gas correctly",
    async () => {
      const preparedTx = prepareTransaction({
        chain: ethereum,
        client: TEST_CLIENT,
        to: TEST_WALLET_B,
        value: toWei("0.1"),
      });
      const estimate = await estimateGas({
        transaction: preparedTx,
        from: TEST_WALLET_A,
      });
      // TODO: figure out why this is not `21000n`?
      // - a raw transfer SHOULD be 21000gwei always?
      expect(estimate).toMatchInlineSnapshot(`21060n`);
    },
  );
});
