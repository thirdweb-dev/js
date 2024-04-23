import { describe, expect, it } from "vitest";
import { ANVIL_CHAIN } from "../../../test/src/chains.js";
import { TEST_CLIENT } from "../../../test/src/test-clients.js";
import { optimism } from "../../chains/chain-definitions/optimism.js";
import { isEIP155Enforced } from "./is-eip155-enforced.js";

// skip this test suite if there is no secret key available to test with
// TODO: remove reliance on secret key during unit tests entirely
describe.runIf(process.env.TW_SECRET_KEY)("isEIP155Enforced", () => {
  it("should return true if EIP-155 is enforced", async () => {
    // Call the isEIP155Enforced function with a chain that enforces EIP-155
    const result = await isEIP155Enforced({
      // optimism enforce eip155
      chain: optimism,
      client: TEST_CLIENT,
    });

    // Assert that the result is true
    expect(result).toBe(true);
  });

  it("should return false if EIP-155 is not enforced", async () => {
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
