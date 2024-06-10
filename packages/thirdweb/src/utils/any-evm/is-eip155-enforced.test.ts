import { beforeEach } from "node:test";
import { afterAll, describe, expect, it, vi } from "vitest";
import {
  ANVIL_CHAIN,
  FORKED_ETHEREUM_CHAIN,
} from "../../../test/src/chains.js";
import { TEST_CLIENT } from "../../../test/src/test-clients.js";
import * as ethSendRawTransaction from "../../rpc/actions/eth_sendRawTransaction.js";
import { isEIP155Enforced } from "./is-eip155-enforced.js";

const ethSendRawTransactionSpy = vi.spyOn(
  ethSendRawTransaction,
  "eth_sendRawTransaction",
);

// skip this test suite if there is no secret key available to test with
// TODO: remove reliance on secret key during unit tests entirely
describe.runIf(process.env.TW_SECRET_KEY)("isEIP155Enforced", () => {
  afterAll(() => {
    vi.restoreAllMocks();
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return true if EIP-155 is enforced", async () => {
    ethSendRawTransactionSpy.mockRejectedValueOnce({
      code: -32003,
      message: "eip155",
    });

    // Call the isEIP155Enforced function with a chain that enforces EIP-155
    const result = await isEIP155Enforced({
      chain: FORKED_ETHEREUM_CHAIN,
      client: TEST_CLIENT,
    });

    // Assert that the result is true
    expect(result).toBe(true);
  });

  it("should return false if EIP-155 is not enforced", async () => {
    ethSendRawTransactionSpy.mockRejectedValueOnce({
      code: -32003,
      message: "Insufficient funds for gas * price + value",
    });

    // Call the isEIP155Enforced function with a chain that does not enforce EIP-155
    const result = await isEIP155Enforced({
      // localhost does not enforce eip155
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
    });

    // Assert that the result is false
    expect(result).toBe(false);
  });
});
