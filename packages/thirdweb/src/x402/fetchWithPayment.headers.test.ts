import { HttpResponse, http } from "msw";
import { setupServer } from "msw/node";
import { generatePrivateKey } from "viem/accounts";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { getCachedChain } from "../chains/utils.js";
import { createThirdwebClient } from "../client/client.js";
import type { Wallet } from "../wallets/interfaces/wallet.js";
import { privateKeyToAccount } from "../wallets/private-key.js";
import { wrapFetchWithPayment } from "./fetchWithPayment.js";
import { getPaymentRequestHeader } from "./headers.js";

const URL = "https://x402-headers.example/resource";
const APP_HEADERS = {
  Authorization: "Bearer fixture-user",
  "X-Tenant": "fixture-tenant",
};
const server = setupServer();
const NativeRequest = Request;
const client = createThirdwebClient({ clientId: "fixture-client" });
const account = privateKeyToAccount({
  client,
  privateKey: generatePrivateKey(),
});
const wallet = {
  getAccount: () => account,
  getChain: () => getCachedChain(84532),
} as Wallet;
const storage = {
  getItem: async () => null,
  setItem: async () => {},
  removeItem: async () => {},
};
// MSW 2.7 merges Request + init headers; normalize first to test native replacement semantics.
const fetchWithNativeRequest: typeof fetch = (input, init) =>
  fetch(new NativeRequest(input, init));

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

function snapshotHeaders(headers: Headers): Record<string, string> {
  const snapshot: Record<string, string> = {};
  headers.forEach((value: string, name: string) => {
    snapshot[name] = value;
  });
  return snapshot;
}

function merchant(version: 1 | 2, afterInitial?: () => void): Headers[] {
  const received: Headers[] = [];
  server.use(
    http.get(URL, ({ request }) => {
      received.push(new Headers(request.headers));
      if (received.length > 1) return HttpResponse.json({ success: true });
      afterInitial?.();
      const requirements = {
        scheme: "exact",
        network: version === 1 ? "base-sepolia" : "eip155:84532",
        payTo: "0x2222222222222222222222222222222222222222",
        asset: "0x3333333333333333333333333333333333333333",
        maxTimeoutSeconds: 300,
        extra: {
          name: "Fixture Token",
          version: "1",
          primaryType: "TransferWithAuthorization",
        },
      };
      const challenge =
        version === 1
          ? {
              x402Version: 1,
              accepts: [
                {
                  ...requirements,
                  maxAmountRequired: "1",
                  resource: URL,
                  description: "fixture",
                  mimeType: "application/json",
                },
              ],
            }
          : {
              x402Version: 2,
              resource: { url: URL },
              accepts: [{ ...requirements, amount: "1" }],
            };
      return version === 1
        ? HttpResponse.json(challenge, { status: 402 })
        : new HttpResponse(null, {
            status: 402,
            headers: {
              "PAYMENT-REQUIRED": Buffer.from(
                JSON.stringify(challenge),
              ).toString("base64"),
            },
          });
    }),
  );
  return received;
}

describe.each([1, 2] as const)("x402 v%i retry headers", (version) => {
  it.each(["object", "Headers", "tuples", "Request"] as const)(
    "preserves effective %s headers",
    async (form) => {
      const received = merchant(version);
      const headers =
        form === "Headers"
          ? new Headers(APP_HEADERS)
          : form === "tuples"
            ? Object.entries(APP_HEADERS)
            : APP_HEADERS;
      const input = form === "Request" ? new Request(URL, { headers }) : URL;
      const init = form === "Request" ? undefined : { headers };
      const before = snapshotHeaders(new Headers(headers));
      const response = await wrapFetchWithPayment(
        fetchWithNativeRequest,
        client,
        wallet,
        {
          storage,
        },
      )(input, init);
      expect(response.status).toBe(200);
      expect(received).toHaveLength(2);
      for (const requestHeaders of received) {
        expect(requestHeaders.get("Authorization")).toBe(
          APP_HEADERS.Authorization,
        );
        expect(requestHeaders.get("X-Tenant")).toBe(APP_HEADERS["X-Tenant"]);
      }
      expect(received[1]?.has(getPaymentRequestHeader(version))).toBe(true);
      expect(snapshotHeaders(new Headers(headers))).toEqual(before);
      if (input instanceof Request) {
        expect(snapshotHeaders(input.headers)).toEqual(before);
      }
    },
  );

  it.each(["object", "Headers", "tuples"] as const)(
    "keeps explicit %s overrides as full replacements",
    async (form) => {
      const received = merchant(version);
      const replacement = { "X-Override": "replacement" };
      const headers =
        form === "Headers"
          ? new Headers(replacement)
          : form === "tuples"
            ? Object.entries(replacement)
            : replacement;
      await wrapFetchWithPayment(fetchWithNativeRequest, client, wallet, {
        storage,
      })(new Request(URL, { headers: APP_HEADERS }), { headers });
      for (const requestHeaders of received) {
        expect(requestHeaders.get("Authorization")).toBeNull();
        expect(requestHeaders.get("X-Tenant")).toBeNull();
        expect(requestHeaders.get("X-Override")).toBe("replacement");
      }
      expect(received).toHaveLength(2);
    },
  );

  it.each([
    { name: "object", headers: {} },
    { name: "Headers", headers: new Headers() },
    { name: "tuples", headers: [] },
  ])("keeps an explicit empty $name override", async ({ headers }) => {
    const received = merchant(version);
    await wrapFetchWithPayment(fetchWithNativeRequest, client, wallet, {
      storage,
    })(new Request(URL, { headers: APP_HEADERS }), { headers });
    expect(received).toHaveLength(2);
    expect(received[1]?.get("Authorization")).toBeNull();
    expect(received[1]?.get("X-Tenant")).toBeNull();
  });

  it("inherits Request headers when init.headers is undefined", async () => {
    const received = merchant(version);
    await wrapFetchWithPayment(fetchWithNativeRequest, client, wallet, {
      storage,
    })(new Request(URL, { headers: APP_HEADERS }), { headers: undefined });
    expect(received[1]?.get("Authorization")).toBe(APP_HEADERS.Authorization);
  });

  it("snapshots headers before the first request", async () => {
    const headers = new Headers(APP_HEADERS);
    const received = merchant(version, () => headers.set("X-Tenant", "later"));
    await wrapFetchWithPayment(fetchWithNativeRequest, client, wallet, {
      storage,
    })(URL, {
      headers,
    });
    expect(received[0]?.get("X-Tenant")).toBe("fixture-tenant");
    expect(received[1]?.get("X-Tenant")).toBe("fixture-tenant");
    expect(headers.get("X-Tenant")).toBe("later");
  });

  it("replaces payment headers case-insensitively without mutating input", async () => {
    const headers = new Headers(APP_HEADERS);
    const paymentHeader = getPaymentRequestHeader(version);
    headers.set(paymentHeader.toLowerCase(), "old-payment");
    headers.set("access-control-expose-headers", "old-response");
    const received = merchant(version);
    await wrapFetchWithPayment(fetchWithNativeRequest, client, wallet, {
      storage,
    })(URL, {
      headers,
    });
    const payment = received[1]?.get(paymentHeader) ?? "";
    expect(payment).not.toContain("old-payment");
    expect(
      JSON.parse(Buffer.from(payment, "base64").toString()).x402Version,
    ).toBe(version);
    expect(headers.get(paymentHeader)).toBe("old-payment");
    expect(headers.get("access-control-expose-headers")).toBe("old-response");
  });
});
