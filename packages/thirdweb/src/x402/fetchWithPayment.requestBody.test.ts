import { HttpResponse, http } from "msw";
import { setupServer } from "msw/node";
import { generatePrivateKey } from "viem/accounts";
import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { getCachedChain } from "../chains/utils.js";
import { createThirdwebClient } from "../client/client.js";
import type { Wallet } from "../wallets/interfaces/wallet.js";
import { privateKeyToAccount } from "../wallets/private-key.js";
import { wrapFetchWithPayment } from "./fetchWithPayment.js";

const URL = "https://x402-body.example/resource";
const BODY = '{"message":"bounded request body"}';
const NativeRequest = Request;
const server = setupServer();
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

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => {
  server.resetHandlers();
  vi.restoreAllMocks();
});
afterAll(() => server.close());

function merchant(version: 1 | 2, non402 = false): string[] {
  const received: string[] = [];
  server.use(
    http.all(URL, async ({ request }) => {
      received.push(await request.text());
      if (non402 || received.length > 1) {
        return HttpResponse.json({ success: true });
      }
      const requirement = {
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
                  ...requirement,
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
              accepts: [{ ...requirement, amount: "1" }],
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

function transport(observed: Request[] = []): typeof fetch {
  return (input, init) => {
    // Keep native Request semantics before MSW intercepts the transport.
    const request = new NativeRequest(input, init);
    observed.push(request);
    return fetch(request);
  };
}

describe.each([1, 2] as const)("x402 v%i Request body retries", (version) => {
  it("replays a fresh JSON Request after the first fetch consumes it", async () => {
    const received = merchant(version);
    const input = new NativeRequest(URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: BODY,
    });
    expect(input.bodyUsed).toBe(false);
    const response = await wrapFetchWithPayment(transport(), client, wallet, {
      storage,
    })(input, { headers: { "Content-Type": "application/json" } });
    expect(response.status).toBe(200);
    expect(received).toEqual([BODY, BODY]);
    expect(input.bodyUsed).toBe(true);
  });

  it("inherits a Request body when init.body is null", async () => {
    const received = merchant(version);
    await wrapFetchWithPayment(transport(), client, wallet, { storage })(
      new NativeRequest(URL, { method: "POST", body: BODY }),
      { body: null },
    );
    expect(received).toEqual([BODY, BODY]);
  });

  it("preserves effective Request options and caller cancellation", async () => {
    const received = merchant(version);
    const controller = new AbortController();
    const observed: Request[] = [];
    const input = new NativeRequest(URL, {
      method: "POST",
      body: BODY,
      cache: "no-store",
      credentials: "include",
      redirect: "manual",
      referrer: "https://client.example/context",
      referrerPolicy: "origin",
      signal: controller.signal,
    });
    await wrapFetchWithPayment(transport(observed), client, wallet, {
      storage,
    })(input);
    expect(received).toEqual([BODY, BODY]);
    expect(observed).toHaveLength(2);
    for (const request of observed) {
      expect(request.cache).toBe("no-store");
      expect(request.credentials).toBe("include");
      expect(request.redirect).toBe("manual");
      expect(request.referrer).toBe("https://client.example/context");
      expect(request.referrerPolicy).toBe("origin");
    }
    controller.abort();
    expect(observed.every((request) => request.signal.aborted)).toBe(true);
  });

  it("keeps non-402 responses as a single dispatch without signing", async () => {
    const received = merchant(version, true);
    const sign = vi.spyOn(account, "signTypedData");
    const response = await wrapFetchWithPayment(transport(), client, wallet, {
      storage,
    })(new NativeRequest(URL, { method: "POST", body: BODY }));
    expect(response.status).toBe(200);
    expect(received).toEqual([BODY]);
    expect(sign).not.toHaveBeenCalled();
  });

  it("preserves URL input with a replayable init.body", async () => {
    const received = merchant(version);
    await wrapFetchWithPayment(transport(), client, wallet, { storage })(URL, {
      method: "POST",
      body: BODY,
    });
    expect(received).toEqual([BODY, BODY]);
  });

  it.each([false, true])(
    "allows an explicit init.body override when the input was consumed: %s",
    async (consumed) => {
      const received = merchant(version);
      const input = new NativeRequest(URL, {
        method: "POST",
        body: "original",
      });
      if (consumed) await input.text();
      await wrapFetchWithPayment(transport(), client, wallet, { storage })(
        input,
        {
          body: BODY,
        },
      );
      expect(received).toEqual([BODY, BODY]);
    },
  );

  it("rejects failed payment signing without dispatching a retry", async () => {
    const received = merchant(version);
    const error = new Error("signing declined");
    vi.spyOn(account, "signTypedData").mockRejectedValueOnce(error);
    await expect(
      wrapFetchWithPayment(transport(), client, wallet, { storage })(
        new NativeRequest(URL, { method: "POST", body: BODY }),
      ),
    ).rejects.toBe(error);
    expect(received).toEqual([BODY]);
  });

  it("rejects a payment over maxValue without dispatching a retry", async () => {
    const received = merchant(version);
    await expect(
      wrapFetchWithPayment(transport(), client, wallet, {
        storage,
        maxValue: 0n,
      })(new NativeRequest(URL, { method: "POST", body: BODY })),
    ).rejects.toThrow("exceeds maximum");
    expect(received).toEqual([BODY]);
  });
});

it("propagates an initial fetch rejection without consuming the caller body", async () => {
  const input = new NativeRequest(URL, { method: "POST", body: BODY });
  const error = new Error("transport unavailable");
  const failingFetch: typeof fetch = async () => {
    throw error;
  };
  await expect(
    wrapFetchWithPayment(failingFetch, client, wallet, { storage })(input),
  ).rejects.toBe(error);
  expect(input.bodyUsed).toBe(false);
  expect(await input.text()).toBe(BODY);
});

it("releases the intermediate clone when Request options are invalid", async () => {
  const cancel = vi.fn();
  const body = new ReadableStream<Uint8Array>({ cancel });
  const requestInit: RequestInit & { duplex: "half" } = {
    method: "POST",
    body,
    duplex: "half",
  };
  const input = new NativeRequest(URL, requestInit);
  await expect(
    wrapFetchWithPayment(transport(), client, wallet, { storage })(input, {
      method: "GET",
    }),
  ).rejects.toThrow();
  let timeout: ReturnType<typeof setTimeout> | undefined;
  try {
    await Promise.race([
      input.body?.cancel(),
      new Promise<never>((_, reject) => {
        timeout = setTimeout(
          () => reject(new Error("cancel did not finish")),
          500,
        );
      }),
    ]);
  } finally {
    clearTimeout(timeout);
  }
  expect(cancel).toHaveBeenCalledOnce();
});
