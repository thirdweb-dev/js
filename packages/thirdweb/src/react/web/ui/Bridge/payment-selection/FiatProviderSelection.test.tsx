import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TEST_CLIENT } from "~test/test-clients.js";
import { FiatProviderSelection } from "./FiatProviderSelection.js";

vi.mock(
  "../../../../core/hooks/pay/useBuyWithFiatQuotesForProviders.js",
  () => ({
    useBuyWithFiatQuotesForProviders: vi.fn(() => [
      {
        data: {
          intent: { onramp: "coinbase" },
          currencyAmount: 10.5,
          destinationAmount: 10n,
          destinationToken: { symbol: "ETH", decimals: 18 },
        },
        isLoading: false,
        error: null,
        isError: false,
        isSuccess: true,
      },
      {
        data: {
          intent: { onramp: "stripe" },
          currencyAmount: 11.0,
          destinationAmount: 10n,
          destinationToken: { symbol: "ETH", decimals: 18 },
        },
        isLoading: false,
        error: null,
        isError: false,
        isSuccess: true,
      },
      {
        data: {
          intent: { onramp: "transak" },
          currencyAmount: 12.0,
          destinationAmount: 10n,
          destinationToken: { symbol: "ETH", decimals: 18 },
        },
        isLoading: false,
        error: null,
        isError: false,
        isSuccess: true,
      },
    ]),
  }),
);

const queryClient = new QueryClient();

function TestWrapper({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe("FiatProviderSelection - hiddenOnrampProviders", () => {
  it("should render all providers when no providers are hidden", () => {
    const mockOnProviderSelected = vi.fn();

    render(
      <TestWrapper>
        <FiatProviderSelection
          client={TEST_CLIENT}
          onProviderSelected={mockOnProviderSelected}
          toChainId={1}
          toTokenAddress="0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
          toAddress="0x2a4f24F935Eb178e3e7BA9B53A5Ee6d8407C0709"
          toAmount="10"
          currency="USD"
          country={undefined}
          hiddenOnrampProviders={undefined}
        />
      </TestWrapper>,
    );

    expect(screen.getByText("Coinbase")).toBeDefined();
    expect(screen.getByText("Stripe")).toBeDefined();
    expect(screen.getByText("Transak")).toBeDefined();
  });

  it("should hide Transak when specified in hiddenOnrampProviders", () => {
    const mockOnProviderSelected = vi.fn();

    render(
      <TestWrapper>
        <FiatProviderSelection
          client={TEST_CLIENT}
          onProviderSelected={mockOnProviderSelected}
          toChainId={1}
          toTokenAddress="0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
          toAddress="0x2a4f24F935Eb178e3e7BA9B53A5Ee6d8407C0709"
          toAmount="10"
          currency="USD"
          country={undefined}
          hiddenOnrampProviders={["transak"]}
        />
      </TestWrapper>,
    );

    expect(screen.getByText("Coinbase")).toBeDefined();
    expect(screen.getByText("Stripe")).toBeDefined();
    expect(screen.queryByText("Transak")).toBeNull();
  });

  it("should hide multiple providers when specified", () => {
    const mockOnProviderSelected = vi.fn();

    render(
      <TestWrapper>
        <FiatProviderSelection
          client={TEST_CLIENT}
          onProviderSelected={mockOnProviderSelected}
          toChainId={1}
          toTokenAddress="0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
          toAddress="0x2a4f24F935Eb178e3e7BA9B53A5Ee6d8407C0709"
          toAmount="10"
          currency="USD"
          country={undefined}
          hiddenOnrampProviders={["transak", "stripe"]}
        />
      </TestWrapper>,
    );

    expect(screen.getByText("Coinbase")).toBeDefined();
    expect(screen.queryByText("Stripe")).toBeNull();
    expect(screen.queryByText("Transak")).toBeNull();
  });
});
