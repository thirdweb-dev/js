import { describe, expect, it } from "vitest";
import { TEST_CLIENT } from "../../../test/src/test-clients.js";
import { resolveName } from "./resolve-name.js";

// skip this test suite if there is no secret key available to test with
// TODO: remove reliance on secret key during unit tests entirely
describe.runIf(process.env.TW_SECRET_KEY)("ENS:resolve-name", () => {
  it("should resolve ENS", async () => {
    const ens = await resolveName({
      // vitalik.eth
      address: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
      client: TEST_CLIENT,
    });
    expect(ens).toBe("vitalik.eth");
  });

  it("should return null if no ENS exists for the address", async () => {
    const ens = await resolveName({
      address: "0xc6248746A9CA5935ae722E2061347A5897548c03",
      client: TEST_CLIENT,
    });
    expect(ens).toBeNull();
  });
});
