import { describe, expect, it } from "vitest";
import {
  formatUnits,
  formatEther,
  formatGwei,
  parseUnits,
  parseEther,
  parseGwei,
} from "./units.js";

describe("formatUnits", () => {
  it("should format positive value with decimals", () => {
    const value = BigInt("12345678901234567890");
    const decimals = 18;
    const result = formatUnits(value, decimals);
    expect(result).toBe("12.34567890123456789");
  });

  it("should format negative value with decimals", () => {
    const value = BigInt("-12345678901234567890");
    const decimals = 18;
    const result = formatUnits(value, decimals);
    expect(result).toBe("-12.34567890123456789");
  });

  it("should format value with zero decimals", () => {
    const value = BigInt("12345678901234567890");
    const decimals = 0;
    const result = formatUnits(value, decimals);
    expect(result).toBe("12345678901234567890");
  });

  it("should format value with leading zeros", () => {
    const value = BigInt("12345678901234567890");
    const decimals = 30;
    const result = formatUnits(value, decimals);
    expect(result).toBe("0.00000000001234567890123456789");
  });

  it("should format value with trailing zeros", () => {
    const value = BigInt("12345678901234567890");
    const decimals = 5;
    const result = formatUnits(value, decimals);
    expect(result).toBe("123456789012345.6789");
  });

  it("zero is zero, with no decimals", () => {
    const value = BigInt("0");
    const decimals = 18;
    const result = formatUnits(value, decimals);
    expect(result).toBe("0");
  });
});

describe("formatEther", () => {
  it("should format wei value with default unit", () => {
    const wei = BigInt("12345678901234567890");
    const result = formatEther(wei);
    expect(result).toBe("12.34567890123456789");
  });

  it("should format wei value with wei unit", () => {
    const wei = BigInt("12345678901234567890");
    const result = formatEther(wei, "wei");
    expect(result).toBe("12.34567890123456789");
  });

  it("should format wei value with gwei unit", () => {
    const wei = BigInt("12345678901234567890");
    const result = formatEther(wei, "gwei");
    expect(result).toBe("12345678901.23456789");
  });
});

describe("formatGwei", () => {
  it("should format wei value with default unit", () => {
    const wei = BigInt("12345678901234567890");
    const result = formatGwei(wei);
    expect(result).toBe("12345678901.23456789");
  });

  it("should format wei value with wei unit", () => {
    const wei = BigInt("12345678901234567890");
    const result = formatGwei(wei, "wei");
    expect(result).toBe("12345678901.23456789");
  });
});

describe("parseUnits", () => {
  it("should parse positive value with decimals", () => {
    const value = "12.34567890123456789";
    const decimals = 18;
    const result = parseUnits(value, decimals);
    expect(result).toBe(BigInt("12345678901234567890"));
  });

  it("should parse negative value with decimals", () => {
    const value = "-12.34567890123456789";
    const decimals = 18;
    const result = parseUnits(value, decimals);
    expect(result).toBe(BigInt("-12345678901234567890"));
  });

  it("should parse value with zero decimals", () => {
    const value = "12345678901234567890";
    const decimals = 0;
    const result = parseUnits(value, decimals);
    expect(result).toBe(BigInt("12345678901234567890"));
  });

  it("should parse value with leading zeros", () => {
    const value = "0.00000000001234567890123456789";
    const decimals = 30;
    const result = parseUnits(value, decimals);
    expect(result).toBe(BigInt("12345678901234567890"));
  });

  it("should parse value with trailing zeros", () => {
    const value = "123456789012345.6789";
    const decimals = 5;
    const result = parseUnits(value, decimals);
    expect(result).toBe(BigInt("12345678901234567890"));
  });

  it("should parse zero value with no decimals", () => {
    const value = "0";
    const decimals = 18;
    const result = parseUnits(value, decimals);
    expect(result).toBe(BigInt("0"));
  });
});

describe("parseEther", () => {
  it("should parse ether value with default unit", () => {
    const ether = "12.34567890123456789";
    const result = parseEther(ether);
    expect(result).toBe(BigInt("12345678901234567890"));
  });

  it("should parse ether value with wei unit", () => {
    const ether = "12.34567890123456789";
    const result = parseEther(ether, "wei");
    expect(result).toBe(BigInt("12345678901234567890"));
  });

  it("should parse ether value with gwei unit", () => {
    const ether = "12.34567890123456789";
    const result = parseEther(ether, "gwei");
    expect(result).toBe(BigInt("12345678901"));
  });
});
describe("parseGwei", () => {
  it("should parse ether value with default unit", () => {
    const ether = "12.34567890123456789";
    const result = parseGwei(ether);
    expect(result).toBe(BigInt("12345678901"));
  });

  it("should parse ether value with wei unit", () => {
    const ether = "12.34567890123456789";
    const result = parseGwei(ether, "wei");
    expect(result).toBe(BigInt("12345678901"));
  });
});
