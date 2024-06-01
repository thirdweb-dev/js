import { describe, expect, it } from "vitest";
import { TEST_CLIENT } from "~test/test-clients.js";
import { isAddress } from "../../utils/address.js";
import { isHex } from "../../utils/encoding/hex.js";
import { generateAccount } from "./generateAccount.js";

describe("generateAccount", () => {
  it("should generate a private-key account", async () => {
    const account = await generateAccount({ client: TEST_CLIENT });
    expect(account).toBeDefined();
    expect(isAddress(account.address)).toBe(true);

    // Should be able to sign message
    const data = await account.signMessage({ message: "test" });
    expect(isHex(data)).toBe(true);
  });
});
