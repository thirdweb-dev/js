import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { TEST_CLIENT } from "~test/test-clients.js";
import type { WindowAdapter } from "../../../core/adapters/WindowAdapter.js";
import { CustomThemeProvider } from "../../../core/design-system/CustomThemeProvider.js";
import type {
  BridgePrepareRequest,
  BridgePrepareResult,
} from "../../../core/hooks/useBridgePrepare.js";
import { StepRunner } from "./StepRunner.js";

// Controllable executor + prepare seams so the test drives the retry branch
// purely off `onrampStatus`.
const { executor, retrySpy, refetchSpy, FRESH_QUOTE } = vi.hoisted(() => ({
  executor: {
    error: undefined as Error | undefined,
    onrampStatus: undefined as
      | "pending"
      | "executing"
      | "completed"
      | "failed"
      | undefined,
  },
  FRESH_QUOTE: {
    id: "fresh-session",
    link: "https://onramp.example.com/fresh",
    type: "onramp",
  },
  refetchSpy: vi.fn(),
  retrySpy: vi.fn(),
}));

vi.mock("../../../core/hooks/useStepExecutor.js", () => ({
  useStepExecutor: () => ({
    cancel: vi.fn(),
    currentStep: undefined,
    error: executor.error,
    executionState: "idle" as const,
    onrampStatus: executor.onrampStatus,
    progress: 0,
    retry: retrySpy,
    start: vi.fn(),
    steps: [],
  }),
}));

vi.mock("../../../core/hooks/useBridgePrepare.js", async (importOriginal) => {
  const actual =
    await importOriginal<
      typeof import("../../../core/hooks/useBridgePrepare.js")
    >();
  return { ...actual, useBridgePrepare: () => ({ refetch: refetchSpy }) };
});

const ONRAMP_REQUEST: BridgePrepareRequest = {
  chainId: 8453,
  client: TEST_CLIENT,
  onramp: "transak",
  receiver: "0x0000000000000000000000000000000000000001",
  tokenAddress: "0x0000000000000000000000000000000000000000",
  type: "onramp",
};

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

function renderStepRunner() {
  const onQuoteUpdate = vi.fn();
  render(
    <CustomThemeProvider theme="dark">
      <StepRunner
        autoStart={false}
        client={TEST_CLIENT}
        onBack={vi.fn()}
        onCancel={vi.fn()}
        onComplete={vi.fn()}
        onQuoteUpdate={onQuoteUpdate}
        preparedQuote={ONRAMP_QUOTE}
        request={ONRAMP_REQUEST}
        title={undefined}
        wallet={undefined}
        windowAdapter={{ open: vi.fn(async () => {}) } as WindowAdapter}
      />
    </CustomThemeProvider>,
  );
  return { onQuoteUpdate };
}

describe("StepRunner onramp retry recovery", () => {
  beforeEach(() => {
    retrySpy.mockReset();
    refetchSpy.mockReset();
    refetchSpy.mockResolvedValue({ data: FRESH_QUOTE });
    executor.error = new Error("Payment failed");
  });

  it("re-prepares a fresh session when a failed onramp is retried", async () => {
    executor.onrampStatus = "failed";
    const { onQuoteUpdate } = renderStepRunner();

    fireEvent.click(screen.getByText("Retry"));

    await waitFor(() => expect(refetchSpy).toHaveBeenCalledTimes(1));
    // Must NOT replay the dead session in place.
    expect(retrySpy).not.toHaveBeenCalled();
    await waitFor(() =>
      expect(onQuoteUpdate).toHaveBeenCalledWith(FRESH_QUOTE),
    );
  });

  it("retries in place (never re-onramps) once the onramp has completed", async () => {
    // A post-onramp transaction failed: funds already arrived, so re-onramping
    // would double-charge the buyer.
    executor.onrampStatus = "completed";
    renderStepRunner();

    fireEvent.click(screen.getByText("Retry"));

    expect(retrySpy).toHaveBeenCalledTimes(1);
    expect(refetchSpy).not.toHaveBeenCalled();
  });
});
