import type { EIP1193RequestFn, EIP1474Methods } from "viem";
import type { ThirdwebClient } from "../client/client.js";

import type { Chain } from "../chains/types.js";
import { getRpcUrlForChain } from "../chains/utils.js";
import { type RpcRequest, fetchRpc, fetchSingleRpc } from "./fetch-rpc.js";

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

  if (rpcClientMap.has(options.chain.rpc)) {
    return rpcClientMap.get(
      options.chain.rpc,
    ) as EIP1193RequestFn<EIP1474Methods>;
  }

  const rpcClient: EIP1193RequestFn<EIP1474Methods> = (() => {
    // we can do this upfront because it cannot change later
    const rpcUrl = getRpcUrlForChain({
      client: options.client,
      chain: options.chain,
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
          // for each response, resolve the inflight request
          activeBatch.forEach((inflight, index) => {
            const response = responses[index];
            // if we didn't get a response at all, reject the inflight request
            if (!response) {
              inflight.reject(new Error("No response"));
              return;
            }
            // handle errors in the response
            if (response instanceof Error) {
              inflight.reject(response);
              return;
            }

            // handle strings as responses??
            if (typeof response === "string") {
              inflight.reject(new Error(response));
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
          for (const inflight of activeBatch) {
            inflight.reject(err);
            // remove the inflight request from the inflightRequests map
            inflightRequests.delete(inflight.requestKey);
          }
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
      // @ts-expect-error - they *are* definitely assgined within the promise constructor
      pendingBatch.push({ request, resolve, reject, requestKey });
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

  rpcClientMap.set(chainId, rpcClient);
  return rpcClient as EIP1193RequestFn<EIP1474Methods>;
}
