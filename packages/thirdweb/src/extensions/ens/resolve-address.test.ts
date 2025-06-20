import { describe, expect, it } from "vitest";
import { TEST_CLIENT } from "../../../test/src/test-clients.js";
import { base } from "../../chains/chain-definitions/base.js";
import { BASENAME_RESOLVER_ADDRESS } from "./constants.js";
import { resolveAddress } from "./resolve-address.js";

// skip this test suite if there is no secret key available to test with
// TODO: remove reliance on secret key during unit tests entirely
describe.runIf(process.env.TW_SECRET_KEY)("ENS:resolve-address", () => {
  it("should resolve ENS", async () => {
    const name = "vitalik.eth";
    const address = await resolveAddress({
      client: TEST_CLIENT,
      name,
    });
    expect(address).toBe("0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045");
  });

  it("should shortcut if the name is already an address", async () => {
    const name = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045";
    const address = await resolveAddress({
      client: TEST_CLIENT,
      name,
    });
    expect(address).toBe("0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045");
  });

  it("should resolve Basename", async () => {
    const name = "myk.base.eth";
    const address = await resolveAddress({
      client: TEST_CLIENT,
      name,
      resolverAddress: BASENAME_RESOLVER_ADDRESS,
      resolverChain: base,
    });
    expect(address).toBe("0x653Ff253b0c7C1cc52f484e891b71f9f1F010Bfb");
  });
});
