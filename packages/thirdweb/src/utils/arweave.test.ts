import { describe, expect, it } from "vitest";
import { resolveArweaveScheme } from "./arweave.js";

describe("resolveScheme", () => {
  it("should resolve ipfs scheme when not passing a gateway override", () => {
    const uri = "ar://...";
    const url = resolveArweaveScheme({ uri });
    expect(url).toMatchInlineSnapshot(`"https://arweave.net/..."`);
  });

  it("should resolve http(s) scheme", () => {
    const uri = "https://example.com/file.txt";
    const url = resolveArweaveScheme({ uri });
    expect(url).toBe(uri);
  });

  it("should throw for an invalid uri scheme", () => {
    const uri = "invalid://abcxyz";
    expect(() =>
      resolveArweaveScheme({ uri }),
    ).toThrowErrorMatchingInlineSnapshot(
      `[Error: Invalid URI scheme, expected "ar://" or "http(s)://"]`,
    );
  });
});
