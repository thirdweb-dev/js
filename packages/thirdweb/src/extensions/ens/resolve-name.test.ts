import { describe, it, expect } from "vitest";
import { resolveName } from "./resolve-name.js";
import { TEST_CLIENT } from "../../../test/src/test-clients.js";

// skip this test suite if there is no secret key available to test with
// TODO: remove reliance on secret key during unit tests entirely
describe.runIf(process.env.TW_SECRET_KEY)("ENS:resolve-name", () => {
  it("should resolve ENS", async () => {
    const address = await resolveName({
      client: TEST_CLIENT,
      // vitalik.eth
      address: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
    });
    expect(address).toBe("vitalik.eth");
  });
});
