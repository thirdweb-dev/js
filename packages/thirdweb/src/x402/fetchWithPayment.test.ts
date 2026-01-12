import { beforeEach, describe, expect, it, vi } from "vitest";
import { safeBase64Decode, safeBase64Encode } from "./encode.js";
import { wrapFetchWithPayment } from "./fetchWithPayment.js";

// Mock the createPaymentHeader function
vi.mock("./sign.js", () => ({
  createPaymentHeader: vi.fn().mockResolvedValue("mock-payment-header"),
}));

// Mock webLocalStorage
vi.mock("../utils/storage/webStorage.js", () => ({
  webLocalStorage: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
  },
}));

describe("wrapFetchWithPayment", () => {
  const mockPaymentRequirements = {
    scheme: "exact",
    network: "eip155:1",
    maxAmountRequired: "1000000",
    resource: "https://api.example.com/resource",
    description: "Test payment",
    mimeType: "application/json",
    payTo: "0x1234567890123456789012345678901234567890",
    maxTimeoutSeconds: 300,
    asset: "0x0000000000000000000000000000000000000001",
    extra: {
      name: "Test Token",
      version: "1",
    },
  };

  const mock402ResponseData = {
    x402Version: 1,
    accepts: [mockPaymentRequirements],
    error: undefined,
  };

  const mockClient = {
    clientId: "test-client-id",
  } as Parameters<typeof wrapFetchWithPayment>[1];

  const mockAccount = {
    address: "0x1234567890123456789012345678901234567890",
    signTypedData: vi.fn(),
  };

  const mockWallet = {
    getAccount: vi.fn().mockReturnValue(mockAccount),
    getChain: vi.fn().mockReturnValue({ id: 1 }),
    switchChain: vi.fn(),
  } as unknown as Parameters<typeof wrapFetchWithPayment>[2];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should pass through non-402 responses unchanged", async () => {
    const mockResponse = new Response(JSON.stringify({ data: "test" }), {
      status: 200,
    });
    const mockFetch = vi.fn().mockResolvedValue(mockResponse);

    const wrappedFetch = wrapFetchWithPayment(
      mockFetch,
      mockClient,
      mockWallet,
    );
    const response = await wrappedFetch("https://api.example.com/resource");

    expect(response.status).toBe(200);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it("should parse payment requirements from payment-required header when present", async () => {
    const encodedPaymentInfo = safeBase64Encode(
      JSON.stringify(mock402ResponseData),
    );

    const mock402Response = new Response(null, {
      status: 402,
      headers: {
        "payment-required": encodedPaymentInfo,
      },
    });

    const mockSuccessResponse = new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
      },
    );

    const mockFetch = vi
      .fn()
      .mockResolvedValueOnce(mock402Response)
      .mockResolvedValueOnce(mockSuccessResponse);

    const wrappedFetch = wrapFetchWithPayment(
      mockFetch,
      mockClient,
      mockWallet,
    );
    const response = await wrappedFetch("https://api.example.com/resource");

    expect(response.status).toBe(200);
    expect(mockFetch).toHaveBeenCalledTimes(2);

    // Verify the second call includes the X-PAYMENT header
    const secondCallInit = mockFetch.mock.calls[1]?.[1] as RequestInit;
    expect(secondCallInit.headers).toHaveProperty("X-PAYMENT");
  });

  it("should parse payment requirements from JSON body when payment-required header is absent", async () => {
    const mock402Response = new Response(JSON.stringify(mock402ResponseData), {
      status: 402,
    });

    const mockSuccessResponse = new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
      },
    );

    const mockFetch = vi
      .fn()
      .mockResolvedValueOnce(mock402Response)
      .mockResolvedValueOnce(mockSuccessResponse);

    const wrappedFetch = wrapFetchWithPayment(
      mockFetch,
      mockClient,
      mockWallet,
    );
    const response = await wrappedFetch("https://api.example.com/resource");

    expect(response.status).toBe(200);
    expect(mockFetch).toHaveBeenCalledTimes(2);

    // Verify the second call includes the X-PAYMENT header
    const secondCallInit = mockFetch.mock.calls[1]?.[1] as RequestInit;
    expect(secondCallInit.headers).toHaveProperty("X-PAYMENT");
  });

  it("should prefer payment-required header over JSON body when both are present", async () => {
    const headerPaymentRequirements = {
      ...mockPaymentRequirements,
      maxAmountRequired: "500000", // Different amount to verify header is used
    };
    const headerResponseData = {
      x402Version: 1,
      accepts: [headerPaymentRequirements],
    };

    const bodyResponseData = {
      x402Version: 1,
      accepts: [{ ...mockPaymentRequirements, maxAmountRequired: "2000000" }],
    };

    const encodedPaymentInfo = safeBase64Encode(
      JSON.stringify(headerResponseData),
    );

    // Create response with both header and body
    const mock402Response = new Response(JSON.stringify(bodyResponseData), {
      status: 402,
      headers: {
        "payment-required": encodedPaymentInfo,
      },
    });

    const mockSuccessResponse = new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
      },
    );

    const mockFetch = vi
      .fn()
      .mockResolvedValueOnce(mock402Response)
      .mockResolvedValueOnce(mockSuccessResponse);

    // Use maxValue to verify which payment requirements are used
    // If header is used (500000), it should pass
    // If body is used (2000000), it would exceed maxValue
    const wrappedFetch = wrapFetchWithPayment(
      mockFetch,
      mockClient,
      mockWallet,
      {
        maxValue: BigInt(1000000),
      },
    );

    const response = await wrappedFetch("https://api.example.com/resource");

    // Should succeed because header value (500000) is under maxValue (1000000)
    expect(response.status).toBe(200);
  });

  it("should parse payment requirements from payment-required header", async () => {
    const encodedPaymentInfo = safeBase64Encode(
      JSON.stringify(mock402ResponseData),
    );

    const mock402Response = new Response(null, {
      status: 402,
      headers: {
        "payment-required": encodedPaymentInfo,
      },
    });

    const mockSuccessResponse = new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
      },
    );

    const mockFetch = vi
      .fn()
      .mockResolvedValueOnce(mock402Response)
      .mockResolvedValueOnce(mockSuccessResponse);

    const wrappedFetch = wrapFetchWithPayment(
      mockFetch,
      mockClient,
      mockWallet,
    );
    const response = await wrappedFetch("https://api.example.com/resource");

    expect(response.status).toBe(200);
    expect(mockFetch).toHaveBeenCalledTimes(2);

    // Verify the second call includes the X-PAYMENT header
    const secondCallInit = mockFetch.mock.calls[1]?.[1] as RequestInit;
    expect(secondCallInit.headers).toHaveProperty("X-PAYMENT");
  });

  it("should correctly decode a raw base64 encoded payment-required header", async () => {
    // This is an actual base64 encoded payment requirements header
    // Original JSON: {"x402Version":1,"accepts":[{"scheme":"exact","network":"eip155:8453","maxAmountRequired":"100000","resource":"https://example.com/api","description":"API access","mimeType":"application/json","payTo":"0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045","maxTimeoutSeconds":300,"asset":"0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913","extra":{"name":"USD Coin","version":"2"}}]}
    const rawBase64Header =
      "eyJ4NDAyVmVyc2lvbiI6MSwiYWNjZXB0cyI6W3sic2NoZW1lIjoiZXhhY3QiLCJuZXR3b3JrIjoiZWlwMTU1Ojg0NTMiLCJtYXhBbW91bnRSZXF1aXJlZCI6IjEwMDAwMCIsInJlc291cmNlIjoiaHR0cHM6Ly9leGFtcGxlLmNvbS9hcGkiLCJkZXNjcmlwdGlvbiI6IkFQSSBhY2Nlc3MiLCJtaW1lVHlwZSI6ImFwcGxpY2F0aW9uL2pzb24iLCJwYXlUbyI6IjB4ZDhkQTZCRjI2OTY0YUY5RDdlRWQ5ZTAzRTUzNDE1RDM3YUE5NjA0NSIsIm1heFRpbWVvdXRTZWNvbmRzIjozMDAsImFzc2V0IjoiMHg4MzM1ODlmQ0Q2ZURiNkUwOGY0YzdDMzJENGY3MWI1NGJkQTAyOTEzIiwiZXh0cmEiOnsibmFtZSI6IlVTRCBDb2luIiwidmVyc2lvbiI6IjIifX1dfQ==";

    // Verify the base64 decodes to valid JSON
    const decoded = safeBase64Decode(rawBase64Header);
    const parsed = JSON.parse(decoded);

    expect(parsed.x402Version).toBe(1);
    expect(parsed.accepts).toHaveLength(1);
    expect(parsed.accepts[0].network).toBe("eip155:8453");
    expect(parsed.accepts[0].maxAmountRequired).toBe("100000");
    expect(parsed.accepts[0].payTo).toBe(
      "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
    );

    // Now test the full flow with this raw header
    const mock402Response = new Response(null, {
      status: 402,
      headers: {
        "payment-required": rawBase64Header,
      },
    });

    const mockSuccessResponse = new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
      },
    );

    const mockFetch = vi
      .fn()
      .mockResolvedValueOnce(mock402Response)
      .mockResolvedValueOnce(mockSuccessResponse);

    // Use a wallet on Base (chain 8453) to match the payment requirements
    const baseWallet = {
      getAccount: vi.fn().mockReturnValue(mockAccount),
      getChain: vi.fn().mockReturnValue({ id: 8453 }),
      switchChain: vi.fn(),
    } as unknown as Parameters<typeof wrapFetchWithPayment>[2];

    const wrappedFetch = wrapFetchWithPayment(
      mockFetch,
      mockClient,
      baseWallet,
    );
    const response = await wrappedFetch("https://example.com/api");

    expect(response.status).toBe(200);
    expect(mockFetch).toHaveBeenCalledTimes(2);

    // Verify the retry request was made with X-PAYMENT header
    const secondCallInit = mockFetch.mock.calls[1]?.[1] as RequestInit;
    expect(secondCallInit.headers).toHaveProperty("X-PAYMENT");
  });
});
