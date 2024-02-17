import { describe, it, expect } from "vitest";
import { isEIP155Enforced } from "./is-eip155-enforced.js";
import { TEST_CLIENT } from "../../../test/src/test-clients.js";
import { ethereum, optimism } from "../../chains/index.js";

describe("isEIP155Enforced", () => {
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
