"use server";
import "server-only";

import { API_SERVER_URL } from "@/constants/env";
import { getAuthToken } from "../../app/(app)/api/lib/getAuthToken";
import type { ProductSKU } from "../lib/billing";

export type GetBillingCheckoutUrlOptions = {
  teamSlug: string;
  sku: ProductSKU;
  redirectUrl: string;
  metadata?: Record<string, string>;
};

export async function getBillingCheckoutUrl(
  options: GetBillingCheckoutUrlOptions,
): Promise<{ status: number; url?: string }> {
  if (!options.teamSlug) {
    return {
      status: 400,
    };
  }
  const token = await getAuthToken();

  if (!token) {
    return {
      status: 401,
    };
  }

  const res = await fetch(
    `${API_SERVER_URL}/v1/teams/${options.teamSlug}/checkout/create-link`,
    {
      method: "POST",
      body: JSON.stringify({
        sku: options.sku,
        redirectTo: options.redirectUrl,
        metadata: options.metadata || {},
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );
  if (!res.ok) {
    return {
      status: res.status,
    };
  }

  const json = await res.json();
  if (!json.result) {
    return {
      status: 500,
    };
  }

  return {
    status: 200,
    url: json.result as string,
  };
}

export type GetBillingCheckoutUrlAction = typeof getBillingCheckoutUrl;

export async function getPlanCancelUrl(options: {
  teamId: string;
  redirectUrl: string;
}): Promise<{ status: number; url?: string }> {
  const token = await getAuthToken();
  if (!token) {
    return {
      status: 401,
    };
  }

  const res = await fetch(
    `${API_SERVER_URL}/v1/teams/${options.teamId}/checkout/cancel-plan-link`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        redirectTo: options.redirectUrl,
      }),
    },
  );

  if (!res.ok) {
    return {
      status: res.status,
    };
  }

  const json = await res.json();

  if (!json.result) {
    return {
      status: 500,
    };
  }

  return {
    status: 200,
    url: json.result as string,
  };
}

export async function reSubscribePlan(options: {
  teamId: string;
}): Promise<{ status: number }> {
  const token = await getAuthToken();
  if (!token) {
    return {
      status: 401,
    };
  }

  const res = await fetch(
    `${API_SERVER_URL}/v1/teams/${options.teamId}/checkout/resubscribe-plan`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({}),
    },
  );

  if (!res.ok) {
    return {
      status: res.status,
    };
  }

  return {
    status: 200,
  };
}
export type GetBillingPortalUrlOptions = {
  teamSlug: string | undefined;
  redirectUrl: string;
};

export async function getBillingPortalUrl(
  options: GetBillingPortalUrlOptions,
): Promise<{ status: number; url?: string }> {
  if (!options.teamSlug) {
    return {
      status: 400,
    };
  }
  const token = await getAuthToken();
  if (!token) {
    return {
      status: 401,
    };
  }

  const res = await fetch(
    `${API_SERVER_URL}/v1/teams/${options.teamSlug}/checkout/create-session-link`,
    {
      method: "POST",
      body: JSON.stringify({
        redirectTo: options.redirectUrl,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!res.ok) {
    return {
      status: res.status,
    };
  }

  const json = await res.json();

  if (!json.result) {
    return {
      status: 500,
    };
  }

  return {
    status: 200,
    url: json.result as string,
  };
}

export type GetBillingPortalUrlAction = typeof getBillingPortalUrl;
