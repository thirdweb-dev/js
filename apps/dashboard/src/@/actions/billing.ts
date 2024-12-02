"use server";

import "server-only";
import { API_SERVER_URL } from "@/constants/env";
import { redirect } from "next/navigation";
import { getAuthToken } from "../../app/api/lib/getAuthToken";
import type { ProductSKU } from "../lib/billing";

export type RedirectCheckoutOptions = {
  teamSlug: string;
  sku: ProductSKU;
  redirectUrl: string;
  metadata?: Record<string, string>;
};
export async function redirectToCheckout(
  options: RedirectCheckoutOptions,
): Promise<{ status: number }> {
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

  // redirect to the stripe checkout session
  redirect(json.result);
}

export type BillingPortalOptions = {
  teamSlug: string | undefined;
  redirectUrl: string;
};
export async function redirectToBillingPortal(
  options: BillingPortalOptions,
): Promise<{ status: number }> {
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

  // redirect to the stripe billing portal
  redirect(json.result);
}
