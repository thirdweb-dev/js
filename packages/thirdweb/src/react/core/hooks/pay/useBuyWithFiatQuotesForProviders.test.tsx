import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { TEST_CLIENT } from "~test/test-clients.js";
import { prepare as prepareOnramp } from "../../../../bridge/Onramp.js";
import { getToken } from "../../../../pay/convert/get-token.js";
import { useBuyWithFiatQuotesForProviders } from "./useBuyWithFiatQuotesForProviders.js";

vi.mock("../../../../bridge/Onramp.js");
vi.mock("../../../../pay/convert/get-token.js");

const RECEIVER = "0x2a4f24F935Eb178e3e7BA9B53A5Ee6d8407C0709" as const;
const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" as const;

describe("useBuyWithFiatQuotesForProviders", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getToken).mockResolvedValue({
      address: USDC,
      chainId: 1,
      decimals: 6,
      name: "USD Coin",
      priceUsd: 1,
      prices: { USD: 1 },
      symbol: "USDC",
    });
    // Return a minimal valid prepared-onramp response per call.
    vi.mocked(prepareOnramp).mockImplementation(async (opts) => ({
      currency: opts.currency ?? "USD",
      currencyAmount: 1,
      destinationAmount: opts.amount ?? 1n,
      destinationToken: {
        address: opts.tokenAddress,
        chainId: opts.chainId,
        decimals: 6,
        name: "USD Coin",
        priceUsd: 1,
        prices: { USD: 1 },
        symbol: "USDC",
      },
      id: `mock-${opts.onramp}`,
      intent: {
        amount: (opts.amount ?? 1n).toString(),
        chainId: opts.chainId,
        onramp: opts.onramp,
        receiver: opts.receiver,
        tokenAddress: opts.tokenAddress,
      },
      link: `https://example.com/${opts.onramp}`,
      steps: [],
      timestamp: 0,
    }));
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };

  it("fans out to all four onramp providers (including rampnow)", async () => {
    const { result } = renderHook(
      () =>
        useBuyWithFiatQuotesForProviders({
          amount: "10",
          chainId: 1,
          client: TEST_CLIENT,
          country: "US",
          currency: "USD",
          receiver: RECEIVER,
          tokenAddress: USDC,
        }),
      { wrapper },
    );

    await waitFor(() => {
      expect(result.current.every((q) => q.isSuccess)).toBe(true);
    });

    expect(result.current).toHaveLength(4);

    // Each provider should be called exactly once with the expected `onramp` value.
    const calls = vi.mocked(prepareOnramp).mock.calls.map((c) => c[0].onramp);
    expect(calls.sort()).toEqual(
      ["coinbase", "rampnow", "stripe", "transak"].sort(),
    );

    // The hook should surface the prepared link per provider.
    const links = result.current.map((q) => q.data?.link);
    expect(links).toContain("https://example.com/rampnow");
    expect(links).toContain("https://example.com/stripe");
    expect(links).toContain("https://example.com/coinbase");
    expect(links).toContain("https://example.com/transak");
  });

  it("is disabled when no params are provided", () => {
    const { result } = renderHook(() => useBuyWithFiatQuotesForProviders(), {
      wrapper,
    });

    expect(result.current).toHaveLength(4);
    expect(result.current.every((q) => !q.isSuccess && !q.isError)).toBe(true);
    expect(vi.mocked(prepareOnramp)).not.toHaveBeenCalled();
  });
});
