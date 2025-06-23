import { describe, expect, it } from "vitest";
import { TEST_CLIENT } from "~test/test-clients.js";
import { MAX_UINT256 } from "~test/test-consts.js";
import { getHandleFromProfileId } from "./getHandleFromProfileId.js";

/**
 * For Lens protocol, each profileId is an ERC721 tokenId.
 * So any bigint from 0 to (current max id) should return a valid profile + handle
 */

const profileId = 1000n;
const client = TEST_CLIENT;

describe.runIf(process.env.TW_SECRET_KEY)(
  "lens/getHandleFromProfileId should return a handle for a valid profileId",
  () => {
    it("should return a string in this format: lens/@<handle>", async () => {
      const handle = await getHandleFromProfileId({ client, profileId });
      expect(typeof handle).toBe("string");
      // @ts-ignore expected
      expect(handle.startsWith("lens/")).toBe(true);
    });

    it("should return `null` for an invalid profileId", async () => {
      // As of Jul 2024 Lens has about 465k profiles | So trying to get handle of a max-unit256 profileId should return "null"
      // gotta be a very long before this number is reached so we should be safe
      const handle = await getHandleFromProfileId({
        client,
        profileId: MAX_UINT256,
      });
      expect(handle).toBe(null);
    });

    it("should work with overrides", async () => {
      const handle = await getHandleFromProfileId({
        client,
        overrides: {
          lensHandleAddress: "0xe7E7EaD361f3AaCD73A61A9bD6C10cA17F38E945",
          tokenHandleRegistryAddress:
            "0xD4F2F33680FCCb36748FA9831851643781608844",
        },
        profileId,
      });
      // @ts-ignore expected
      expect(handle.startsWith("lens/")).toBe(true);
    });
  },
);
