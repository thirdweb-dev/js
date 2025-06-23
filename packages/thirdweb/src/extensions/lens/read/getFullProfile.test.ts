import { describe, expect, it } from "vitest";
import { TEST_CLIENT } from "~test/test-clients.js";
import { MAX_UINT256 } from "~test/test-consts.js";
import { getFullProfile } from "./getFullProfile.js";

/**
 * For Lens protocol, each profileId is an ERC721 tokenId.
 * So any bigint from 0 to (current max profile id) should return a valid profile + handle
 */

const profileId = 1000n;
const client = TEST_CLIENT;

describe.runIf(process.env.TW_SECRET_KEY)("lens/getFullProfile", () => {
  it("should return a full profile with handle and (maybe) profile metadata", async () => {
    const profile = await getFullProfile({ client, profileId });

    // Although there is a profile, the metadata of that profile might still be "null"
    // if user hasn't set up any metadata like avatar, coverPicture, name, bio etc.
    expect(typeof profile).toBe("object");
    expect(profile?.handle.startsWith("lens/@")).toBe(true);
    expect(typeof profile?.profileData).toBe("object");
  });

  it("should return null for invalid profileId", async () => {
    // As of Jul 2024 Lens has about 465k profiles | So trying to get profile of a max-unit256 profileId should return "null"
    // gotta be a very long before this number is reached so we should be safe
    const profile = await getFullProfile({ client, profileId: MAX_UINT256 });
    expect(profile === null).toBe(true);
  });

  it("should return joinDate", async () => {
    const profile = await getFullProfile({
      client,
      includeJoinDate: true,
      profileId,
    });
    expect(typeof profile?.joinDate).toBe("bigint");
  });
});
