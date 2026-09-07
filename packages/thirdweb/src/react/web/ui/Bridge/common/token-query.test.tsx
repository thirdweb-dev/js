import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { TEST_CLIENT } from "~test/test-clients.js";
import type { TokenWithPrices } from "../../../../../bridge/index.js";
import { getToken } from "../../../../../pay/convert/get-token.js";
import { useTokenQuery } from "./token-query.js";

vi.mock("../../../../../pay/convert/get-token.js", () => ({
  getToken: vi.fn(),
}));

const TOKEN_ADDRESS = "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359";
const CHAIN_ID = 137;

const MOCK_TOKEN = {
  address: TOKEN_ADDRESS,
  chainId: CHAIN_ID,
  decimals: 6,
  name: "USD Coin",
  prices: { USD: 1 },
  symbol: "USDC",
} as TokenWithPrices;

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useTokenQuery", () => {
  beforeEach(() => {
    vi.mocked(getToken).mockReset();
  });

  it("returns success when getToken resolves", async () => {
    vi.mocked(getToken).mockResolvedValue(MOCK_TOKEN);

    const { result } = renderHook(
      () =>
        useTokenQuery({
          chainId: CHAIN_ID,
          client: TEST_CLIENT,
          tokenAddress: TOKEN_ADDRESS,
        }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual({
      token: MOCK_TOKEN,
      type: "success",
    });
  });

  it("returns unsupported_token when getToken throws a not-supported Error", async () => {
    vi.mocked(getToken).mockRejectedValue(new Error("Token not supported"));

    const { result } = renderHook(
      () =>
        useTokenQuery({
          chainId: CHAIN_ID,
          client: TEST_CLIENT,
          tokenAddress: TOKEN_ADDRESS,
        }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual({ type: "unsupported_token" });
    expect(result.current.isError).toBe(false);
  });

  it("surfaces 401 failures as query errors instead of unsupported_token", async () => {
    vi.mocked(getToken).mockRejectedValue(new Error("401 Unauthorized"));

    const { result } = renderHook(
      () =>
        useTokenQuery({
          chainId: CHAIN_ID,
          client: TEST_CLIENT,
          tokenAddress: TOKEN_ADDRESS,
        }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeInstanceOf(Error);
    expect((result.current.error as Error).message).toBe("401 Unauthorized");
  });

  it("surfaces non-Error rejections as query errors instead of unsupported_token", async () => {
    vi.mocked(getToken).mockRejectedValue("timeout");

    const { result } = renderHook(
      () =>
        useTokenQuery({
          chainId: CHAIN_ID,
          client: TEST_CLIENT,
          tokenAddress: TOKEN_ADDRESS,
        }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.data).toBeUndefined();
  });
});
