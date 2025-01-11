import { NEXT_PUBLIC_NEBULA_URL } from "@/constants/env";
import { fetchWithAuthToken } from "../../../../utils/fetchWithAuthToken";
import type { ContextFilters } from "./chat";
import type {
  DeletedSessionInfo,
  ExecuteConfig,
  SessionInfo,
  TruncatedSessionInfo,
  UpdatedSessionInfo,
} from "./types";

// TODO - get the spec for return types on /session POST and PUT

export async function createSession(params: {
  authToken: string;
  config: ExecuteConfig | null;
  contextFilters: ContextFilters | undefined;
}) {
  const body: Record<string, string | boolean | object> = {
    can_execute: !!params.config,
  };
  if (params.config) {
    body.execute_config = params.config;
  }

  if (params.contextFilters) {
    body.context_filter = {
      chain_ids: params.contextFilters.chainIds || [],
      contract_addresses: params.contextFilters.contractAddresses || [],
      wallet_addresses: params.contextFilters.walletAddresses || [],
    };
  }

  const res = await fetchWithAuthToken({
    method: "POST",
    endpoint: `${NEXT_PUBLIC_NEBULA_URL}/session`,
    body: body,
    authToken: params.authToken,
  });

  if (!res.ok) {
    throw new Error("Failed to create session");
  }
  const data = await res.json();

  return data.result as SessionInfo;
}

export async function updateSession(params: {
  authToken: string;
  config: ExecuteConfig | null;
  sessionId: string;
  contextFilters: ContextFilters | undefined;
}) {
  const body: Record<string, string | boolean | object> = {
    can_execute: !!params.config,
  };
  if (params.config) {
    body.execute_config = params.config;
  }

  if (params.contextFilters) {
    body.context_filter = {
      chain_ids: params.contextFilters.chainIds || [],
      contract_addresses: params.contextFilters.contractAddresses || [],
      wallet_addresses: params.contextFilters.walletAddresses || [],
    };
  }

  const res = await fetchWithAuthToken({
    method: "PUT",
    endpoint: `${NEXT_PUBLIC_NEBULA_URL}/session/${params.sessionId}`,
    body: body,
    authToken: params.authToken,
  });

  if (!res.ok) {
    throw new Error("Failed to update session");
  }
  const data = await res.json();

  return data.result as UpdatedSessionInfo;
}

export async function deleteSession(params: {
  authToken: string;
  sessionId: string;
}) {
  const res = await fetchWithAuthToken({
    method: "DELETE",
    endpoint: `${NEXT_PUBLIC_NEBULA_URL}/session/${params.sessionId}`,
    authToken: params.authToken,
  });

  if (!res.ok) {
    throw new Error("Failed to update session");
  }
  const data = await res.json();

  return data.result as DeletedSessionInfo;
}

export async function getSessions(params: {
  authToken: string;
}) {
  const res = await fetchWithAuthToken({
    method: "GET",
    endpoint: `${NEXT_PUBLIC_NEBULA_URL}/session/list`,
    authToken: params.authToken,
  });

  if (!res.ok) {
    throw new Error("Failed to update session");
  }
  const data = await res.json();

  return data.result as TruncatedSessionInfo[];
}

export async function getSessionById(params: {
  authToken: string;
  sessionId: string;
}) {
  const res = await fetchWithAuthToken({
    method: "GET",
    endpoint: `${NEXT_PUBLIC_NEBULA_URL}/session/${params.sessionId}`,
    authToken: params.authToken,
  });

  if (!res.ok) {
    throw new Error("Failed to update session");
  }
  const data = await res.json();

  return data.result as SessionInfo;
}
