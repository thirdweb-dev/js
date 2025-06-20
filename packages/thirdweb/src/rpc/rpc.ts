import type { EIP1193RequestFn, EIP1474Methods } from "viem";
import type { Chain } from "../chains/types.js";
import { getRpcUrlForChain } from "../chains/utils.js";
import type { ThirdwebClient } from "../client/client.js";
import { stringify } from "../utils/json.js";
import { fetchRpc, fetchSingleRpc, type RpcRequest } from "./fetch-rpc.js";

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
  return `${request.method}:${stringify(request.params)}`;
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
  const rpcUrl = options.chain.rpc;

  if (rpcClientMap.has(rpcUrl)) {
    return rpcClientMap.get(rpcUrl) as EIP1193RequestFn<EIP1474Methods>;
  }

  const rpcClient: EIP1193RequestFn<EIP1474Methods> = (() => {
    // we can do this upfront because it cannot change later
    const rpcUrl = getRpcUrlForChain({
      chain: options.chain,
      client: options.client,
    });

    const batchSize =
      // look at the direct options passed
      options.config?.maxBatchSize ??
      // look at the client options
      options.client.config?.rpc?.maxBatchSize ??
      // use defaults
      DEFAULT_MAX_BATCH_SIZE;
    const batchTimeoutMs =
      // look at the direct options passed
      options.config?.batchTimeoutMs ??
      // look at the client options
      options.client.config?.rpc?.batchTimeoutMs ??
      DEFAULT_BATCH_TIMEOUT_MS;

    // inflight requests
    // biome-ignore lint/suspicious/noExplicitAny: TODO: fix any
    const inflightRequests = new Map<string, Promise<any>>();

    let pendingBatch: Array<{
      request: {
        method: string;
        params: unknown[];
        id: number;
        jsonrpc: "2.0";
      };
      // biome-ignore lint/suspicious/noExplicitAny: TODO: fix any
      resolve: (value: any) => void;
      // biome-ignore lint/suspicious/noExplicitAny: TODO: fix any
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

      // prepare the requests array (we know the size)
      const requests = new Array(pendingBatch.length);
      const activeBatch = pendingBatch.slice().map((inflight, index) => {
        // assign the id to the request
        inflight.request.id = index;
        // also assign the jsonrpc version
        inflight.request.jsonrpc = "2.0";
        // assing the request to the requests array (so we don't have to map it again later)
        requests[index] = inflight.request;
        return inflight;
      });
      // reset pendingBatch to empty
      pendingBatch = [];

      fetchRpc(rpcUrl, options.client, {
        requests,
        requestTimeoutMs: options.config?.requestTimeoutMs,
      })
        .then((responses) => {
          activeBatch.forEach((inflight, index) => {
            // Handle the inflight request promise for each response.
            const response = responses[index];

            // No response.
            if (!response) {
              inflight.reject(
                new Error(
                  `RPC Error from ${rpcUrl}:\nrequests: ${stringify(requests)}\nresponses: ${stringify(responses)}`,
                ),
              );
            }
            // Response is an error or error string.
            else if (response instanceof Error) {
              inflight.reject(response);
            } else if ("error" in response) {
              inflight.reject(response.error);
            } else if (typeof response === "string") {
              inflight.reject(new Error(response));
            }
            // eth_subscription is not supported yet.
            else if (response.method === "eth_subscription") {
              inflight.reject("Subscriptions not supported yet");
            }
            // Else return the successful response for the inflight request.
            else {
              inflight.resolve(response.result);
            }
          });
        })
        .catch((err) => {
          // http call failed, reject all inflight requests
          for (const inflight of activeBatch) {
            inflight.reject(err);
          }
        })
        .finally(() => {
          // Clear the inflight requests map so any new requests are re-fetched.
          inflightRequests.clear();
        });
    }

    // shortcut everything if we do not need to batch
    if (batchSize === 1) {
      return async (request) => {
        // we can hard-code the id and jsonrpc version
        // we also mutate the request object here to avoid copying it
        // biome-ignore lint/suspicious/noExplicitAny: TODO: fix any
        (request as any).id = 1;
        // biome-ignore lint/suspicious/noExplicitAny: TODO: fix any
        (request as any).jsonrpc = "2.0";
        const rpcResponse = await fetchSingleRpc(rpcUrl, options.client, {
          request: request,
          requestTimeoutMs: options.config?.requestTimeoutMs,
        });

        if (!rpcResponse) {
          throw new Error("No response");
        }
        if ("error" in rpcResponse) {
          throw rpcResponse.error;
        }
        return rpcResponse.result;
      };
    }

    return async (request) => {
      const requestKey = rpcRequestKey(request);

      // if the request for this key is already inflight, return the promise directly
      if (inflightRequests.has(requestKey)) {
        // biome-ignore lint/style/noNonNullAssertion: the `has` check ensures this is defined
        return inflightRequests.get(requestKey)!;
      }
      // biome-ignore lint/suspicious/noExplicitAny: TODO: fix any
      let resolve: (value: any) => void;
      // biome-ignore lint/suspicious/noExplicitAny: TODO: fix any
      let reject: (reason?: any) => void;
      // biome-ignore lint/suspicious/noExplicitAny: TODO: fix any
      const promise = new Promise<any>((resolve_, reject_) => {
        resolve = resolve_;
        reject = reject_;
      });
      inflightRequests.set(requestKey, promise);
      // @ts-expect-error - they *are* definitely assigned within the promise constructor
      pendingBatch.push({ reject, request, requestKey, resolve });
      if (batchSize > 1) {
        // if there is no timeout, set one
        if (!pendingBatchTimeout) {
          pendingBatchTimeout = setTimeout(sendPendingBatch, batchTimeoutMs);
        }
        // if the batch is full, send it
        if (pendingBatch.length >= batchSize) {
          sendPendingBatch();
        }
      } else {
        sendPendingBatch();
      }
      return promise;
    };
  })();

  rpcClientMap.set(rpcUrl, rpcClient);
  return rpcClient as EIP1193RequestFn<EIP1474Methods>;
}
