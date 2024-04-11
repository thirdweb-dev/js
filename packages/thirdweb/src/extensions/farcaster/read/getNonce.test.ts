import { describe, expect, it } from "vitest";

import { FORKED_OPTIMISM_CHAIN } from "~test/chains.js";
import { TEST_CLIENT } from "~test/test-clients.js";
import { getNonce } from "./getNonce.js";

describe("farcaster.getNonce", () => {
  it("should return the address's current nonce", async () => {
    const nonce = await getNonce({
      client: TEST_CLIENT,
      chain: FORKED_OPTIMISM_CHAIN,
      address: "0x6443ed8a3ffb006e3bb5a866bae6edfb93f8ff3e",
    });
    expect(nonce).toBe(12n);
  });
});
