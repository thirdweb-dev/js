import { describe, expect, it } from "vitest";
import type { BuyWithCryptoStatus } from "../../../../../../../pay/buyWithCrypto/getStatus.js";
import type { BuyWithFiatStatus } from "../../../../../../../pay/buyWithFiat/getStatus.js";
import {
  getBuyWithCryptoStatusMeta,
  getBuyWithFiatStatusMeta,
} from "./statusMeta.js";

describe("getBuyWithCryptoStatusMeta", () => {
  it('returns "Unknown" for NOT_FOUND status', () => {
    const result = getBuyWithCryptoStatusMeta({
      status: "NOT_FOUND",
    } as BuyWithCryptoStatus);
    expect(result).toEqual({
      status: "Unknown",
      color: "secondaryText",
    });
  });

  it('returns "Bridging" for WAITING_BRIDGE subStatus', () => {
    const result = getBuyWithCryptoStatusMeta({
      status: "PENDING",
      subStatus: "WAITING_BRIDGE",
    } as BuyWithCryptoStatus);
    expect(result).toEqual({
      status: "Bridging",
      color: "accentText",
      loading: true,
    });
  });

  it('returns "Incomplete" for PARTIAL_SUCCESS subStatus', () => {
    const result = getBuyWithCryptoStatusMeta({
      status: "COMPLETED",
      subStatus: "PARTIAL_SUCCESS",
    } as BuyWithCryptoStatus);
    expect(result).toEqual({
      status: "Incomplete",
      color: "secondaryText",
    });
  });

  it('returns "Pending" for PENDING status', () => {
    const result = getBuyWithCryptoStatusMeta({
      status: "PENDING",
    } as BuyWithCryptoStatus);
    expect(result).toEqual({
      status: "Pending",
      color: "accentText",
      loading: true,
    });
  });

  it('returns "Failed" for FAILED status', () => {
    const result = getBuyWithCryptoStatusMeta({
      status: "FAILED",
    } as BuyWithCryptoStatus);
    expect(result).toEqual({
      status: "Failed",
      color: "danger",
    });
  });

  it('returns "Completed" for COMPLETED status', () => {
    const result = getBuyWithCryptoStatusMeta({
      status: "COMPLETED",
    } as BuyWithCryptoStatus);
    expect(result).toEqual({
      status: "Completed",
      color: "success",
    });
  });

  it('returns "Unknown" for unhandled status', () => {
    const result = getBuyWithCryptoStatusMeta({
      // @ts-ignore Test purpose
      status: "Unknown",
    });
    expect(result).toEqual({
      status: "Unknown",
      color: "secondaryText",
    });
  });
});

describe("getBuyWithFiatStatusMeta", () => {
  it('returns "Incomplete" for CRYPTO_SWAP_FALLBACK status', () => {
    const result = getBuyWithFiatStatusMeta({
      status: "CRYPTO_SWAP_FALLBACK",
    } as BuyWithFiatStatus);
    expect(result).toEqual({
      status: "Incomplete",
      color: "danger",
      step: 2,
      progressStatus: "partialSuccess",
    });
  });

  it('returns "Pending" for CRYPTO_SWAP_IN_PROGRESS status', () => {
    const result = getBuyWithFiatStatusMeta({
      status: "CRYPTO_SWAP_IN_PROGRESS",
    } as BuyWithFiatStatus);
    expect(result).toEqual({
      status: "Pending",
      color: "accentText",
      loading: true,
      step: 2,
      progressStatus: "pending",
    });
  });

  it('returns "Pending" for PENDING_ON_RAMP_TRANSFER status', () => {
    const result = getBuyWithFiatStatusMeta({
      status: "PENDING_ON_RAMP_TRANSFER",
    } as BuyWithFiatStatus);
    expect(result).toEqual({
      status: "Pending",
      color: "accentText",
      loading: true,
      step: 1,
      progressStatus: "pending",
    });
  });

  it('returns "Completed" for ON_RAMP_TRANSFER_COMPLETED status', () => {
    const result = getBuyWithFiatStatusMeta({
      status: "ON_RAMP_TRANSFER_COMPLETED",
    } as BuyWithFiatStatus);
    expect(result).toEqual({
      status: "Completed",
      color: "success",
      loading: true,
      step: 1,
      progressStatus: "completed",
    });
  });

  it('returns "Action Required" for CRYPTO_SWAP_REQUIRED status', () => {
    const result = getBuyWithFiatStatusMeta({
      status: "CRYPTO_SWAP_REQUIRED",
    } as BuyWithFiatStatus);
    expect(result).toEqual({
      status: "Action Required",
      color: "accentText",
      step: 2,
      progressStatus: "actionRequired",
    });
  });

  it('returns "Failed" for PAYMENT_FAILED status', () => {
    const result = getBuyWithFiatStatusMeta({
      status: "PAYMENT_FAILED",
    } as BuyWithFiatStatus);
    expect(result).toEqual({
      status: "Failed",
      color: "danger",
      step: 1,
      progressStatus: "failed",
    });
  });

  it('returns "Unknown" for unhandled status', () => {
    const result = getBuyWithFiatStatusMeta({
      // @ts-ignore
      status: "UNKNOWN_STATUS",
    });
    expect(result).toEqual({
      status: "Unknown",
      color: "secondaryText",
      step: 1,
      progressStatus: "unknown",
    });
  });
});
