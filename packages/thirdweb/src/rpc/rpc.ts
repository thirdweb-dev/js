import type { EIP1193RequestFn, EIP1474Methods } from "viem";
import {
  getRequestTimeoutConfig,
  type ThirdwebClient,
} from "../client/client.js";
import { getClientFetch } from "../utils/fetch.js";
import { stringify } from "../utils/json.js";
import { getRpcUrlForChain } from "../chains/utils.js";
import type { Chain } from "../chains/types.js";

type SuccessResult<T> = {
  method?: never;
  result: T;
  error?: never;
};
type ErrorResult<T> = {
  method?: never;
  result?: never;
  error: T;
};
type Subscription<TResult, TError> = {
  method: "eth_subscription";
  error?: never;
  result?: never;
  params: {
    subscription: string;
  } & (
    | {
        result: TResult;
        error?: never;
      }
    | {
        result?: never;
        error: TError;
      }
  );
};

type RpcRequest = {
  jsonrpc?: "2.0";
  method: string;
  params?: any;
  id?: number;
};

type RpcResponse<TResult = any, TError = any> = {
  jsonrpc: `${number}`;
  id: number;
} & (
  | SuccessResult<TResult>
  | ErrorResult<TError>
  | Subscription<TResult, TError>
);

const RPC_CLIENT_MAP = new WeakMap();

/**
 * @internal
 */
function getRpcClientMap(client: ThirdwebClient) {
  if (RPC_CLIENT_MAP.has(client)) {
    return RPC_CLIENT_MAP.get(client);
  }
  const rpcClientMap = new Map();
  RPC_CLIENT_MAP.set(client, rpcClientMap);
  return rpcClientMap;
}

/**
 * @internal
 */
function rpcRequestKey(request: RpcRequest): string {
  return `${request.method}:${JSON.stringify(request.params)}`;
}

const DEFAULT_MAX_BATCH_SIZE = 100;
// default to no timeout (next tick)
const DEFAULT_BATCH_TIMEOUT_MS = 0;

type RPCOptions = Readonly<{
  client: ThirdwebClient;
  chain: Chain;
  config?: {
    maxBatchSize?: number;
    batchTimeoutMs?: number;
    requestTimeoutMs?: number;
  };
}>;

/**
 * Returns an RPC request that can be used to make JSON-RPC requests.
 * @param options - The RPC options.
 * @returns The RPC request function.
 * @rpc
 * @example
 * ```ts
 * import { createThirdwebClient } from "thirdweb";
 * import { getRpcClient } from "thirdweb/rpc";
 * import { ethereum } from "thirdweb/chains";
 * const client = createThirdwebClient({ clientId: "..." });
 * const rpcRequest = getRpcClient({ client, chain: ethereum, });
 * const blockNumber = await rpcRequest({
 *  method: "eth_blockNumber",
 * });
 * ```
 */
export function getRpcClient(
  options: RPCOptions,
): EIP1193RequestFn<EIP1474Methods> {
  const rpcClientMap = getRpcClientMap(options.client);
  const chainId = options.chain.id;
  if (rpcClientMap.has(chainId)) {
    return rpcClientMap.get(chainId) as EIP1193RequestFn<EIP1474Methods>;
  }

  const rpcClient: EIP1193RequestFn<EIP1474Methods> = (function () {
    const batchSize = options.config?.maxBatchSize ?? DEFAULT_MAX_BATCH_SIZE;
    const batchTimeoutMs =
      options.config?.batchTimeoutMs ?? DEFAULT_BATCH_TIMEOUT_MS;
    // inflight requests
    const inflightRequests = new Map<string, Promise<any>>();
    let pendingBatch: Array<{
      request: {
        method: string;
        params: unknown[];
        id: number;
        jsonrpc: "2.0";
      };
      resolve: (value: any) => void;
      reject: (reason?: any) => void;
      requestKey: string;
    }> = [];
    let pendingBatchTimeout: ReturnType<typeof setTimeout> | null = null;

    /**
     * Sends the pending batch of requests.
     * @internal
     */
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

      fetchRpc(options.client, {
        requests: activeBatch.map((inflight) => inflight.request),
        chain: options.chain,
        requestTimeoutMs: options.config?.requestTimeoutMs,
      })
        .then((responses) => {
          // for each response, resolve the inflight request
          activeBatch.forEach((inflight, index) => {
            const response = responses[index];
            // if we didn't get a response at all, reject the inflight request
            if (!response) {
              inflight.reject(new Error("No response"));
              return;
            }

            if ("error" in response) {
              inflight.reject(response.error);
              // otherwise, resolve the inflight request
            } else if (response.method === "eth_subscription") {
              // TODO: handle subscription responses
              throw new Error("Subscriptions not supported yet");
            } else {
              inflight.resolve(response.result);
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

    return async function (request) {
      const requestKey = rpcRequestKey(request);
      // if the request for this key is already inflight, return the promise directly
      if (inflightRequests.has(requestKey)) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return inflightRequests.get(requestKey)!;
      }
      let resolve: (value: any) => void;
      let reject: (reason?: any) => void;
      const promise = new Promise<any>((resolve_, reject_) => {
        resolve = resolve_;
        reject = reject_;
      });
      inflightRequests.set(requestKey, promise);
      // @ts-expect-error - they *are* definitely assgined within the promise constructor
      pendingBatch.push({ request, resolve, reject, requestKey });
      // if there is no timeout, set one
      if (!pendingBatchTimeout) {
        pendingBatchTimeout = setTimeout(sendPendingBatch, batchTimeoutMs);
      }
      // if the batch is full, send it
      if (pendingBatch.length >= batchSize) {
        sendPendingBatch();
      }
      return promise;
    };
  })();

  rpcClientMap.set(chainId, rpcClient);
  return rpcClient as EIP1193RequestFn<EIP1474Methods>;
}

type FetchRpcOptions = {
  requests: RpcRequest[];
  chain: Chain;
  requestTimeoutMs?: number;
};

/**
 * @internal
 */
async function fetchRpc(
  client: ThirdwebClient,
  options: FetchRpcOptions,
): Promise<RpcResponse[]> {
  const rpcUrl = getRpcUrlForChain({ client, chain: options.chain });
  const requestTimeoutMs = getRequestTimeoutConfig(
    client,
    "storage",
    options.requestTimeoutMs,
  );

  const response = await getClientFetch(client)(rpcUrl, {
    headers: { "Content-Type": "application/json" },
    body: stringify(options.requests),
    method: "POST",
    requestTimeoutMs,
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
