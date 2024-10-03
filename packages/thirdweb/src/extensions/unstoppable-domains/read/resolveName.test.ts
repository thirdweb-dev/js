import { describe, expect, it } from "vitest";
import { TEST_CLIENT } from "~test/test-clients.js";
import { resolveName } from "./resolveName.js";

// Double check: https://unstoppabledomains.com/d/thirdwebsdk.unstoppable

describe("Unstoppable Domain: resolve name", () => {
  it("should resolve name", async () => {
    expect(
      await resolveName({
        address: "0x12345674b599ce99958242b3D3741e7b01841DF3",
        client: TEST_CLIENT,
      }),
    ).toBe("thirdwebsdk.unstoppable");
  });
});
