"use server";
import "server-only";

import { getAuthToken } from "@/api/auth-token";
import { THIRDWEB_INAPP_WALLET_DOMAIN } from "@/constants/urls";

export type RevokeSessionsTarget =
  | { type: "email" | "phone" | "walletAddress" | "userId"; value: string }
  | { type: "allUsers" };

type RevokeSessionsResult =
  | {
      success: true;
      scope: "user" | "project";
      userCount: number;
      tokensInvalidBefore: string;
    }
  | { success: false; error: string };

export async function revokeUserWalletSessions(params: {
  teamId: string;
  clientId: string;
  secretKey: string;
  target: RevokeSessionsTarget;
}): Promise<RevokeSessionsResult> {
  const token = await getAuthToken();
  if (!token) {
    return { error: "Unauthorized", success: false };
  }

  const secretKey = params.secretKey.trim();
  const { target } = params;
  if (!secretKey || (target.type !== "allUsers" && !target.value.trim())) {
    return { error: "Missing required fields", success: false };
  }

  const protocol = THIRDWEB_INAPP_WALLET_DOMAIN.startsWith("localhost")
    ? "http"
    : "https";

  let res: Response;
  try {
    res = await fetch(
      `${protocol}://${THIRDWEB_INAPP_WALLET_DOMAIN}/api/v1/users/revoke-sessions`,
      {
        body: JSON.stringify({
          clientId: params.clientId,
          secretKey,
          ...(target.type === "allUsers"
            ? { allUsers: true }
            : { [target.type]: target.value.trim() }),
        }),
        cache: "no-store",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "x-client-id": params.clientId,
          "x-thirdweb-team-id": params.teamId,
        },
        method: "POST",
      },
    );
  } catch {
    return { error: "Failed to reach the wallet service", success: false };
  }

  const json = (await res.json().catch(() => null)) as {
    message?: string;
    scope?: "user" | "project";
    userIds?: string[];
    tokensInvalidBefore?: string;
  } | null;

  if (!res.ok || !json?.scope || !json.tokensInvalidBefore) {
    return {
      error: json?.message || `Request failed with status ${res.status}`,
      success: false,
    };
  }

  return {
    scope: json.scope,
    success: true,
    tokensInvalidBefore: json.tokensInvalidBefore,
    userCount: json.userIds?.length ?? 0,
  };
}
