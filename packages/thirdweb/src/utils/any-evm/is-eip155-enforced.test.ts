import { describe, it, expect } from "vitest";
import { isEIP155Enforced } from "./is-eip155-enforced.js";
import { TEST_CLIENT } from "../../../test/src/test-clients.js";
import { optimism } from "../../chains/chain-definitions/optimism.js";
import { ethereum } from "../../chains/chain-definitions/ethereum.js";

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
      // ethereum does not enforce eip155
      chain: ethereum,
      client: TEST_CLIENT,
    });

    // Assert that the result is false
    expect(result).toBe(false);
  });
});
