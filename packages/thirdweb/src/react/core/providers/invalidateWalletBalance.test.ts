import type { QueryClient } from "@tanstack/react-query";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { invalidateWalletBalance } from "./invalidateWalletBalance.js";

const chainId = 1;

const queryClient = {
  invalidateQueries: vi.fn(),
} as unknown as QueryClient;

describe("invalidateWalletBalance", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call invalidateQueries when chainId is provided", () => {
    invalidateWalletBalance(queryClient, chainId);

    expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
      queryKey: ["walletBalance", chainId] as const,
    });
  });

  it("should call invalidateQueries when chainId is not provided", () => {
    invalidateWalletBalance(queryClient);

    expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
      queryKey: ["walletBalance", undefined] as const,
    });
  });
});
