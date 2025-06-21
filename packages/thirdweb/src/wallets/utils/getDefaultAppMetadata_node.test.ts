import { describe, expect, it } from "vitest";
import { getDefaultAppMetadata } from "./defaultDappMetadata.js";

describe("getDefaultAppMetadata: node environment", () => {
  it("should return the default value in non-browser env", () => {
    expect(getDefaultAppMetadata()).toEqual({
      description: "thirdweb powered dApp",
      logoUrl: "https://thirdweb.com/favicon.ico",
      name: "thirdweb powered dApp",
      url: "https://thirdweb.com",
    });
  });
});
