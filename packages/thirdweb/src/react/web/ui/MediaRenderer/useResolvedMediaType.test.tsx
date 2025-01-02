import { describe, expect, it } from "vitest";
import { TEST_CLIENT } from "~test/test-clients.js";
import { resolveMediaTypeFromUri } from "./useResolvedMediaType.js";

const client = TEST_CLIENT;

describe("useResolvedMediaType", () => {
  it("resolveMediaTypeFromUri should return an empty string if uri is falsy", () => {
    expect(resolveMediaTypeFromUri({ client })).toBe("");
  });

  it("resolveMediaTypeFromUri should resolve Arweave scheme", () => {
    expect(resolveMediaTypeFromUri({ client, uri: "ar://test" })).toBe(
      "https://arweave.net/test",
    );
  });

  it("resolveMediaTypeFromUri should resolve IPFS uri with custom gateway", () => {
    expect(
      resolveMediaTypeFromUri({
        client,
        uri: "ipfs://test",
        gatewayUrl: "https://cf-ipfs.com/ipfs/",
      }),
    ).toBe("https://cf-ipfs.com/ipfs/test");
  });
});
