import { describe, expect, it } from "vitest";
import { TEST_CLIENT } from "~test/test-clients.js";
import { resolveAddress } from "./resolveAddress.js";

// Double check: https://unstoppabledomains.com/d/thirdwebsdk.unstoppable

describe("Unstoppable Domain: resolve address", () => {
  it("should resolve address", async () => {
    expect(
      (
        await resolveAddress({
          name: "thirdwebsdk.unstoppable",
          client: TEST_CLIENT,
        })
      ).toLowerCase(),
    ).toBe("0x12345674b599ce99958242b3D3741e7b01841DF3".toLowerCase());
  });
});
