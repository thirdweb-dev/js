import { describe, it, expect, vi, afterEach } from "vitest";

import { TEST_CLIENT } from "~test/test-clients.js";
import { getNonce } from "./getNonce.js";

const fetchSpy = vi.spyOn(globalThis, "fetch");

describe("farcaster.getNonce", () => {
  afterEach(() => {
    fetchSpy.mockClear();
  });

  it("should return the address's current nonce", async () => {
    const fid = await getNonce({
      client: TEST_CLIENT,
      address: "0x6443ed8a3ffb006e3bb5a866bae6edfb93f8ff3e",
    });
    expect(fid).toBe(12n);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });
});
