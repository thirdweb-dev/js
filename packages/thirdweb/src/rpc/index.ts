import type { ThirdwebClient } from "../client/client.js";
import { stringify } from "../utils/json.js";

const RPC_CLIENT_CACHE = /* @__PURE__ */ new Map<string, RPCClient>();

function rpcClientKey(
  client: ThirdwebClient,
  { chainId, ...rest }: RpcClientOptions,
): string {
  return `${chainId}:${client.clientId}:${!!client.secretKey}:${JSON.stringify(
    rest,
  )}`;
}

function rpcRequestKey(request: RPCRequest): string {
  return `${request.method}:${JSON.stringify(request.params)}`;
}

export type RpcClientOptions = {
  chainId: number;
};

export type RPCRequest = { method: string; params: unknown[] };

type SuccessResult<T> = {
  result: T;
  error?: never;
};
type ErrorResult<T> = {
  result?: never;
  error: T;
};

export type RPCResponse<TResult = any, TError = any> =
  | SuccessResult<TResult>
  | ErrorResult<TError>;

const DEFAULT_MAX_BATCH_SIZE = 100;
// default to no timeout (next tick)
const DEFAULT_BATCH_TIMEOUT_MS = 0;

export type RPCClient = (request: RPCRequest) => Promise<RPCResponse["result"]>;

export function getRpcClient(
  client: ThirdwebClient,
  options: RpcClientOptions,
): RPCClient {
  const cacheKey = rpcClientKey(client, options);
  if (RPC_CLIENT_CACHE.has(cacheKey)) {
    return RPC_CLIENT_CACHE.get(cacheKey) as RPCClient;
  }
  const rpcClient: RPCClient = (() => {
    // inflight requests
    const inflightRequests = new Map<string, Promise<RPCResponse>>();
    let pendingBatch: Array<{
      request: RPCRequest & { id: number; jsonrpc: "2.0" };
      resolve: (value: RPCResponse | PromiseLike<RPCResponse>) => void;
      reject: (reason?: any) => void;
      requestKey: string;
    }> = [];
    let pendingBatchTimeout: ReturnType<typeof setTimeout> | null = null;

    function sendPendingBatch() {
      // clear the timeout if any
      if (pendingBatchTimeout) {
        clearTimeout(pendingBatchTimeout);
        pendingBatchTimeout = null;
      }

      // assign ids to each request
      const activeBatch = pendingBatch.slice().map((inflight, index) => {
        // assign the id to the request
        inflight.request.id = index;
        // also assign the jsonrpc version
        inflight.request.jsonrpc = "2.0";
        return inflight;
      });
      // reset pendingBatch to empty
      pendingBatch = [];

      fetchRpc(client, {
        requests: activeBatch.map((inflight) => inflight.request),
        chainId: options.chainId,
      })
        .then((responses) => {
          // for each response, resolve the inflight request
          activeBatch.forEach((inflight, index) => {
            const response = responses[index];
            // if we didn't get a response, reject the inflight request
            if (!response) {
              inflight.reject(new Error("no response"));
              // if we got a response with an error, reject the inflight request
            } else if (response.error) {
              inflight.reject(response.error);
              // otherwise, resolve the inflight request
            } else {
              // TODO: type this properly based on the method
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              inflight.resolve(response.result!);
            }
            // remove the inflight request from the inflightRequests map
            inflightRequests.delete(inflight.requestKey);
          });
        })
        .catch((err) => {
          // http call failed, reject all inflight requests
          activeBatch.forEach((inflight) => {
            inflight.reject(err);
            // remove the inflight request from the inflightRequests map
            inflightRequests.delete(inflight.requestKey);
          });
        });
    }

    return async (request) => {
      const requestKey = rpcRequestKey(request);
      // if the request for this key is already inflight, return the promise directly
      if (inflightRequests.has(requestKey)) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return inflightRequests.get(requestKey)!;
      }
      let resolve: (value: RPCResponse | PromiseLike<RPCResponse>) => void;
      let reject: (reason?: any) => void;
      const promise = new Promise<RPCResponse>((resolve_, reject_) => {
        resolve = resolve_;
        reject = reject_;
      });
      inflightRequests.set(requestKey, promise);
      // @ts-expect-error - they *are* definitely assgined within the promise constructor
      pendingBatch.push({ request, resolve, reject, requestKey });
      // if there is no timeout, set one
      if (!pendingBatchTimeout) {
        pendingBatchTimeout = setTimeout(
          sendPendingBatch,
          DEFAULT_BATCH_TIMEOUT_MS,
        );
      }
      // if the batch is full, send it
      if (pendingBatch.length >= DEFAULT_MAX_BATCH_SIZE) {
        sendPendingBatch();
      }
      return promise;
    };
  })();
  RPC_CLIENT_CACHE.set(cacheKey, rpcClient);
  return rpcClient;
}

type FullRPCRequest = RPCRequest & { id: number; jsonrpc: "2.0" };

type FullRPCResponse = RPCResponse & { id: number; jsonrpc: "2.0" };

type FetchRpcOptions = {
  requests: FullRPCRequest[];
  chainId: number;
};

async function fetchRpc(
  client: ThirdwebClient,
  { requests, chainId }: FetchRpcOptions,
): Promise<FullRPCResponse[]> {
  const headers = new Headers({
    "Content-Type": "application/json",
  });
  if (client.secretKey) {
    headers.set("x-secret-key", client.secretKey);
  }
  const response = await fetch(`https://${chainId}.rpc.thirdweb.com`, {
    headers,
    body: stringify(requests),
    method: "POST",
  });

  if (!response.ok) {
    throw new Error(`RPC request failed with status ${response.status}`);
  }

  let result;

  if (response.headers.get("Content-Type")?.startsWith("application/json")) {
    result = await response.json();
  } else {
    result = await response.text();
  }

  return result;
}
