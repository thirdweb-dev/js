import { describe, expect, test as it } from "vitest";
import { TEST_ACCOUNT_B } from "~test/test-wallets.js";
import { TEST_WALLET_A, TEST_WALLET_B } from "../../test/src/addresses.js";
import { FORKED_ETHEREUM_CHAIN } from "../../test/src/chains.js";
import { TEST_CLIENT } from "../../test/src/test-clients.js";
import { defineChain } from "../chains/utils.js";
import { toWei } from "../utils/units.js";
import { signAuthorization } from "./actions/eip7702/authorization.js";
import { estimateGas } from "./actions/estimate-gas.js";
import { toSerializableTransaction } from "./actions/to-serializable-transaction.js";
import { prepareTransaction } from "./prepare-transaction.js";

describe.runIf(process.env.TW_SECRET_KEY)("prepareTransaction", () => {
  it("should prepare a transaction", () => {
    const preparedTx = prepareTransaction({
      chain: FORKED_ETHEREUM_CHAIN,
      client: TEST_CLIENT,
      to: TEST_WALLET_B,
      value: toWei("0.1"),
    });
    expect(preparedTx.to).toBe(TEST_WALLET_B);
    expect(preparedTx.value).toMatchInlineSnapshot("100000000000000000n");
  });

  it("should accept an authorization list", async () => {
    const authorization = await signAuthorization({
      account: TEST_ACCOUNT_B,
      request: {
        address: TEST_WALLET_B,
        chainId: 911867,
        nonce: 0n,
      },
    });
    const preparedTx = prepareTransaction({
      authorizationList: [authorization],
      chain: defineChain(911867),
      client: TEST_CLIENT,
      to: TEST_WALLET_B,
      value: 0n,
    });

    const serializableTx = await toSerializableTransaction({
      transaction: preparedTx,
    });

    expect(serializableTx.authorizationList).toEqual([authorization]);
  });

  // skip this test if there is no secret key available to test with
  // TODO: remove reliance on secret key during unit tests entirely
  it.runIf(process.env.TW_SECRET_KEY)(
    "should estimate the gas correctly",
    async () => {
      const preparedTx = prepareTransaction({
        chain: FORKED_ETHEREUM_CHAIN,
        client: TEST_CLIENT,
        to: TEST_WALLET_B,
        value: toWei("0.1"),
      });
      const estimate = await estimateGas({
        from: TEST_WALLET_A,
        transaction: preparedTx,
      });
      // TODO: figure out why this is not `21000n`?
      // - a raw transfer SHOULD be 21000gwei always?
      expect(estimate).toMatchInlineSnapshot("21060n");
    },
  );
});
