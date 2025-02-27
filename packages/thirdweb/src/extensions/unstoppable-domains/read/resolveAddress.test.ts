import { describe, expect, it } from "vitest";
import { TEST_CLIENT } from "~test/test-clients.js";
import { resolveAddress } from "./resolveAddress.js";

// Double check: https://unstoppabledomains.com/d/thirdwebsdk.unstoppable

describe.runIf(process.env.TW_SECRET_KEY)(
  "Unstoppable Domain: resolve address",
  () => {
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

    it("should throw an error with a non-existent domain name", async () => {
      await expect(
        resolveAddress({
          name: "thirdwebsdk.thissuredoesnotexist",
          client: TEST_CLIENT,
        }),
      ).rejects.toThrowError(
        "Could not resolve a valid tokenId from the domain: thirdwebsdk.thissuredoesnotexist. Make sure it exists.",
      );
    });
  },
);
