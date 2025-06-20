import { describe, expect, it } from "vitest";
import { TEST_CLIENT } from "~test/test-clients.js";
import { TEST_ACCOUNT_D } from "~test/test-wallets.js";
import { resolveName } from "./resolveName.js";

// Double check: https://unstoppabledomains.com/d/thirdwebsdk.unstoppable

describe.runIf(process.env.TW_SECRET_KEY)(
  "Unstoppable Domain: resolve name",
  () => {
    it("should resolve name", async () => {
      expect(
        await resolveName({
          address: "0x12345674b599ce99958242b3D3741e7b01841DF3",
          client: TEST_CLIENT,
        }),
      ).toBe("thirdwebsdk.unstoppable");
    });

    it("should throw error on addresses that dont own any UD", async () => {
      await expect(
        resolveName({ address: TEST_ACCOUNT_D.address, client: TEST_CLIENT }),
      ).rejects.toThrowError(
        `Failed to retrieve domain for address: ${TEST_ACCOUNT_D.address}. Make sure you have set the Reverse Resolution address for your domain at https://unstoppabledomains.com/manage?page=reverseResolution&domain=your-domain`,
      );
    });
  },
);
