import type { ThirdwebClient } from "../client/client.js";
import { getClientFetch } from "../utils/fetch.js";
import { stringify } from "../utils/json.js";

export type RpcRequest = {
  jsonrpc?: "2.0";
  method: string;
  params?: unknown;
  id?: number;
};

type FetchRpcOptions = {
  requests: RpcRequest[];
  requestTimeoutMs?: number;
};

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

type RpcResponse<TResult = unknown, TError = unknown> = {
  jsonrpc: `${number}`;
  id: number;
} & (
  | SuccessResult<TResult>
  | ErrorResult<TError>
  | Subscription<TResult, TError>
);

/**
 * @internal
 */
export async function fetchRpc(
  rpcUrl: string,
  client: ThirdwebClient,
  options: FetchRpcOptions,
): Promise<RpcResponse[]> {
  const response = await getClientFetch(client)(rpcUrl, {
    body: stringify(options.requests),
    headers: {
      ...client.config?.rpc?.fetch?.headers,
      "Content-Type": "application/json",
    },
    keepalive: client.config?.rpc?.fetch?.keepalive,
    method: "POST",
    requestTimeoutMs:
      options.requestTimeoutMs ?? client.config?.rpc?.fetch?.requestTimeoutMs,
  });

  if (!response.ok) {
    const error = await response.text().catch(() => null);
    throw new Error(
      `RPC request failed with status ${response.status} - ${response.statusText}: ${error || "unknown error"}`,
    );
  }

  return await response.json();
}

type FetchSingleRpcOptions = {
  request: RpcRequest;
  requestTimeoutMs?: number;
};

/**
 * @internal
 */
export async function fetchSingleRpc(
  rpcUrl: string,
  client: ThirdwebClient,
  options: FetchSingleRpcOptions,
): Promise<RpcResponse> {
  const response = await getClientFetch(client)(rpcUrl, {
    body: stringify(options.request),
    headers: {
      ...(client.config?.rpc?.fetch?.headers || {}),
      "Content-Type": "application/json",
    },
    keepalive: client.config?.rpc?.fetch?.keepalive,
    method: "POST",
    requestTimeoutMs:
      options.requestTimeoutMs ?? client.config?.rpc?.fetch?.requestTimeoutMs,
  });

  if (!response.ok) {
    const error = await response.text().catch(() => null);
    throw new Error(
      `RPC request failed with status ${response.status} - ${response.statusText}: ${error || "unknown error"}`,
    );
  }
  return await response.json();
}
