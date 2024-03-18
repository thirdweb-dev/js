import { describe, it, expect } from "vitest";
import { resolveAddress } from "./resolve-address.js";
import { TEST_CLIENT } from "../../../test/src/test-clients.js";

describe("ENS", () => {
  it("should resolve ENS", async () => {
    const name = "vitalik.eth";
    const address = await resolveAddress({
      client: TEST_CLIENT,
      name,
    });
    expect(address).toMatchObject("0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045");
  });
});
