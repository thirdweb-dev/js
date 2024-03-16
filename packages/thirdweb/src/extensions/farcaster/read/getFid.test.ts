import { describe, it, expect, vi, afterEach } from "vitest";

import { getFid } from "./getFid.js";
import { TEST_CLIENT } from "~test/test-clients.js";

const fetchSpy = vi.spyOn(globalThis, "fetch");

describe("farcaster.getFid", () => {
  afterEach(() => {
    fetchSpy.mockClear();
  });

  it("should return the address's fid", async () => {
    const fid = await getFid({
      client: TEST_CLIENT,
      address: "0x6443ed8a3ffb006e3bb5a866bae6edfb93f8ff3e",
    });
    expect(fid).toBe(7657n);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  it("should return 0 if the address has no fid", async () => {
    const fid = await getFid({
      client: TEST_CLIENT,
      address: "0x0000000000000000000000000000000000000000",
    });
    expect(fid).toBe(0n);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });
});
