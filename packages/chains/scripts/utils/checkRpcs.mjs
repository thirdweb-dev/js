import fetch from "cross-fetch";
import { WebSocket } from "ws";

export async function checkRpcs(chain, onBadRpc) {
  const rpcs = [...chain.rpc];

  const resolvedRpcs = await Promise.allSettled(
    rpcs.map(async (rpc) => {
      // we want to eventually return the original RPC back *if* it's valid and online
      const originalRpc = `${rpc}`;

      // replace api key
      for (const { key, apiKey } of testApiKeys) {
        rpc = replaceApiKey(rpc, key, apiKey);
      }

      try {
        await validateChainId(rpc, chain.chainId, { timeout: 5000 });
        return originalRpc;
      } catch (e) {
        if (onBadRpc) {
          onBadRpc(originalRpc, e);
        }

        return null;
      }
    }),
  );
  return resolvedRpcs.map((v) => v.value).filter(Boolean);
}

const testApiKeys = [
  {
    key: "${INFURA_API_KEY}",
    // community api key
    apiKey: "84842078b09946638c03157f83405213",
  },
  {
    key: "${ALCHEMY_API_KEY}",
    // community api key
    apiKey: "demo",
  },
];

function replaceApiKey(rpc, key, apiKey) {
  return rpc.replace(key, apiKey);
}

function normalizeChainId(chainId) {
  if (typeof chainId === "string") {
    return Number.parseInt(
      chainId,
      chainId.trim().substring(0, 2) === "0x" ? 16 : 10,
    );
  }
  if (typeof chainId === "bigint") {
    return Number(chainId);
  }
  return chainId;
}

function isChainIdEqual(gotChainId, expectedChainId) {
  return normalizeChainId(gotChainId) === normalizeChainId(expectedChainId);
}

export class RequestTimeoutError extends Error {
  constructor(message) {
    super(message);
    this.name = "RequestTimeoutError";
  }
}

export class InvalidChainIdError extends Error {
  constructor(gotChainId, expectedChainId) {
    super(
      `Invalid chainId: ${normalizeChainId(
        gotChainId,
      )} (expected: ${normalizeChainId(expectedChainId)})`,
    );
    this.name = "InvalidChainIdError";
  }
}

export function isInvalidChainIdError(error) {
  return error instanceof Error && error.name === "InvalidChainIdError";
}

export function isRequestTimeoutError(error) {
  return error instanceof Error && error.name === "RequestTimeoutError";
}

async function timeout(ms) {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new RequestTimeoutError(`Request timed out after ${ms}ms`));
    }, ms);
  });
}

export async function validateChainId(
  rpcUrl,
  chainId,
  options = { timeout: 2000 },
) {
  let fetchPromise;
  if (rpcUrl.startsWith("http")) {
    fetchPromise = new Promise((resolve, reject) =>
      fetch(rpcUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          method: "eth_chainId",
          params: [],
          id: 1,
        }),
      })
        .then((res) => {
          if (res.status >= 400) {
            throw new Error(`Request failed with status code ${res.status}`);
          }
          return res.json();
        })
        .then(resolve)
        .catch(reject),
    );
  } else if (rpcUrl.startsWith("ws")) {
    fetchPromise = new Promise((resolve, reject) => {
      const socket = new WebSocket(rpcUrl);
      socket.onopen = () => {
        socket.send(
          JSON.stringify({
            jsonrpc: "2.0",
            method: "eth_chainId",
            params: [],
            id: 1,
          }),
        );
      };
      socket.onmessage = (event) => {
        resolve(JSON.parse(event.data));
        socket.close();
      };
      socket.onerror = (error) => {
        reject(new Error(error.message));
        socket.close();
      };
    });
  } else {
    throw new Error(`Invalid RPC URL: ${rpcUrl}`);
  }

  const returnData = await Promise.race([
    fetchPromise,
    timeout(options.timeout),
  ]);

  if (!returnData.result) {
    throw new Error("Invalid response\n" + JSON.stringify(returnData, null, 2));
  }

  if (!isChainIdEqual(returnData.result, chainId)) {
    throw new InvalidChainIdError(returnData.result, chainId);
  }
}
