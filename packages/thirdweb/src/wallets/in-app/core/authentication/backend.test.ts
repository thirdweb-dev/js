import { describe, expect, it, vi } from "vitest";
import { TEST_CLIENT } from "~test/test-clients.js";
import { getClientFetch } from "../../../../utils/fetch.js";
import { stringify } from "../../../../utils/json.js";
import { backendAuthenticate } from "./backend.js";
import { getLoginUrl } from "./getLoginPath.js";

// Mock dependencies
vi.mock("../../../../utils/fetch.js");
vi.mock("./getLoginPath.js");

describe("backendAuthenticate", () => {
  it("should successfully authenticate and return token", async () => {
    // Mock response data
    const mockResponse = {
      cookieString: "mock-cookie",
      token: "mock-token",
    };

    // Mock fetch implementation
    const mockFetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
      ok: true,
    });

    // Mock dependencies
    vi.mocked(getClientFetch).mockReturnValue(mockFetch);
    vi.mocked(getLoginUrl).mockReturnValue("/auth/login");

    const result = await backendAuthenticate({
      client: TEST_CLIENT,
      walletSecret: "test-secret",
    });

    // Verify the fetch call
    expect(mockFetch).toHaveBeenCalledWith("/auth/login", {
      body: stringify({ walletSecret: "test-secret" }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    // Verify response
    expect(result).toEqual(mockResponse);
  });

  it("should throw error when authentication fails", async () => {
    // Mock failed fetch response
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      text: () => Promise.resolve("Failed to generate backend account"),
    });

    // Mock dependencies
    vi.mocked(getClientFetch).mockReturnValue(mockFetch);
    vi.mocked(getLoginUrl).mockReturnValue("/auth/login");

    // Test inputs
    const args = {
      client: TEST_CLIENT,
      walletSecret: "test-secret",
    };

    // Verify error is thrown
    await expect(backendAuthenticate(args)).rejects.toThrow(
      "Failed to generate backend account",
    );
  });
});
