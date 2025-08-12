import type { NebulaContext } from "./chat";
import { fetchWithAuthToken } from "./fetchWithAuthToken";
import type {
  DeletedSessionInfo,
  SessionInfo,
  TruncatedSessionInfo,
  UpdatedSessionInfo,
} from "./types";

const NEBULA_URL = process.env.NEXT_PUBLIC_NEBULA_URL || "https://nebula-api.thirdweb-dev.com";

export async function createSession(params: {
  authToken: string;
  context: NebulaContext | undefined;
}) {
  const body: Record<string, string | boolean | object> = {};

  if (params.context) {
    body.context = {
      chain_ids: params.context.chainIds || [],
      networks: params.context.networks,
      wallet_address: params.context.walletAddress,
    };
  }

  const res = await fetchWithAuthToken({
    authToken: params.authToken,
    body: body,
    endpoint: `${NEBULA_URL}/session`,
    method: "POST",
  });

  if (!res.ok) {
    throw new Error("Failed to create session");
  }
  const data = await res.json();

  return data.result as SessionInfo;
}

export async function updateSession(params: {
  authToken: string;
  sessionId: string;
  contextFilters: NebulaContext | undefined;
}) {
  const body: Record<string, string | boolean | object> = {};

  if (params.contextFilters) {
    body.context = {
      chain_ids: params.contextFilters.chainIds || [],
      networks: params.contextFilters.networks,
      wallet_address: params.contextFilters.walletAddress,
    };
  }

  const res = await fetchWithAuthToken({
    authToken: params.authToken,
    body: body,
    endpoint: `${NEBULA_URL}/session/${params.sessionId}`,
    method: "PUT",
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
    authToken: params.authToken,
    endpoint: `${NEBULA_URL}/session/${params.sessionId}`,
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Failed to update session");
  }
  const data = await res.json();

  return data.result as DeletedSessionInfo;
}

export async function getSessions(params: { authToken: string }) {
  const res = await fetchWithAuthToken({
    authToken: params.authToken,
    endpoint: `${NEBULA_URL}/session/list`,
    method: "GET",
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
    authToken: params.authToken,
    endpoint: `${NEBULA_URL}/session/${params.sessionId}`,
    method: "GET",
  });

  if (!res.ok) {
    throw new Error("Failed to update session");
  }
  const data = await res.json();

  return data.result as SessionInfo;
}