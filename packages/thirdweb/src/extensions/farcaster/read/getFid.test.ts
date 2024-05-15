import { describe, expect, it } from "vitest";

import { FORKED_OPTIMISM_CHAIN } from "~test/chains.js";
import { TEST_CLIENT } from "~test/test-clients.js";
import { getFid } from "./getFid.js";

describe("farcaster.getFid", () => {
  it("should return the address's fid", async () => {
    const fid = await getFid({
      client: TEST_CLIENT,
      chain: FORKED_OPTIMISM_CHAIN,
      address: "0x6443ed8a3ffb006e3bb5a866bae6edfb93f8ff3e",
    });
    expect(fid).toBe(7657n);
  });

  it("should return 0 if the address has no fid", async () => {
    const fid = await getFid({
      client: TEST_CLIENT,
      chain: FORKED_OPTIMISM_CHAIN,
      address: "0x0000000000000000000000000000000000000000",
    });
    expect(fid).toBe(0n);
  });
});
