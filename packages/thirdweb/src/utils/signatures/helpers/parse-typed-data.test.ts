import { describe, expect, test } from "vitest";
import { parseTypedData } from "./parse-typed-data.js";

describe("parseTypedData", () => {
  test("parses typed data with hex chainId", () => {
    const typedData = {
      domain: {
        chainId: "0x1" as unknown as number,
      },
      types: {},
      primaryType: "EIP712Domain" as const,
    };

    const result = parseTypedData(typedData);
    expect(result.domain.chainId).toBe(1);
  });

  test("returns typed data unchanged if chainId is not hex", () => {
    const typedData = {
      domain: {
        chainId: 1,
      },
      types: {},
      primaryType: "EIP712Domain" as const,
    };

    const result = parseTypedData(typedData);
    expect(result.domain.chainId).toBe(1);
  });

  test("returns typed data unchanged if chainId is undefined", () => {
    const typedData = {
      domain: {},
      types: {},
      primaryType: "EIP712Domain" as const,
    };

    const result = parseTypedData(typedData);
    expect(result.domain.chainId).toBeUndefined();
  });

  test("handles unknown domain properties", () => {
    const typedData = {
      domain: {
        chainId: "0x1" as unknown as number,
        name: "Test",
      },
      types: {},
      primaryType: "EIP712Domain" as const,
    };

    const result = parseTypedData(typedData);
    expect(result.domain.chainId).toBe(1);
    expect(result.domain.name).toBe("Test");
  });
});
