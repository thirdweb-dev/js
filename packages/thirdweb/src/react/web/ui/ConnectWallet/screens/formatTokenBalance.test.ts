import { describe, expect, it } from "vitest";
import { formatTokenBalance } from "./formatTokenBalance.js";

describe("formatTokenBalance", () => {
  const mockBalanceData = {
    decimals: 18,
    displayValue: "1.23456789",
    name: "Ethereum",
    symbol: "ETH",
  };

  it("formats balance with symbol by default", () => {
    const result = formatTokenBalance(mockBalanceData);
    expect(result).toBe("1.23457 ETH");
  });

  it("formats balance without symbol when showSymbol is false", () => {
    const result = formatTokenBalance(mockBalanceData, false);
    expect(result).toBe("1.23457");
  });

  it("respects custom decimal places", () => {
    const result = formatTokenBalance(mockBalanceData, true, 3);
    expect(result).toBe("1.235 ETH");
  });

  it("handles zero balance", () => {
    const zeroBalance = { ...mockBalanceData, displayValue: "0" };
    const result = formatTokenBalance(zeroBalance);
    expect(result).toBe("0 ETH");
  });

  it("handles very small numbers", () => {
    const smallBalance = { ...mockBalanceData, displayValue: "0.0000001" };
    const result = formatTokenBalance(smallBalance);
    expect(result).toBe("0.00001 ETH");
  });

  it("handles large numbers", () => {
    const largeBalance = { ...mockBalanceData, displayValue: "1234567.89" };
    const result = formatTokenBalance(largeBalance);
    expect(result).toBe("1234567.89 ETH");
  });

  it("rounds up for very small non-zero values", () => {
    const tinyBalance = { ...mockBalanceData, displayValue: "0.000000001" };
    const result = formatTokenBalance(tinyBalance, true, 8);
    expect(result).toBe("1e-8 ETH");
  });

  it("handles different token symbols", () => {
    const usdcBalance = {
      ...mockBalanceData,
      displayValue: "100.5",
      symbol: "USDC",
    };
    const result = formatTokenBalance(usdcBalance);
    expect(result).toBe("100.5 USDC");
  });
});
