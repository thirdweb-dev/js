import { describe, expect, it } from "vitest";
import { extractMinimalProxyImplementationAddress } from "./extractMinimalProxyImplementationAddress.js";

describe("extractMinimalProxyImplementationAddress", () => {
  it("should handle bytecode without 0x prefix", () => {
    const bytecode =
      "363d3d373d3d3d363d73bebebebebebebebebebebebebebebebebebebebe5af43d82803e903d91602b57fd5bf3";
    const result = extractMinimalProxyImplementationAddress(bytecode);
    expect(result).toBe("0xbebebebebebebebebebebebebebebebebebebebe");
  });

  it("should extract address from EIP-1167 clone minimal proxy", () => {
    const bytecode =
      "0x363d3d373d3d3d363d73bebebebebebebebebebebebebebebebebebebebe5af43d82803e903d91602b57fd5bf3";
    const result = extractMinimalProxyImplementationAddress(bytecode);
    expect(result).toBe("0xbebebebebebebebebebebebebebebebebebebebe");
  });

  it("should extract address from 0xSplits minimal proxy", () => {
    const bytecode =
      "0x36603057343d52307f830d2d700a97af574b186c80d40429385d24241565b08a7c559ba283a964d9b1583103d5942010000000000000000000000001234567890123456789012345678901234567890";
    const result = extractMinimalProxyImplementationAddress(bytecode);
    expect(result).toBe("0x234567890123456789012345678901234567890");
  });

  it("should extract address from 0age's minimal proxy", () => {
    const bytecode =
      "0x3d3d3d3d363d3d37363d73bebebebebebebebebebebebebebebebebebebebe5af43d82803e903d91602b57fd5bf3";
    const result = extractMinimalProxyImplementationAddress(bytecode);
    expect(result).toBe("0xbebebebebebebebebebebebebebebebebebebebe");
  });

  it("should extract address from Vyper's minimal proxy (Uniswap v1)", () => {
    const bytecode =
      "0x366000600037611000600036600073bebebebebebebebebebebebebebebebebebebebe5af41558576110006000f3";
    const result = extractMinimalProxyImplementationAddress(bytecode);
    expect(result).toBe("0xbebebebebebebebebebebebebebebebebebebebe");
  });

  it("should extract address from alternative Vyper minimal proxy", () => {
    const bytecode =
      "0x36600080376020600036600073bebebebebebebebebebebebebebebebebebebebe5af41558576020600060006000f3";
    const result = extractMinimalProxyImplementationAddress(bytecode);
    expect(result).toBe("0xbebebebebebebebebebebebebebebebebebebebe");
  });

  it("should extract address from EIP-7511 minimal proxy with PUSH0 opcode", () => {
    const bytecode =
      "0x365f5f375f5f365f73bebebebebebebebebebebebebebebebebebebebe5af43d82803e903d91602b57fd5bf3";
    const result = extractMinimalProxyImplementationAddress(bytecode);
    expect(result).toBe("0xbebebebebebebebebebebebebebebebebebebebe");
  });

  it("should extract address from EIP-7702 delegation designator", () => {
    const bytecode = "0xef0100bebebebebebebebebebebebebebebebebebebebe";
    const result = extractMinimalProxyImplementationAddress(bytecode);
    expect(result).toBe("0xbebebebebebebebebebebebebebebebebebebebe");
  });

  it("should return undefined for non-matching bytecode", () => {
    const bytecode =
      "0x60806040526000805534801561001457600080fd5b50610150806100246000396000f3fe";
    const result = extractMinimalProxyImplementationAddress(bytecode);
    expect(result).toBeUndefined();
  });
});
