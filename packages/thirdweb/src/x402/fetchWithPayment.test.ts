import { beforeEach, describe, expect, it, vi } from "vitest";
import { allowance } from "../extensions/erc20/__generated__/IERC20/read/allowance.js";
import { nonces } from "../extensions/erc20/__generated__/IERC20Permit/read/nonces.js";
import { getAddress } from "../utils/address.js";
import type { AsyncStorage } from "../utils/storage/AsyncStorage.js";
import { webLocalStorage } from "../utils/storage/webStorage.js";
import { safeBase64Decode, safeBase64Encode } from "./encode.js";
import { wrapFetchWithPayment } from "./fetchWithPayment.js";
import { getPaymentRequestHeader } from "./headers.js";
import {
  getPermitSignatureFromCache,
  savePermitSignatureToCache,
} from "./permitSignatureStorage.js";

vi.mock("./common.js", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./common.js")>();
  return {
    ...actual,
    getSupportedSignatureType: vi.fn(
      async (args: { eip712Extras?: { primaryType?: string } }) =>
        args.eip712Extras?.primaryType ?? "TransferWithAuthorization",
    ),
  };
});

vi.mock("../extensions/erc20/__generated__/IERC20/read/allowance.js", () => ({
  allowance: vi.fn(),
}));

vi.mock(
  "../extensions/erc20/__generated__/IERC20Permit/read/nonces.js",
  () => ({
    nonces: vi.fn(),
  }),
);

// Mock webLocalStorage
vi.mock("../utils/storage/webStorage.js", () => ({
  webLocalStorage: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
  },
}));

const SIGNATURE = `0x${"11".repeat(65)}`;
const CACHED_SIGNATURE = `0x${"22".repeat(65)}`;
const OWNER = "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd";
const PAY_TO = "0x1234567890123456789012345678901234567890";
const OTHER_ADDRESS = "0x9999999999999999999999999999999999999999";
const ASSET = "0x0000000000000000000000000000000000000001";

function base64Utf8(data: unknown): string {
  return Buffer.from(JSON.stringify(data), "utf-8").toString("base64");
}

function paymentRequiredResponse(
  data: unknown,
  mode: "header" | "body",
): Response {
  if (mode === "header") {
    return new Response(null, {
      status: 402,
      headers: { "payment-required": base64Utf8(data) },
    });
  }
  return new Response(JSON.stringify(data), { status: 402 });
}

function successResponse(): Response {
  return new Response(JSON.stringify({ success: true }), { status: 200 });
}

describe("wrapFetchWithPayment", () => {
  const mockPaymentRequirements = {
    scheme: "exact",
    network: "eip155:1",
    maxAmountRequired: "1000000",
    resource: "https://api.example.com/resource",
    description: "Test payment",
    mimeType: "application/json",
    payTo: PAY_TO,
    maxTimeoutSeconds: 300,
    asset: ASSET,
    extra: {
      name: "Test Token",
      version: "1",
    },
  };

  const mock402ResponseData = {
    x402Version: 2,
    accepts: [mockPaymentRequirements],
    error: undefined,
  };

  const canonicalV2Requirement = {
    scheme: "exact",
    network: "eip155:1",
    amount: "12345",
    payTo: PAY_TO,
    maxTimeoutSeconds: 300,
    asset: ASSET,
    extra: {
      name: "Test Token",
      version: "1",
    },
  };

  const canonicalV2Resource = {
    url: "https://api.example.com/resource",
    description: "Test payment",
    mimeType: "application/json",
  };

  const mockClient = {
    clientId: "test-client-id",
  } as Parameters<typeof wrapFetchWithPayment>[1];

  const mockAccount = {
    address: OWNER,
    signTypedData: vi.fn(),
  };

  const mockWallet = {
    getAccount: vi.fn().mockReturnValue(mockAccount),
    getChain: vi.fn().mockReturnValue({ id: 1 }),
    switchChain: vi.fn(),
  } as unknown as Parameters<typeof wrapFetchWithPayment>[2];

  function sentPayment(
    mockFetch: ReturnType<typeof vi.fn>,
    x402Version: number,
  ) {
    const init = mockFetch.mock.calls[1]?.[1] as RequestInit;
    const headers = init.headers as Record<string, string>;
    const header = headers[getPaymentRequestHeader(x402Version)];
    expect(header).toBeDefined();
    return JSON.parse(
      Buffer.from(header as string, "base64").toString("utf-8"),
    );
  }

  function signedValues() {
    return mockAccount.signTypedData.mock.calls.map(
      (call) => (call[0] as { message: { value: bigint } }).message.value,
    );
  }

  function mockFetchWith(...responses: Response[]) {
    const mockFetch = vi.fn();
    for (const response of responses) {
      mockFetch.mockResolvedValueOnce(response);
    }
    return mockFetch;
  }

  beforeEach(() => {
    vi.clearAllMocks();
    mockAccount.signTypedData.mockResolvedValue(SIGNATURE);
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
    const mockFetch = mockFetchWith(
      paymentRequiredResponse(mock402ResponseData, "header"),
      successResponse(),
    );

    const wrappedFetch = wrapFetchWithPayment(
      mockFetch,
      mockClient,
      mockWallet,
    );
    const response = await wrappedFetch("https://api.example.com/resource");

    expect(response.status).toBe(200);
    expect(mockFetch).toHaveBeenCalledTimes(2);

    // Verify the second call includes the payment header for the version
    const secondCallInit = mockFetch.mock.calls[1]?.[1] as RequestInit;
    expect(secondCallInit.headers).toHaveProperty(
      getPaymentRequestHeader(mock402ResponseData.x402Version),
    );
  });

  it("should parse payment requirements from JSON body when payment-required header is absent", async () => {
    const mockFetch = mockFetchWith(
      paymentRequiredResponse(mock402ResponseData, "body"),
      successResponse(),
    );

    const wrappedFetch = wrapFetchWithPayment(
      mockFetch,
      mockClient,
      mockWallet,
    );
    const response = await wrappedFetch("https://api.example.com/resource");

    expect(response.status).toBe(200);
    expect(mockFetch).toHaveBeenCalledTimes(2);

    // Verify the second call includes the payment header for the version
    const secondCallInit = mockFetch.mock.calls[1]?.[1] as RequestInit;
    expect(secondCallInit.headers).toHaveProperty(
      getPaymentRequestHeader(mock402ResponseData.x402Version),
    );
  });

  it("should prefer payment-required header over JSON body when both are present", async () => {
    const headerPaymentRequirements = {
      ...mockPaymentRequirements,
      maxAmountRequired: "500000", // Different amount to verify header is used
    };
    const headerResponseData = {
      x402Version: 2,
      accepts: [headerPaymentRequirements],
    };

    const bodyResponseData = {
      x402Version: 2,
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

    const mockFetch = mockFetchWith(mock402Response, successResponse());

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
    expect(signedValues()).toEqual([500000n]);
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

    const mockFetch = mockFetchWith(mock402Response, successResponse());

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

    // Verify the retry request was made with the v1 payment header
    const secondCallInit = mockFetch.mock.calls[1]?.[1] as RequestInit;
    expect(secondCallInit.headers).toHaveProperty(
      getPaymentRequestHeader(parsed.x402Version),
    );
  });

  it("does not sign when a payment was already attempted for the request", async () => {
    const mockFetch = mockFetchWith(
      paymentRequiredResponse(mock402ResponseData, "header"),
    );

    const wrappedFetch = wrapFetchWithPayment(
      mockFetch,
      mockClient,
      mockWallet,
    );

    await expect(
      wrappedFetch("https://api.example.com/resource", {
        __is402Retry: true,
      } as RequestInit),
    ).rejects.toThrow("Payment already attempted");
    expect(mockAccount.signTypedData).not.toHaveBeenCalled();
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  describe("x402 v2 payment requirements", () => {
    it("pays a canonical v2 header requirement that only specifies amount", async () => {
      const paymentRequired = {
        x402Version: 2,
        resource: canonicalV2Resource,
        accepts: [canonicalV2Requirement],
      };
      const mockFetch = mockFetchWith(
        paymentRequiredResponse(paymentRequired, "header"),
        successResponse(),
      );

      const wrappedFetch = wrapFetchWithPayment(
        mockFetch,
        mockClient,
        mockWallet,
        { maxValue: 12345n },
      );
      const response = await wrappedFetch("https://api.example.com/resource");

      expect(response.status).toBe(200);
      expect(signedValues()).toEqual([12345n]);

      const typedData = mockAccount.signTypedData.mock.calls[0]?.[0];
      expect(typedData.primaryType).toBe("TransferWithAuthorization");
      expect(typedData.domain.chainId).toBe(1);
      expect(typedData.domain.verifyingContract).toBe(getAddress(ASSET));
      expect(typedData.message.from).toBe(getAddress(OWNER));
      expect(typedData.message.to).toBe(getAddress(PAY_TO));

      const init = mockFetch.mock.calls[1]?.[1] as RequestInit;
      expect(init.headers).toHaveProperty("PAYMENT-SIGNATURE");
      expect(init.headers).not.toHaveProperty("X-PAYMENT");

      const payment = sentPayment(mockFetch, 2);
      expect(payment.x402Version).toBe(2);
      expect(payment.payload.authorization.value).toBe("12345");
      expect(payment.payload.signature).toBe(SIGNATURE);
    });

    it("includes the raw accepted requirement and top-level scheme/network in the v2 payload", async () => {
      const paymentRequired = {
        x402Version: 2,
        resource: canonicalV2Resource,
        accepts: [canonicalV2Requirement],
      };
      const mockFetch = mockFetchWith(
        paymentRequiredResponse(paymentRequired, "header"),
        successResponse(),
      );

      const wrappedFetch = wrapFetchWithPayment(
        mockFetch,
        mockClient,
        mockWallet,
      );
      await wrappedFetch("https://api.example.com/resource");

      const payment = sentPayment(mockFetch, 2);
      expect(payment.scheme).toBe("exact");
      expect(payment.network).toBe("eip155:1");
      expect(payment.accepted).toEqual(canonicalV2Requirement);
      expect(payment.accepted).not.toHaveProperty("maxAmountRequired");
      expect(payment.resource).toEqual(canonicalV2Resource);
    });

    it("pays a canonical v2 JSON body requirement", async () => {
      const paymentRequired = {
        x402Version: 2,
        accepts: [canonicalV2Requirement],
      };
      const mockFetch = mockFetchWith(
        paymentRequiredResponse(paymentRequired, "body"),
        successResponse(),
      );

      const wrappedFetch = wrapFetchWithPayment(
        mockFetch,
        mockClient,
        mockWallet,
      );
      const response = await wrappedFetch("https://api.example.com/paid");

      expect(response.status).toBe(200);
      expect(signedValues()).toEqual([12345n]);

      const payment = sentPayment(mockFetch, 2);
      expect(payment.payload.authorization.value).toBe("12345");
      expect(payment.accepted).toEqual(canonicalV2Requirement);
      expect(payment.resource.url).toBe("https://api.example.com/paid");
    });

    it.each(["header", "body"] as const)(
      "pays a v2 %s requirement with non-Latin-1 text",
      async (mode) => {
        const requirement = {
          ...canonicalV2Requirement,
          description: "Premium — content ✓",
        };
        const resource = {
          ...canonicalV2Resource,
          description: "Données 日本語",
        };
        const paymentRequired = {
          x402Version: 2,
          resource,
          accepts: [requirement],
        };
        const mockFetch = mockFetchWith(
          paymentRequiredResponse(paymentRequired, mode),
          successResponse(),
        );

        const wrappedFetch = wrapFetchWithPayment(
          mockFetch,
          mockClient,
          mockWallet,
        );
        const response = await wrappedFetch("https://api.example.com/resource");

        expect(response.status).toBe(200);
        const payment = sentPayment(mockFetch, 2);
        expect(payment.accepted).toEqual(requirement);
        expect(payment.resource).toEqual(resource);
        expect(signedValues()).toEqual([12345n]);
      },
    );

    it("pays a v2 envelope with v1-shaped requirements", async () => {
      const paymentRequired = {
        x402Version: 2,
        error: "Payment required",
        resource: { url: "https://api.example.com/resource" },
        accepts: [mockPaymentRequirements],
      };
      const mockFetch = mockFetchWith(
        paymentRequiredResponse(paymentRequired, "header"),
        successResponse(),
      );

      const wrappedFetch = wrapFetchWithPayment(
        mockFetch,
        mockClient,
        mockWallet,
      );
      const response = await wrappedFetch("https://api.example.com/resource");

      expect(response.status).toBe(200);
      expect(signedValues()).toEqual([1000000n]);

      const payment = sentPayment(mockFetch, 2);
      expect(payment.payload.authorization.value).toBe("1000000");
      expect(payment.accepted).toEqual(mockPaymentRequirements);
      expect(payment.resource).toEqual({
        url: "https://api.example.com/resource",
      });
    });

    it("pays a v1 body requirement with the v1 header and payload", async () => {
      const paymentRequired = {
        x402Version: 1,
        accepts: [mockPaymentRequirements],
      };
      const mockFetch = mockFetchWith(
        paymentRequiredResponse(paymentRequired, "body"),
        successResponse(),
      );

      const wrappedFetch = wrapFetchWithPayment(
        mockFetch,
        mockClient,
        mockWallet,
      );
      const response = await wrappedFetch("https://api.example.com/resource");

      expect(response.status).toBe(200);
      const init = mockFetch.mock.calls[1]?.[1] as RequestInit;
      expect(init.headers).toHaveProperty("X-PAYMENT");
      expect(init.headers).not.toHaveProperty("PAYMENT-SIGNATURE");

      const payment = sentPayment(mockFetch, 1);
      expect(Object.keys(payment).sort()).toEqual(
        ["network", "payload", "scheme", "x402Version"].sort(),
      );
      expect(payment.x402Version).toBe(1);
      expect(payment.payload.authorization.value).toBe("1000000");
      expect(signedValues()).toEqual([1000000n]);
    });

    it("defaults to x402 v2 when the response has no x402Version", async () => {
      const mockFetch = mockFetchWith(
        paymentRequiredResponse(
          { resource: canonicalV2Resource, accepts: [canonicalV2Requirement] },
          "header",
        ),
        successResponse(),
      );

      const wrappedFetch = wrapFetchWithPayment(
        mockFetch,
        mockClient,
        mockWallet,
      );
      await wrappedFetch("https://api.example.com/resource");

      const init = mockFetch.mock.calls[1]?.[1] as RequestInit;
      expect(init.headers).toHaveProperty("PAYMENT-SIGNATURE");
      const payment = sentPayment(mockFetch, 2);
      expect(payment.x402Version).toBe(2);
      expect(payment.accepted).toEqual(canonicalV2Requirement);
    });

    describe.each(["header", "body"] as const)("%s", (mode) => {
      it.each([
        [1, { amount: "1", maxAmountRequired: "1000000000" }],
        [1, { amount: "1000000000", maxAmountRequired: "1" }],
        [2, { amount: "1", maxAmountRequired: "1000000000" }],
        [2, { amount: "1000000000", maxAmountRequired: "1" }],
      ])(
        "rejects before signing when amounts differ (x402Version %i, %j)",
        async (x402Version, amounts) => {
          const paymentRequired = {
            x402Version,
            accepts: [{ ...mockPaymentRequirements, ...amounts }],
          };
          const mockFetch = mockFetchWith(
            paymentRequiredResponse(paymentRequired, mode),
            successResponse(),
          );

          const wrappedFetch = wrapFetchWithPayment(
            mockFetch,
            mockClient,
            mockWallet,
          );

          await expect(
            wrappedFetch("https://api.example.com/resource"),
          ).rejects.toThrow("do not match");
          expect(mockAccount.signTypedData).not.toHaveBeenCalled();
          expect(mockFetch).toHaveBeenCalledTimes(1);
        },
      );
    });

    it("rejects before signing when amounts differ with maxValue set", async () => {
      const paymentRequired = {
        x402Version: 2,
        resource: canonicalV2Resource,
        accepts: [
          {
            ...canonicalV2Requirement,
            amount: "1",
            maxAmountRequired: "1000000000",
          },
        ],
      };
      const mockFetch = mockFetchWith(
        paymentRequiredResponse(paymentRequired, "header"),
        successResponse(),
      );

      const wrappedFetch = wrapFetchWithPayment(
        mockFetch,
        mockClient,
        mockWallet,
        { maxValue: 10n },
      );

      await expect(
        wrappedFetch("https://api.example.com/resource"),
      ).rejects.toThrow("do not match");
      expect(mockAccount.signTypedData).not.toHaveBeenCalled();
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it("rejects when a requirement that would not be selected has mismatched amounts", async () => {
      const paymentRequired = {
        x402Version: 2,
        resource: canonicalV2Resource,
        accepts: [
          canonicalV2Requirement,
          {
            ...canonicalV2Requirement,
            network: "eip155:8453",
            amount: "1",
            maxAmountRequired: "1000000000",
          },
        ],
      };
      const mockFetch = mockFetchWith(
        paymentRequiredResponse(paymentRequired, "header"),
        successResponse(),
      );

      const wrappedFetch = wrapFetchWithPayment(
        mockFetch,
        mockClient,
        mockWallet,
      );

      await expect(
        wrappedFetch("https://api.example.com/resource"),
      ).rejects.toThrow("do not match");
      expect(mockAccount.signTypedData).not.toHaveBeenCalled();
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it("accepts amount and maxAmountRequired when they are equal", async () => {
      const paymentRequired = {
        x402Version: 2,
        resource: canonicalV2Resource,
        accepts: [{ ...canonicalV2Requirement, maxAmountRequired: "12345" }],
      };
      const mockFetch = mockFetchWith(
        paymentRequiredResponse(paymentRequired, "header"),
        successResponse(),
      );

      const wrappedFetch = wrapFetchWithPayment(
        mockFetch,
        mockClient,
        mockWallet,
      );
      const response = await wrappedFetch("https://api.example.com/resource");

      expect(response.status).toBe(200);
      expect(signedValues()).toEqual([12345n]);
    });

    it("signs the canonical form of a zero-padded amount", async () => {
      const requirement = {
        ...canonicalV2Requirement,
        amount: "0100",
        maxAmountRequired: "100",
      };
      const mockFetch = mockFetchWith(
        paymentRequiredResponse(
          {
            x402Version: 2,
            resource: canonicalV2Resource,
            accepts: [requirement],
          },
          "header",
        ),
        successResponse(),
      );

      const wrappedFetch = wrapFetchWithPayment(
        mockFetch,
        mockClient,
        mockWallet,
        { maxValue: 100n },
      );
      await wrappedFetch("https://api.example.com/resource");

      expect(signedValues()).toEqual([100n]);
      const payment = sentPayment(mockFetch, 2);
      expect(payment.payload.authorization.value).toBe("100");
      expect(payment.accepted).toEqual(requirement);
    });

    it("pays the maximum uint256 amount", async () => {
      const max = (2n ** 256n - 1n).toString();
      const mockFetch = mockFetchWith(
        paymentRequiredResponse(
          {
            x402Version: 2,
            resource: canonicalV2Resource,
            accepts: [{ ...canonicalV2Requirement, amount: max }],
          },
          "header",
        ),
        successResponse(),
      );

      const wrappedFetch = wrapFetchWithPayment(
        mockFetch,
        mockClient,
        mockWallet,
      );
      await wrappedFetch("https://api.example.com/resource");

      expect(signedValues()).toEqual([2n ** 256n - 1n]);
      expect(sentPayment(mockFetch, 2).payload.authorization.value).toBe(max);
    });

    it.each([
      ["canonical v2", { x402Version: 2, accepts: [canonicalV2Requirement] }],
      ["v1-shaped", mock402ResponseData],
    ])(
      "blocks a %s payment when maxValue is 0n",
      async (_name, paymentRequired) => {
        const mockFetch = mockFetchWith(
          paymentRequiredResponse(paymentRequired, "header"),
          successResponse(),
        );

        const wrappedFetch = wrapFetchWithPayment(
          mockFetch,
          mockClient,
          mockWallet,
          { maxValue: 0n },
        );

        await expect(
          wrappedFetch("https://api.example.com/resource"),
        ).rejects.toThrow("Payment amount exceeds maximum allowed");
        expect(mockAccount.signTypedData).not.toHaveBeenCalled();
        expect(mockFetch).toHaveBeenCalledTimes(1);
      },
    );

    it("blocks a canonical v2 amount above maxValue", async () => {
      const paymentRequired = {
        x402Version: 2,
        resource: canonicalV2Resource,
        accepts: [canonicalV2Requirement],
      };
      const mockFetch = mockFetchWith(
        paymentRequiredResponse(paymentRequired, "header"),
      );

      const wrappedFetch = wrapFetchWithPayment(
        mockFetch,
        mockClient,
        mockWallet,
        { maxValue: 12344n },
      );

      await expect(
        wrappedFetch("https://api.example.com/resource"),
      ).rejects.toThrow("Payment amount exceeds maximum allowed");
      expect(mockAccount.signTypedData).not.toHaveBeenCalled();
    });

    it.each([
      ["amount", { amount: "1e3" }],
      ["maxAmountRequired", { amount: undefined, maxAmountRequired: "1e3" }],
      ["amount", { amount: "-1" }],
      ["amount", { amount: "1.5" }],
      ["amount", { amount: "" }],
      ["amount", { amount: 1000 }],
      ["amount", { amount: (2n ** 256n).toString() }],
      ["amount", { amount: "0x10" }],
      ["maxAmountRequired", { amount: undefined, maxAmountRequired: "0x10" }],
      ["amount", { amount: " 100" }],
      ["amount", { amount: "100\n" }],
      ["amount", { amount: "+100" }],
      ["amount", { amount: "1".repeat(79) }],
      ["maxAmountRequired", { maxAmountRequired: "" }],
    ])("rejects a malformed %s (%j)", async (_field, override) => {
      const paymentRequired = {
        x402Version: 2,
        resource: canonicalV2Resource,
        accepts: [{ ...canonicalV2Requirement, ...override }],
      };
      const mockFetch = mockFetchWith(
        paymentRequiredResponse(paymentRequired, "header"),
      );

      const wrappedFetch = wrapFetchWithPayment(
        mockFetch,
        mockClient,
        mockWallet,
      );

      await expect(
        wrappedFetch("https://api.example.com/resource"),
      ).rejects.toThrow("Invalid payment requirements");
      expect(mockAccount.signTypedData).not.toHaveBeenCalled();
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it("rejects a requirement with no amount", async () => {
      const { amount: _amount, ...withoutAmount } = canonicalV2Requirement;
      const paymentRequired = {
        x402Version: 2,
        resource: canonicalV2Resource,
        accepts: [withoutAmount],
      };
      const mockFetch = mockFetchWith(
        paymentRequiredResponse(paymentRequired, "header"),
      );

      const wrappedFetch = wrapFetchWithPayment(
        mockFetch,
        mockClient,
        mockWallet,
      );

      await expect(
        wrappedFetch("https://api.example.com/resource"),
      ).rejects.toThrow("missing amount or maxAmountRequired");
      expect(mockAccount.signTypedData).not.toHaveBeenCalled();
    });

    describe("resource resolution", () => {
      it("keeps the requirement resource and echoes the top-level resource", async () => {
        const requirement = {
          ...mockPaymentRequirements,
          resource: "https://api.example.com/a",
        };
        const topLevelResource = { url: "https://api.example.com/b" };
        const mockFetch = mockFetchWith(
          paymentRequiredResponse(
            {
              x402Version: 2,
              resource: topLevelResource,
              accepts: [requirement],
            },
            "header",
          ),
          successResponse(),
        );
        const selector = vi.fn(
          (requirements: Array<{ resource: string }>) => requirements[0],
        );

        const wrappedFetch = wrapFetchWithPayment(
          mockFetch,
          mockClient,
          mockWallet,
          { paymentRequirementsSelector: selector as never },
        );
        await wrappedFetch("https://api.example.com/c");

        expect(selector.mock.calls[0]?.[0]?.[0]?.resource).toBe(
          "https://api.example.com/a",
        );
        const payment = sentPayment(mockFetch, 2);
        expect(payment.resource).toEqual(topLevelResource);
        expect(payment.accepted).toEqual(requirement);
      });

      it.each([
        [
          "a Request",
          () => new Request("https://api.example.com/request"),
          "https://api.example.com/request",
        ],
        [
          "a URL",
          () => new URL("https://api.example.com/url"),
          "https://api.example.com/url",
        ],
      ])(
        "falls back to the URL of %s",
        async (_name, createInput, expectedUrl) => {
          const mockFetch = mockFetchWith(
            paymentRequiredResponse(
              { x402Version: 2, accepts: [canonicalV2Requirement] },
              "body",
            ),
            successResponse(),
          );

          const wrappedFetch = wrapFetchWithPayment(
            mockFetch,
            mockClient,
            mockWallet,
          );
          await wrappedFetch(createInput() as unknown as RequestInfo);

          expect(sentPayment(mockFetch, 2).resource.url).toBe(expectedUrl);
        },
      );

      it("rejects before signing when no resource URL can be resolved", async () => {
        const mockFetch = mockFetchWith(
          paymentRequiredResponse(
            { x402Version: 2, accepts: [canonicalV2Requirement] },
            "body",
          ),
          successResponse(),
        );

        const wrappedFetch = wrapFetchWithPayment(
          mockFetch,
          mockClient,
          mockWallet,
        );

        await expect(wrappedFetch("/paid")).rejects.toThrow();
        expect(mockAccount.signTypedData).not.toHaveBeenCalled();
        expect(mockFetch).toHaveBeenCalledTimes(1);
      });
    });

    describe("custom selector", () => {
      const paymentRequired = {
        x402Version: 2,
        resource: canonicalV2Resource,
        accepts: [canonicalV2Requirement],
      };

      it("validates requirements returned by a custom selector", async () => {
        const mockFetch = mockFetchWith(
          paymentRequiredResponse(paymentRequired, "header"),
        );

        const wrappedFetch = wrapFetchWithPayment(
          mockFetch,
          mockClient,
          mockWallet,
          {
            paymentRequirementsSelector: (requirements) => {
              const [first] = requirements;
              return first ? { ...first, maxAmountRequired: "1e3" } : undefined;
            },
          },
        );

        await expect(
          wrappedFetch("https://api.example.com/resource"),
        ).rejects.toThrow("Invalid payment requirements");
        expect(mockAccount.signTypedData).not.toHaveBeenCalled();
      });

      it("validates a parsed requirement modified in place by a custom selector", async () => {
        const mockFetch = mockFetchWith(
          paymentRequiredResponse(paymentRequired, "header"),
        );

        const wrappedFetch = wrapFetchWithPayment(
          mockFetch,
          mockClient,
          mockWallet,
          {
            paymentRequirementsSelector: (requirements) => {
              const [first] = requirements;
              if (first) {
                first.maxAmountRequired = "0x10";
              }
              return first;
            },
          },
        );

        await expect(
          wrappedFetch("https://api.example.com/resource"),
        ).rejects.toThrow("Invalid payment requirements");
        expect(mockAccount.signTypedData).not.toHaveBeenCalled();
      });

      it("caps the amount of a copy returned by a custom selector", async () => {
        const mockFetch = mockFetchWith(
          paymentRequiredResponse(paymentRequired, "header"),
        );

        const wrappedFetch = wrapFetchWithPayment(
          mockFetch,
          mockClient,
          mockWallet,
          {
            maxValue: 15000n,
            paymentRequirementsSelector: (requirements) => {
              const [first] = requirements;
              return first
                ? { ...first, maxAmountRequired: "20000" }
                : undefined;
            },
          },
        );

        await expect(
          wrappedFetch("https://api.example.com/resource"),
        ).rejects.toThrow("Payment amount exceeds maximum allowed");
        expect(mockAccount.signTypedData).not.toHaveBeenCalled();
      });

      it("signs and echoes a copy returned by a custom selector", async () => {
        const mockFetch = mockFetchWith(
          paymentRequiredResponse(paymentRequired, "header"),
          successResponse(),
        );

        const wrappedFetch = wrapFetchWithPayment(
          mockFetch,
          mockClient,
          mockWallet,
          {
            paymentRequirementsSelector: (requirements) => {
              const [first] = requirements;
              return first
                ? { ...first, maxAmountRequired: "20000" }
                : undefined;
            },
          },
        );
        await wrappedFetch("https://api.example.com/resource");

        expect(signedValues()).toEqual([20000n]);
        const payment = sentPayment(mockFetch, 2);
        expect(payment.payload.authorization.value).toBe("20000");
        expect(payment.accepted.maxAmountRequired).toBe("20000");
      });

      it("exposes the normalised amount as maxAmountRequired to selectors", async () => {
        const mockFetch = mockFetchWith(
          paymentRequiredResponse(paymentRequired, "header"),
          successResponse(),
        );
        const selector = vi.fn(
          (requirements: Array<{ maxAmountRequired: string }>) =>
            requirements[0],
        );

        const wrappedFetch = wrapFetchWithPayment(
          mockFetch,
          mockClient,
          mockWallet,
          {
            paymentRequirementsSelector: selector as never,
          },
        );
        await wrappedFetch("https://api.example.com/resource");

        expect(selector.mock.calls[0]?.[0]).toEqual([
          expect.objectContaining({
            maxAmountRequired: "12345",
            resource: canonicalV2Resource.url,
            description: "",
            mimeType: "",
          }),
        ]);
        expect(signedValues()).toEqual([12345n]);
        expect(sentPayment(mockFetch, 2).accepted).toEqual(
          canonicalV2Requirement,
        );
      });
    });
  });

  describe("upto permit cache", () => {
    const uptoRequirement = {
      ...canonicalV2Requirement,
      scheme: "upto",
      amount: "1000",
      extra: {
        name: "Test Token",
        version: "1",
        primaryType: "Permit",
      },
    };

    const cacheParams = {
      chainId: 1,
      asset: ASSET,
      owner: OWNER,
      spender: PAY_TO,
    };

    function createMemoryStorage(): AsyncStorage {
      const store = new Map<string, string>();
      return {
        getItem: async (key) => store.get(key) ?? null,
        setItem: async (key, value) => {
          store.set(key, value);
        },
        removeItem: async (key) => {
          store.delete(key);
        },
      };
    }

    async function seedCachedPermit(
      storage: AsyncStorage,
      value: string,
      overrides: {
        deadlineOffset?: number;
        from?: string;
        to?: string;
        envelope?: Record<string, unknown>;
      } = {},
    ) {
      const deadline = String(
        Math.floor(Date.now() / 1000) + (overrides.deadlineOffset ?? 3600),
      );
      await savePermitSignatureToCache(
        storage,
        cacheParams,
        {
          x402Version: 1,
          scheme: "upto",
          network: "eip155:1",
          ...overrides.envelope,
          payload: {
            signature: CACHED_SIGNATURE,
            authorization: {
              from: overrides.from ?? OWNER,
              to: overrides.to ?? PAY_TO,
              value,
              validAfter: "0",
              validBefore: deadline,
              nonce: `0x${"00".repeat(32)}`,
            },
          },
        } as Parameters<typeof savePermitSignatureToCache>[2],
        deadline,
        value,
      );
    }

    beforeEach(() => {
      vi.mocked(allowance).mockResolvedValue(10n ** 18n);
      vi.mocked(nonces).mockResolvedValue(0n);
    });

    it("reuses a cached permit that covers the amount, in the current envelope", async () => {
      const storage = createMemoryStorage();
      await seedCachedPermit(storage, "5000");

      const paymentRequired = {
        x402Version: 2,
        resource: canonicalV2Resource,
        accepts: [uptoRequirement],
      };
      const mockFetch = mockFetchWith(
        paymentRequiredResponse(paymentRequired, "header"),
        successResponse(),
      );

      const wrappedFetch = wrapFetchWithPayment(
        mockFetch,
        mockClient,
        mockWallet,
        { storage },
      );
      const response = await wrappedFetch("https://api.example.com/resource");

      expect(response.status).toBe(200);
      expect(mockAccount.signTypedData).not.toHaveBeenCalled();

      const payment = sentPayment(mockFetch, 2);
      expect(payment.x402Version).toBe(2);
      expect(payment.scheme).toBe("upto");
      expect(payment.network).toBe("eip155:1");
      expect(payment.accepted).toEqual(uptoRequirement);
      expect(payment.resource).toEqual(canonicalV2Resource);
      expect(payment.payload.signature).toBe(CACHED_SIGNATURE);
    });

    it("signs a new permit when the cached permit is below the amount", async () => {
      const storage = createMemoryStorage();
      await seedCachedPermit(storage, "999");

      const paymentRequired = {
        x402Version: 2,
        resource: canonicalV2Resource,
        accepts: [uptoRequirement],
      };
      const mockFetch = mockFetchWith(
        paymentRequiredResponse(paymentRequired, "header"),
        successResponse(),
      );

      const wrappedFetch = wrapFetchWithPayment(
        mockFetch,
        mockClient,
        mockWallet,
        { storage },
      );
      const response = await wrappedFetch("https://api.example.com/resource");

      expect(response.status).toBe(200);
      expect(signedValues()).toEqual([1000n]);

      const payment = sentPayment(mockFetch, 2);
      expect(payment.payload.signature).toBe(SIGNATURE);
      expect(payment.payload.authorization.value).toBe("1000");
      expect(payment.accepted).toEqual(uptoRequirement);

      const cached = await getPermitSignatureFromCache(storage, cacheParams);
      expect(cached?.maxAmount).toBe("1000");
      expect(cached?.payload.x402Version).toBe(2);
      expect(cached?.payload.payload).toMatchObject({
        signature: SIGNATURE,
        authorization: { value: "1000" },
      });
    });

    it.each([
      { name: "a cached value equal to the amount", reused: true },
      {
        name: "a minAmountRequired covered by the allowance",
        allowance: 600n,
        minAmountRequired: "500",
        reused: true,
      },
      {
        name: "a cached value above maxValue",
        maxValue: 1000n,
        cachedValue: "5000",
        reused: false,
      },
      { name: "an expired deadline", deadlineOffset: -60, reused: false },
      { name: "an allowance below the amount", allowance: 999n, reused: false },
      {
        name: "a minAmountRequired of zero",
        allowance: 0n,
        minAmountRequired: "0",
        reused: false,
      },
      { name: "a malformed cached value", cachedValue: "1e3", reused: false },
      {
        name: "a permit for another spender",
        to: OTHER_ADDRESS,
        reused: false,
      },
      {
        name: "a permit from another owner",
        from: OTHER_ADDRESS,
        reused: false,
      },
    ])("handles $name", async (testCase) => {
      const storage = createMemoryStorage();
      await seedCachedPermit(storage, testCase.cachedValue ?? "1000", {
        deadlineOffset: testCase.deadlineOffset,
        from: testCase.from,
        to: testCase.to,
      });
      if (testCase.allowance !== undefined) {
        vi.mocked(allowance).mockResolvedValue(testCase.allowance);
      }

      const requirement = testCase.minAmountRequired
        ? {
            ...uptoRequirement,
            extra: {
              ...uptoRequirement.extra,
              minAmountRequired: testCase.minAmountRequired,
            },
          }
        : uptoRequirement;
      const mockFetch = mockFetchWith(
        paymentRequiredResponse(
          {
            x402Version: 2,
            resource: canonicalV2Resource,
            accepts: [requirement],
          },
          "header",
        ),
        successResponse(),
      );

      const wrappedFetch = wrapFetchWithPayment(
        mockFetch,
        mockClient,
        mockWallet,
        { storage, maxValue: testCase.maxValue },
      );
      await wrappedFetch("https://api.example.com/resource");

      const payment = sentPayment(mockFetch, 2);
      if (testCase.reused) {
        expect(mockAccount.signTypedData).not.toHaveBeenCalled();
        expect(payment.payload.signature).toBe(CACHED_SIGNATURE);
      } else {
        expect(signedValues()).toEqual([1000n]);
        expect(payment.payload.signature).toBe(SIGNATURE);
        expect(payment.payload.authorization.value).toBe("1000");
      }
    });

    it("reuses a v2 cached permit in a v1 envelope for a v1 requirement", async () => {
      const storage = createMemoryStorage();
      await seedCachedPermit(storage, "5000", {
        envelope: {
          x402Version: 2,
          accepted: uptoRequirement,
          resource: canonicalV2Resource,
        },
      });

      const v1Requirement = {
        ...mockPaymentRequirements,
        scheme: "upto",
        maxAmountRequired: "1000",
        extra: uptoRequirement.extra,
      };
      const mockFetch = mockFetchWith(
        paymentRequiredResponse(
          { x402Version: 1, accepts: [v1Requirement] },
          "body",
        ),
        successResponse(),
      );

      const wrappedFetch = wrapFetchWithPayment(
        mockFetch,
        mockClient,
        mockWallet,
        { storage },
      );
      await wrappedFetch("https://api.example.com/resource");

      expect(mockAccount.signTypedData).not.toHaveBeenCalled();
      const payment = sentPayment(mockFetch, 1);
      expect(Object.keys(payment).sort()).toEqual(
        ["network", "payload", "scheme", "x402Version"].sort(),
      );
      expect(payment.x402Version).toBe(1);
      expect(payment.payload.signature).toBe(CACHED_SIGNATURE);
    });

    it("writes and clears the permit with the default storage when payment is rejected", async () => {
      const paymentRequired = {
        x402Version: 2,
        resource: canonicalV2Resource,
        accepts: [uptoRequirement],
      };
      const mockFetch = mockFetchWith(
        paymentRequiredResponse(paymentRequired, "header"),
        paymentRequiredResponse(paymentRequired, "header"),
      );

      const wrappedFetch = wrapFetchWithPayment(
        mockFetch,
        mockClient,
        mockWallet,
      );
      const response = await wrappedFetch("https://api.example.com/resource");

      expect(response.status).toBe(402);
      const expectedKey = `x402:permit:1:${ASSET.toLowerCase()}:${OWNER.toLowerCase()}:${PAY_TO.toLowerCase()}`;
      expect(vi.mocked(webLocalStorage.setItem).mock.calls[0]?.[0]).toBe(
        expectedKey,
      );
      expect(vi.mocked(webLocalStorage.removeItem)).toHaveBeenCalledTimes(1);
      expect(vi.mocked(webLocalStorage.removeItem).mock.calls[0]?.[0]).toBe(
        expectedKey,
      );
    });
  });
});
