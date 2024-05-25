import { describe, expect, it } from "vitest";
import { replaceGatewayUrlWithScheme } from "./helpers.js";

describe("ipfs helper functions", () => {
  it("should return full ipfs uri for valid gateway url (<domain>/ipfs/<cid>)", () => {
    const cid = "Qm...";
    const url = `https://cloudflare-ipfs.com/ipfs/${cid}`;
    expect(replaceGatewayUrlWithScheme(url)).toBe(`ipfs://${cid}`);
  });

  it("should return the url un-altered for invalid ipfs gateway url", () => {
    const url = "http://some-gateway/Qm...";
    expect(replaceGatewayUrlWithScheme(url)).toBe(url);
  });
});
