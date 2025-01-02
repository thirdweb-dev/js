import { describe, expect, it } from "vitest";

import { TEST_CLIENT } from "../../../test/src/test-clients.js";
import { resolveText } from "./resolve-text.js";

// skip this test suite if there is no secret key available to test with
// TODO: remove reliance on secret key during unit tests entirely
describe.runIf(process.env.TW_SECRET_KEY)("ENS:resolve-text", () => {
  it("resolves record for name", async () => {
    const record = await resolveText({
      client: TEST_CLIENT,
      name: "jns.eth",
      key: "com.twitter",
    });
    expect(record).toMatchInlineSnapshot(`"jnsdls"`);
  });

  it("resolves name without text record to null", async () => {
    const record = await resolveText({
      client: TEST_CLIENT,
      name: "unregistered-name.eth",
      key: "com.twitter",
    });
    expect(record).toBeNull();
  });
});
