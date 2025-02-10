import { NEXT_PUBLIC_NEBULA_URL } from "@/constants/env";
import { fetchWithAuthToken } from "../../../../utils/fetchWithAuthToken";
import type { NebulaContext } from "./chat";
import type {
  DeletedSessionInfo,
  SessionInfo,
  TruncatedSessionInfo,
  UpdatedSessionInfo,
} from "./types";

export async function createSession(params: {
  authToken: string;
  context: NebulaContext | undefined;
}) {
  const body: Record<string, string | boolean | object> = {};

  if (params.context) {
    body.context = {
      chain_ids: params.context.chainIds || [],
      wallet_address: params.context.walletAddress,
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
  sessionId: string;
  contextFilters: NebulaContext | undefined;
}) {
  const body: Record<string, string | boolean | object> = {};

  if (params.contextFilters) {
    body.context = {
      chain_ids: params.contextFilters.chainIds || [],
      wallet_address: params.contextFilters.walletAddress,
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
