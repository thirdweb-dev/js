import { describe, it, expect } from "vitest";

import { TEST_CLIENT } from "../../../test/src/test-clients.js";
import { resolveAvatar } from "./resolve-avatar.js";

// skip this test suite if there is no secret key available to test with
// TODO: remove reliance on secret key during unit tests entirely
describe.runIf(process.env.TW_SECRET_KEY)("ENS:resolve-avatar", () => {
  it("resolves offchain record", async () => {
    const avatarUri = await resolveAvatar({
      client: TEST_CLIENT,
      name: "snowowl.eth",
    });
    expect(avatarUri).toMatchInlineSnapshot(
      `"https://i.imgur.com/MO1wCsI.jpg"`,
    );
  });

  it("resolves onchain record", async () => {
    const avatarUri = await resolveAvatar({
      client: TEST_CLIENT,
      name: "jns.eth",
    });
    // only look at the IPFS hash part, because the gateway URL can change (based on secret key)
    expect(avatarUri?.split("/ipfs/")[1]).toMatchInlineSnapshot(
      `"Qmf8yNB8xVXGZjXXRnnrKT1FRydGKaHobovFr2qMXEw6uj/61"`,
    );
  });

  it("resolves name without avatar record to null", async () => {
    const avatarUri = await resolveAvatar({
      client: TEST_CLIENT,
      name: "unregistered-name.eth",
    });
    expect(avatarUri).toBeNull();
  });
});
