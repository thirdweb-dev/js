import { describe, expect, it } from "vitest";
import { resolveAddress } from "./resolveAddress.js";
import { TEST_CLIENT } from "~test/test-clients.js";

describe("resolve lens address", () => {

  // Will remove this test later since this is flaky
  it("should resolve to correct address", async () => {
    const address = await resolveAddress({
      client: TEST_CLIENT,
      handleOrLocalName: "captain_jack",
    });
    expect(address.toLowerCase()).toBe(
      "0x12345674b599ce99958242b3D3741e7b01841DF3".toLowerCase(),
    );
  });
});
