import { describe, expect, it } from "vitest";
import type { BuyWithCryptoStatus } from "../../../../../../../pay/buyWithCrypto/getStatus.js";
import { getBuyWithCryptoStatusMeta } from "./statusMeta.js";

describe("getBuyWithCryptoStatusMeta", () => {
  it('returns "Unknown" for NOT_FOUND status', () => {
    const result = getBuyWithCryptoStatusMeta({
      status: "NOT_FOUND",
    } as BuyWithCryptoStatus);
    expect(result).toEqual({
      color: "secondaryText",
      status: "Unknown",
    });
  });

  it('returns "Bridging" for WAITING_BRIDGE subStatus', () => {
    const result = getBuyWithCryptoStatusMeta({
      status: "PENDING",
      subStatus: "WAITING_BRIDGE",
    } as BuyWithCryptoStatus);
    expect(result).toEqual({
      color: "accentText",
      loading: true,
      status: "Bridging",
    });
  });

  it('returns "Incomplete" for PARTIAL_SUCCESS subStatus', () => {
    const result = getBuyWithCryptoStatusMeta({
      status: "COMPLETED",
      subStatus: "PARTIAL_SUCCESS",
    } as BuyWithCryptoStatus);
    expect(result).toEqual({
      color: "secondaryText",
      status: "Incomplete",
    });
  });

  it('returns "Pending" for PENDING status', () => {
    const result = getBuyWithCryptoStatusMeta({
      status: "PENDING",
    } as BuyWithCryptoStatus);
    expect(result).toEqual({
      color: "accentText",
      loading: true,
      status: "Pending",
    });
  });

  it('returns "Failed" for FAILED status', () => {
    const result = getBuyWithCryptoStatusMeta({
      status: "FAILED",
    } as BuyWithCryptoStatus);
    expect(result).toEqual({
      color: "danger",
      status: "Failed",
    });
  });

  it('returns "Completed" for COMPLETED status', () => {
    const result = getBuyWithCryptoStatusMeta({
      status: "COMPLETED",
    } as BuyWithCryptoStatus);
    expect(result).toEqual({
      color: "success",
      status: "Completed",
    });
  });

  it('returns "Unknown" for unhandled status', () => {
    const result = getBuyWithCryptoStatusMeta({
      // @ts-ignore Test purpose
      status: "Unknown",
    });
    expect(result).toEqual({
      color: "secondaryText",
      status: "Unknown",
    });
  });
});
