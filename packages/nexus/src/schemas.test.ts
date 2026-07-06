import { describe, expect, it } from "vitest";

import { networkToChainId } from "./schemas.js";

describe("networkToChainId", () => {
  it("parses valid numeric network identifiers", () => {
    expect(networkToChainId("eip155:1")).toBe(1);
    expect(networkToChainId("8453")).toBe(8453);
  });

  it("rejects partially numeric network identifiers", () => {
    expect(() => networkToChainId("eip155:1abc")).toThrow(
      "Invalid network: eip155:1abc",
    );
    expect(() => networkToChainId("1abc")).toThrow("Invalid network: 1abc");
    expect(() => networkToChainId("eip155:1.5")).toThrow(
      "Invalid network: eip155:1.5",
    );
  });

  it("rejects unsafe integer network identifiers", () => {
    expect(() => networkToChainId("9007199254740992")).toThrow(
      "Invalid network: 9007199254740992",
    );
  });
});
