/**
 * @vitest-environment happy-dom
 */
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { routes } from "../../../bridge/Routes.js";
import type { Token } from "../../../bridge/types/Token.js";
import type { ThirdwebClient } from "../../../client/client.js";
import { usePaymentMethods } from "./usePaymentMethods.js";

// Mock the routes API
vi.mock("../../../bridge/Routes.js", () => ({
  routes: vi.fn(),
}));

const mockRoutes = vi.mocked(routes);

// Mock data
const mockDestinationToken: Token = {
  chainId: 1,
  address: "0xA0b86a33E6441aA7A6fbEEc9bb27e5e8bc3b8eD7",
  decimals: 6,
  symbol: "USDC",
  name: "USD Coin",
  priceUsd: 1.0,
};

const mockClient = {
  clientId: "test-client-id",
} as ThirdwebClient;

const mockRouteData = [
  {
    originToken: {
      chainId: 1,
      address: "0xA0b86a33E6441aA7A6fbEEc9bb27e5e8bc3b8eD7",
      decimals: 18,
      symbol: "ETH",
      name: "Ethereum",
      priceUsd: 2000,
    },
    destinationToken: mockDestinationToken,
    steps: [],
  },
  {
    originToken: {
      chainId: 137,
      address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
      decimals: 6,
      symbol: "USDC",
      name: "USD Coin",
      priceUsd: 1.0,
    },
    destinationToken: mockDestinationToken,
    steps: [],
  },
  {
    originToken: {
      chainId: 42161,
      address: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
      decimals: 6,
      symbol: "USDC",
      name: "USD Coin",
      priceUsd: 1.0,
    },
    destinationToken: mockDestinationToken,
    steps: [],
  },
];

// Test wrapper component
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children);
};

describe("usePaymentMethods", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should require destinationToken and client parameters", () => {
    const wrapper = createWrapper();

    const { result } = renderHook(
      () =>
        usePaymentMethods({
          destinationToken: mockDestinationToken,
          destinationAmount: "1",
          client: mockClient,
        }),
      { wrapper },
    );

    expect(result.current).toBeDefined();
    expect(result.current.isLoading).toBe(true);
  });

  it("should fetch routes and transform data correctly", async () => {
    mockRoutes.mockResolvedValueOnce(mockRouteData);
    const wrapper = createWrapper();

    const { result } = renderHook(
      () =>
        usePaymentMethods({
          destinationToken: mockDestinationToken,
          destinationAmount: "1",
          client: mockClient,
        }),
      { wrapper },
    );

    // Initially loading
    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toEqual([]);

    // Wait for query to resolve
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Should have transformed data
    expect(result.current.data).toHaveLength(4); // 3 wallet methods + 1 fiat method

    const walletMethod = result.current.data[0];
    expect(walletMethod?.type).toBe("wallet");
    if (walletMethod?.type === "wallet") {
      expect(walletMethod.originToken).toEqual(mockRouteData[0]?.originToken);
    }

    const fiatMethod = result.current.data[3];
    expect(fiatMethod?.type).toBe("fiat");
    if (fiatMethod?.type === "fiat") {
      expect(fiatMethod.currency).toBe("USD");
    }
  });

  it("should call routes API with correct parameters", async () => {
    mockRoutes.mockResolvedValueOnce(mockRouteData);
    const wrapper = createWrapper();

    renderHook(
      () =>
        usePaymentMethods({
          destinationToken: mockDestinationToken,
          destinationAmount: "1",
          client: mockClient,
        }),
      { wrapper },
    );

    await waitFor(() => {
      expect(mockRoutes).toHaveBeenCalledWith({
        client: mockClient,
        destinationChainId: mockDestinationToken.chainId,
        destinationTokenAddress: mockDestinationToken.address,
        sortBy: "popularity",
        limit: 50,
      });
    });
  });

  it("should handle empty routes data", async () => {
    mockRoutes.mockResolvedValueOnce([]);
    const wrapper = createWrapper();

    const { result } = renderHook(
      () =>
        usePaymentMethods({
          destinationToken: mockDestinationToken,
          destinationAmount: "1",
          client: mockClient,
        }),
      { wrapper },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Should only have fiat method when no routes
    expect(result.current.data).toHaveLength(1);
    expect(result.current.data[0]).toEqual({
      type: "fiat",
      currency: "USD",
    });
  });

  it("should handle API errors gracefully", async () => {
    const mockError = new Error("API Error");
    mockRoutes.mockRejectedValueOnce(mockError);
    const wrapper = createWrapper();

    const { result } = renderHook(
      () =>
        usePaymentMethods({
          destinationToken: mockDestinationToken,
          destinationAmount: "1",
          client: mockClient,
        }),
      { wrapper },
    );

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeTruthy();
    expect(result.current.data).toEqual([]);
  });

  it("should deduplicate origin tokens", async () => {
    // Mock data with duplicate origin tokens
    const firstRoute = mockRouteData[0];
    if (!firstRoute) {
      throw new Error("Mock data is invalid");
    }

    const mockDataWithDuplicates = [
      ...mockRouteData,
      {
        originToken: firstRoute.originToken, // Duplicate ETH
        destinationToken: mockDestinationToken,
        steps: [],
      },
    ];

    mockRoutes.mockResolvedValueOnce(mockDataWithDuplicates);
    const wrapper = createWrapper();

    const { result } = renderHook(
      () =>
        usePaymentMethods({
          destinationToken: mockDestinationToken,
          destinationAmount: "1",
          client: mockClient,
        }),
      { wrapper },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Should still have only 4 methods (3 unique wallet + 1 fiat)
    expect(result.current.data).toHaveLength(4);

    // Check that ETH only appears once
    const walletMethods = result.current.data.filter(
      (m) => m.type === "wallet",
    );
    const ethMethods = walletMethods.filter(
      (m) => m.type === "wallet" && m.originToken?.symbol === "ETH",
    );
    expect(ethMethods).toHaveLength(1);
  });

  it("should always include fiat payment option", async () => {
    mockRoutes.mockResolvedValueOnce(mockRouteData);
    const wrapper = createWrapper();

    const { result } = renderHook(
      () =>
        usePaymentMethods({
          destinationToken: mockDestinationToken,
          destinationAmount: "1",
          client: mockClient,
        }),
      { wrapper },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    const fiatMethods = result.current.data.filter((m) => m.type === "fiat");
    expect(fiatMethods).toHaveLength(1);
    expect(fiatMethods[0]).toEqual({
      type: "fiat",
      currency: "USD",
    });
  });

  it("should have correct query key for caching", async () => {
    mockRoutes.mockResolvedValueOnce(mockRouteData);
    const wrapper = createWrapper();

    const { result } = renderHook(
      () =>
        usePaymentMethods({
          destinationToken: mockDestinationToken,
          destinationAmount: "1",
          client: mockClient,
        }),
      { wrapper },
    );

    // The hook should use a query key that includes chain ID and token address
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockRoutes).toHaveBeenCalledTimes(1);
  });

  it("should provide refetch functionality", async () => {
    mockRoutes.mockResolvedValueOnce(mockRouteData);
    const wrapper = createWrapper();

    const { result } = renderHook(
      () =>
        usePaymentMethods({
          destinationToken: mockDestinationToken,
          destinationAmount: "1",
          client: mockClient,
        }),
      { wrapper },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(typeof result.current.refetch).toBe("function");
  });
});
