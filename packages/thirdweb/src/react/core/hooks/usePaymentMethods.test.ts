import { describe, expect, it } from "vitest";
import { usePaymentMethods } from "./usePaymentMethods.js";

describe("usePaymentMethods", () => {
  it("should return available payment method types", () => {
    const result = usePaymentMethods();

    expect(result).toEqual({
      data: ["wallet", "fiat"],
      isLoading: false,
      error: null,
      isError: false,
      isSuccess: true,
    });
  });

  it("should return wallet and fiat as available methods", () => {
    const result = usePaymentMethods();

    expect(result.data).toContain("wallet");
    expect(result.data).toContain("fiat");
    expect(result.data).toHaveLength(2);
  });

  it("should indicate success state", () => {
    const result = usePaymentMethods();

    expect(result.isSuccess).toBe(true);
    expect(result.isError).toBe(false);
    expect(result.isLoading).toBe(false);
    expect(result.error).toBeNull();
  });
});
