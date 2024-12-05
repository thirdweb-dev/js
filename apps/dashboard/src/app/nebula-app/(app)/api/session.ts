import { NEXT_PUBLIC_NEBULA_URL } from "@/constants/env";
import { fetchWithAuthToken } from "./fetchWithAuthToken";
import type { ExecuteConfig, SessionInfo, TruncatedSessionInfo } from "./types";

// TODO - get the spec for return types on /session POST and PUT

export async function createSession(params: {
  authToken: string;
  config: ExecuteConfig | null;
}) {
  const res = await fetchWithAuthToken({
    method: "POST",
    endpoint: `${NEXT_PUBLIC_NEBULA_URL}/session`,
    body: {
      can_execute: !!params.config,
      config: params.config,
    },
    authToken: params.authToken,
  });

  if (!res.ok) {
    throw new Error("Failed to create session");
  }
  const data = await res.json();

  // TODO - need better type
  return data.result as {
    id: string;
  };
}

export async function updateSession(params: {
  authToken: string;
  config: ExecuteConfig | null;
  sessionId: string;
}) {
  const res = await fetchWithAuthToken({
    method: "PUT",
    endpoint: `${NEXT_PUBLIC_NEBULA_URL}/session/${params.sessionId}`,
    body: {
      can_execute: !!params.config,
      config: params.config,
    },
    authToken: params.authToken,
  });

  if (!res.ok) {
    throw new Error("Failed to update session");
  }
  const data = await res.json();

  // TODO - need proper types
  return data.result as
    | {
        session_id: string | undefined;
      }
    | undefined;
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

  return data.result as
    | {
        session_id: string | undefined;
      }
    | undefined;
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
