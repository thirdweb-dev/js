import { describe, expect, it } from "vitest";
import { TEST_CLIENT } from "~test/test-clients.js";
import { MAX_UINT256 } from "~test/test-consts.js";
import { getProfileMetadata } from "./getProfileMetadata.js";

/**
 * For Lens protocol, each profileId is an ERC721 tokenId.
 * So any bigint from 0 to (current max profile id) should return a valid profile + handle
 */

const profileId = 1000n;
const client = TEST_CLIENT;

describe("lens/getProfileMetadata", () => {
  it("should return a profile object or null for valid profileId", async () => {
    const profile = await getProfileMetadata({ client, profileId });

    // Although there is a profile, the metadata of that profile might still be "missing"
    // if user hasn't set up any metadata like avatar, coverPicture, name, bio etc.
    expect(typeof profile).toBe("object");
  });

  it("should return null for invalid profileId", async () => {
    // As of Jul 2024 Lens has about 465k profiles | So trying to get profile of a max-unit256 profileId should return nothing
    // gotta be a very long before this number is reached so we should be safe
    const profile = await getProfileMetadata({
      client,
      profileId: MAX_UINT256,
    });
    expect(profile === null).toBe(true);
  });

  it("should work with overrides", async () => {
    const profile = await getProfileMetadata({
      client,
      overrides: {
        lensHubAddress: "0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d",
      },
      profileId,
    });
    expect(typeof profile).toBe("object");
  });
});
