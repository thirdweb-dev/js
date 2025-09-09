"use server";

import type { Project } from "@/api/project/projects";
import { NEXT_PUBLIC_THIRDWEB_AI_HOST } from "@/constants/public-envs";
import { fetchWithAuthToken } from "./fetchWithAuthToken";
import type {
  DeletedSessionInfo,
  NebulaContext,
  SessionInfo,
  TruncatedSessionInfo,
  UpdatedSessionInfo,
} from "./types";

export async function createSession(params: {
  project: Project;
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
    project: params.project,
    body: body,
    endpoint: `${NEXT_PUBLIC_THIRDWEB_AI_HOST}/session`,
    method: "POST",
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Failed to create session: ${error}`);
  }
  const data = await res.json();

  return data.result as SessionInfo;
}

export async function updateSession(params: {
  project: Project;
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
    body: body,
    endpoint: `${NEXT_PUBLIC_THIRDWEB_AI_HOST}/session/${params.sessionId}`,
    method: "PUT",
    project: params.project,
  });

  if (!res.ok) {
    throw new Error("Failed to update session");
  }
  const data = await res.json();

  return data.result as UpdatedSessionInfo;
}

export async function deleteSession(params: {
  project: Project;
  sessionId: string;
}) {
  const res = await fetchWithAuthToken({
    endpoint: `${NEXT_PUBLIC_THIRDWEB_AI_HOST}/session/${params.sessionId}`,
    method: "DELETE",
    project: params.project,
  });

  if (!res.ok) {
    throw new Error("Failed to update session");
  }
  const data = await res.json();

  return data.result as DeletedSessionInfo;
}

export async function getSessions(params: { project: Project }) {
  const res = await fetchWithAuthToken({
    endpoint: `${NEXT_PUBLIC_THIRDWEB_AI_HOST}/session/list`,
    method: "GET",
    project: params.project,
  });

  if (!res.ok) {
    throw new Error("Failed to update session");
  }
  const data = await res.json();

  return data.result as TruncatedSessionInfo[];
}

export async function getSessionById(params: {
  project: Project;
  sessionId: string;
}) {
  const res = await fetchWithAuthToken({
    endpoint: `${NEXT_PUBLIC_THIRDWEB_AI_HOST}/session/${params.sessionId}`,
    method: "GET",
    project: params.project,
  });

  if (!res.ok) {
    throw new Error("Failed to update session");
  }
  const data = await res.json();

  return data.result as SessionInfo;
}
