"use server";
import "server-only";

import { getAuthToken } from "@/api/auth-token";
import {
  THIRDWEB_API_HOST,
  THIRDWEB_INAPP_WALLET_DOMAIN,
} from "@/constants/urls";

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

const SECRET_KEY_HASH_PATTERN = /^[0-9a-f]{64}$/;

function inAppWalletHost() {
  if (process.env.NEXT_PUBLIC_IN_APP_WALLET_URL) {
    return THIRDWEB_INAPP_WALLET_DOMAIN;
  }
  let apiHost = "";
  try {
    apiHost = new URL(THIRDWEB_API_HOST).host;
  } catch {}
  return apiHost === "api.thirdweb.com"
    ? "embedded-wallet.thirdweb.com"
    : THIRDWEB_INAPP_WALLET_DOMAIN;
}

export async function revokeUserWalletSessions(params: {
  teamId: string;
  clientId: string;
  secretKeyHash: string;
  target: RevokeSessionsTarget;
}): Promise<RevokeSessionsResult> {
  const token = await getAuthToken();
  if (!token) {
    return { error: "Unauthorized", success: false };
  }

  const { secretKeyHash, target } = params;
  if (
    !SECRET_KEY_HASH_PATTERN.test(secretKeyHash) ||
    (target.type !== "allUsers" && !target.value.trim())
  ) {
    return { error: "Missing required fields", success: false };
  }

  const host = inAppWalletHost();
  const protocol = host.startsWith("localhost") ? "http" : "https";

  let res: Response;
  try {
    res = await fetch(`${protocol}://${host}/api/v1/users/revoke-sessions`, {
      body: JSON.stringify({
        clientId: params.clientId,
        secretKeyHash,
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
    });
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
