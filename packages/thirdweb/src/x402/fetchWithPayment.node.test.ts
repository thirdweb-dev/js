import { generatePrivateKey } from "viem/accounts";
import { afterEach, describe, expect, it, vi } from "vitest";
import { getCachedChain } from "../chains/utils.js";
import { createThirdwebClient } from "../client/client.js";
import type { Wallet } from "../wallets/interfaces/wallet.js";
import { privateKeyToAccount } from "../wallets/private-key.js";
import { wrapFetchWithPayment } from "./fetchWithPayment.js";

const URL = "http://127.0.0.1:0/dispatcher-fixture";
const BODY = "bounded upload";
const REFERRER = "https://client.example/context";
const nativeFetch = fetch;
const NativeRequest = Request;
afterEach(() => vi.unstubAllGlobals());
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

type Handler = {
  onConnect: (abort: () => void) => void;
  onHeaders: (
    status: number,
    headers: Buffer[],
    resume: () => void,
    statusText: string,
  ) => void;
  onData: (data: Buffer) => void;
  onComplete: (trailers: Buffer[]) => void;
  onError: (error: Error) => void;
};

/** Models a standards-only Request, which ignores the fetch-only dispatcher. */
function standardRequest(created: Request[] = []): typeof Request {
  return new Proxy(NativeRequest, {
    construct: (_target, args) => {
      const requestInit = args[1] as RequestInit | undefined;
      const standardInit =
        requestInit &&
        new Proxy(
          {},
          {
            get: (_options, property) =>
              property === "dispatcher"
                ? undefined
                : Reflect.get(requestInit, property, requestInit),
          },
        );
      const request = new NativeRequest(args[0] as RequestInfo, standardInit);
      created.push(request);
      return request;
    },
  });
}

/** Uses Node's native dispatcher API to record uploads and wire headers without sockets. */
function merchant(version: 1 | 2): {
  dispatcher: {
    dispatch: (
      options: {
        body?: AsyncIterable<Uint8Array>;
        headers: string[] | Record<string, string>;
      },
      handler: Handler,
    ) => boolean;
  };
  received: string[];
  referrers: Array<string | null>;
} {
  const received: string[] = [];
  const referrers: Array<string | null> = [];
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
  return {
    received,
    referrers,
    dispatcher: {
      dispatch(options, handler): boolean {
        handler.onConnect(() => {});
        void (async () => {
          const chunks: Uint8Array[] = [];
          if (options.body)
            for await (const chunk of options.body) chunks.push(chunk);
          received.push(Buffer.concat(chunks).toString());
          const requestHeaders = new Headers();
          if (Array.isArray(options.headers)) {
            for (let i = 0; i < options.headers.length; i += 2) {
              requestHeaders.append(
                options.headers[i] ?? "",
                options.headers[i + 1] ?? "",
              );
            }
          } else {
            for (const [name, value] of Object.entries(options.headers)) {
              requestHeaders.append(name, value);
            }
          }
          referrers.push(requestHeaders.get("referer"));
          const status = received.length === 1 ? 402 : 200;
          const headers = [
            Buffer.from("content-type"),
            Buffer.from("application/json"),
          ];
          if (status === 402 && version === 2) {
            headers.push(
              Buffer.from("PAYMENT-REQUIRED"),
              Buffer.from(
                Buffer.from(JSON.stringify(challenge)).toString("base64"),
              ),
            );
          }
          handler.onHeaders(
            status,
            headers,
            () => {},
            status === 402 ? "Payment Required" : "OK",
          );
          handler.onData(
            Buffer.from(
              status === 402 && version === 1
                ? JSON.stringify(challenge)
                : "{}",
            ),
          );
          handler.onComplete([]);
        })().catch((error) =>
          handler.onError(
            error instanceof Error ? error : new Error(String(error)),
          ),
        );
        return true;
      },
    },
  };
}

describe.each([1, 2] as const)("x402 v%i native Node dispatcher", (version) => {
  it.each([
    { source: "value", standard: false },
    { source: "getter", standard: false },
    { source: "value", standard: true },
    { source: "getter", standard: true },
  ] as const)(
    "retains the dispatcher and referrer: $source, standard Request $standard",
    async ({ source, standard }) => {
      const { dispatcher, received, referrers } = merchant(version);
      const options: RequestInit & { dispatcher: typeof dispatcher } = {
        dispatcher,
        referrer: REFERRER,
        referrerPolicy: "origin",
      };
      let reads = 0;
      const init: RequestInit & { dispatcher: typeof dispatcher } = {
        ...options,
        get dispatcher() {
          reads++;
          return dispatcher;
        },
      };
      const input = new NativeRequest(URL, {
        method: "POST",
        body: BODY,
      });
      if (standard) {
        vi.stubGlobal("Request", standardRequest());
      }
      const response = await wrapFetchWithPayment(nativeFetch, client, wallet, {
        storage,
      })(input, Object.freeze(source === "getter" ? init : options));
      await response.text();
      expect(response.status).toBe(200);
      expect(received).toEqual([BODY, BODY]);
      expect(input.bodyUsed).toBe(true);
      expect(referrers).toEqual([
        "https://client.example/",
        "https://client.example/",
      ]);
      expect(reads).toBe(source === "getter" ? 2 : 0);
    },
  );

  it("releases the paid body if a fetch-only dispatcher getter rejects", async () => {
    const { dispatcher, received } = merchant(version);
    const created: Request[] = [];
    vi.stubGlobal("Request", standardRequest(created));
    const reason = new Error("dispatcher unavailable on retry");
    let reads = 0;
    const init: RequestInit & { dispatcher: typeof dispatcher } = {
      get dispatcher() {
        if (++reads > 1) throw reason;
        return dispatcher;
      },
    };
    await expect(
      wrapFetchWithPayment(nativeFetch, client, wallet, { storage })(
        new NativeRequest(URL, { method: "POST", body: BODY }),
        init,
      ),
    ).rejects.toBe(reason);
    expect(reads).toBe(2);
    expect(received).toEqual([BODY]);
    expect(created).toHaveLength(1);
    expect(created[0]?.bodyUsed).toBe(true);
  });
});
