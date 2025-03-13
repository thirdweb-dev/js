import { describe, expect, it } from "vitest";
import { TEST_CLIENT } from "~test/test-clients.js";
import { status } from "./Status.js";

describe("Bridge.status", () => {
  it("should handle invalid transaction hash without throwing", async () => {
    const result = await status({
      transactionHash:
        "0xe199ef82a0b6215221536e18ec512813c1aa10b4f5ed0d4dfdfcd703578da56d",
      chainId: 1,
      client: TEST_CLIENT,
    });

    expect(result).toBeDefined();
    expect(result.status).toBe("failed");
    expect(result.transactions).toBeDefined();
  });
});
