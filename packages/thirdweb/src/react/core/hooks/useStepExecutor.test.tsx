import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TEST_CLIENT } from "~test/test-clients.js";
import type { WindowAdapter } from "../adapters/WindowAdapter.js";
import type { BridgePrepareResult } from "./useBridgePrepare.js";
import { useStepExecutor } from "./useStepExecutor.js";

// Avoid firing analytics network calls while executing.
vi.mock("../../../analytics/track/pay.js", () => ({
  trackPayEvent: vi.fn(),
}));

const { onrampStatusMock } = vi.hoisted(() => ({
  onrampStatusMock: vi.fn(),
}));
vi.mock("../../../bridge/index.js", () => ({
  Onramp: {
    status: (options: unknown) => onrampStatusMock(options),
  },
}));

// Minimal onramp quote with no follow-up transactions, so the executor's
// behaviour depends solely on the onramp outcome.
const ONRAMP_QUOTE: Extract<BridgePrepareResult, { type: "onramp" }> = {
  currency: "USD",
  currencyAmount: 30,
  destinationAmount: 30000000n,
  destinationToken: {
    address: "0x0000000000000000000000000000000000000000",
    chainId: 8453,
    decimals: 6,
    name: "USD Coin",
    prices: {},
    symbol: "USDC",
  },
  id: "onramp-session-id",
  intent: {
    chainId: 8453,
    onramp: "transak",
    receiver: "0x0000000000000000000000000000000000000001",
    tokenAddress: "0x0000000000000000000000000000000000000000",
  },
  link: "https://onramp.example.com/session",
  steps: [],
  type: "onramp",
};

function createWindowAdapter(): WindowAdapter {
  return { open: vi.fn(async () => {}) };
}

describe("useStepExecutor onramp guards", () => {
  it("surfaces an error when the onramp reports FAILED", async () => {
    onrampStatusMock.mockResolvedValue({ status: "FAILED", transactions: [] });
    const windowAdapter = createWindowAdapter();

    const { result } = renderHook(() =>
      useStepExecutor({
        client: TEST_CLIENT,
        preparedQuote: ONRAMP_QUOTE,
        windowAdapter,
      }),
    );

    await act(async () => {
      result.current.start();
    });

    await waitFor(() => expect(result.current.onrampStatus).toBe("failed"));
    expect(result.current.error?.message).toBe("Payment failed");
    expect(result.current.executionState).toBe("idle");
    expect(windowAdapter.open).toHaveBeenCalledWith(ONRAMP_QUOTE.link);
  });

  it("does not report success when a prior onramp attempt failed", async () => {
    onrampStatusMock.mockResolvedValue({ status: "FAILED", transactions: [] });
    const windowAdapter = createWindowAdapter();
    const onComplete = vi.fn();

    const { result } = renderHook(() =>
      useStepExecutor({
        client: TEST_CLIENT,
        onComplete,
        preparedQuote: ONRAMP_QUOTE,
        windowAdapter,
      }),
    );

    // First attempt fails and leaves the onramp in the "failed" state.
    await act(async () => {
      result.current.start();
    });
    await waitFor(() => expect(result.current.onrampStatus).toBe("failed"));

    // Retrying must fail fast on the incomplete onramp rather than proceeding.
    await act(async () => {
      result.current.retry();
    });
    await waitFor(() =>
      expect(result.current.error?.message).toBe("Onramp did not complete"),
    );
    expect(result.current.error?.statusCode).toBe(500);
    // Success must never be reported for an incomplete onramp.
    expect(onComplete).not.toHaveBeenCalled();
  });

  it("marks the onramp complete before reporting success", async () => {
    onrampStatusMock.mockResolvedValue({
      status: "COMPLETED",
      transactions: [],
    });
    const windowAdapter = createWindowAdapter();
    const onComplete = vi.fn();

    const { result } = renderHook(() =>
      useStepExecutor({
        client: TEST_CLIENT,
        onComplete,
        preparedQuote: ONRAMP_QUOTE,
        windowAdapter,
      }),
    );

    await act(async () => {
      result.current.start();
    });

    await waitFor(() => expect(result.current.onrampStatus).toBe("completed"), {
      timeout: 5000,
    });
    expect(result.current.error).toBeUndefined();
    expect(onComplete).toHaveBeenCalledTimes(1);
  });
});
