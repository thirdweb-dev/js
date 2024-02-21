import { describe, it, expect } from "vitest";
import { resolveScheme } from "./ipfs.js";
import { createThirdwebClient } from "../client/client.js";

describe("resolveScheme", () => {
  it("should resolve ipfs scheme when not passing a gateway override", () => {
    const client = createThirdwebClient({
      clientId: "test",
    });
    const uri = "ipfs://Qm...";
    const url = resolveScheme({ client, uri });
    expect(url).toMatchInlineSnapshot(`"https://test.ipfscdn.io/ipfs/Qm..."`);
  });

  it("should resolve ipfs scheme when passing a gateway override", () => {
    const client = createThirdwebClient({
      clientId: "test",
      config: {
        storage: {
          gateway: "https://gateway.io/ipfs/{cid}",
        },
      },
    });
    const uri = "ipfs://Qm...";
    const url = resolveScheme({ client, uri });
    expect(url).toMatchInlineSnapshot(`"https://gateway.io/ipfs/Qm..."`);
  });

  it("should resolve http(s) scheme", () => {
    const client = createThirdwebClient({
      clientId: "test",
    });
    const uri = "https://example.com/file.txt";
    const url = resolveScheme({ client, uri });
    expect(url).toBe(uri);
  });

  it("should throw for an invalid uri scheme", () => {
    const client = createThirdwebClient({
      clientId: "test",
    });
    const uri = "invalid://Qm...";
    expect(() =>
      resolveScheme({ client, uri }),
    ).toThrowErrorMatchingInlineSnapshot(
      `[Error: Invalid URI scheme, expected "ipfs://" or "http(s)://"]`,
    );
  });
});
