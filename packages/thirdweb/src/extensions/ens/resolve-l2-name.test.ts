import { describe, expect, it } from "vitest";
import { TEST_CLIENT } from "../../../test/src/test-clients.js";
import { base } from "../../chains/chain-definitions/base.js";
import { BASENAME_RESOLVER_ADDRESS } from "./constants.js";
import { resolveL2Name } from "./resolve-l2-name.js";

// skip this test suite if there is no secret key available to test with
// TODO: remove reliance on secret key during unit tests entirely
describe.runIf(process.env.TW_SECRET_KEY)("ENS:resolve-l2-name", () => {
  it.skip("should resolve Basename", async () => {
    const ens = await resolveL2Name({
      // myk.base.eth
      address: "0x653Ff253b0c7C1cc52f484e891b71f9f1F010Bfb",
      client: TEST_CLIENT,
      resolverAddress: BASENAME_RESOLVER_ADDRESS,
      resolverChain: base,
    });
    expect(ens).toBe("myk.base.eth");
  });

  it("should return null if no Basename exists for the address", async () => {
    const ens = await resolveL2Name({
      address: "0xc6248746A9CA5935ae722E2061347A5897548c03",
      client: TEST_CLIENT,
      resolverAddress: BASENAME_RESOLVER_ADDRESS,
      resolverChain: base,
    });
    expect(ens).toBeNull();
  });
});
