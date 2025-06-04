import "server-only";
import { NEXT_PUBLIC_THIRDWEB_API_HOST } from "@/constants/public-envs";
import type { ProductSKU } from "@/lib/billing";
import { getAbsoluteUrl } from "../../../../lib/vercel-utils";
import { getAuthToken } from "../../api/lib/getAuthToken";

export async function getBillingCheckoutUrl(options: {
  teamSlug: string;
  sku: Exclude<ProductSKU, null>;
}): Promise<string | undefined> {
  const token = await getAuthToken();

  if (!token) {
    return undefined;
  }

  const res = await fetch(
    `${NEXT_PUBLIC_THIRDWEB_API_HOST}/v1/teams/${options.teamSlug}/checkout/create-link`,
    {
      method: "POST",
      body: JSON.stringify({
        sku: options.sku,
        redirectTo: getAbsoluteStripeRedirectUrl(),
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );
  if (!res.ok) {
    console.error("Failed to create checkout link", await res.json());
    return undefined;
  }

  const json = await res.json();
  if (!json.result) {
    return undefined;
  }

  return json.result as string;
}

export async function getPlanCancelUrl(options: {
  teamId: string;
}): Promise<string | undefined> {
  const token = await getAuthToken();
  if (!token) {
    return undefined;
  }

  const res = await fetch(
    `${NEXT_PUBLIC_THIRDWEB_API_HOST}/v1/teams/${options.teamId}/checkout/cancel-plan-link`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        redirectTo: getAbsoluteStripeRedirectUrl(),
      }),
    },
  );

  if (!res.ok) {
    return undefined;
  }

  const json = await res.json();

  if (!json.result) {
    return undefined;
  }

  return json.result as string;
}

export async function getBillingPortalUrl(options: {
  teamSlug: string;
}): Promise<string | undefined> {
  if (!options.teamSlug) {
    return undefined;
  }
  const token = await getAuthToken();
  if (!token) {
    return undefined;
  }

  const res = await fetch(
    `${NEXT_PUBLIC_THIRDWEB_API_HOST}/v1/teams/${options.teamSlug}/checkout/create-session-link`,
    {
      method: "POST",
      body: JSON.stringify({
        redirectTo: getAbsoluteStripeRedirectUrl(),
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!res.ok) {
    return undefined;
  }

  const json = await res.json();

  if (!json.result) {
    return undefined;
  }

  return json.result as string;
}

function getAbsoluteStripeRedirectUrl() {
  const baseUrl = getAbsoluteUrl();
  const url = new URL(baseUrl);
  url.pathname = "/stripe-redirect";
  return url.toString();
}

export async function getCryptoTopupUrl(options: {
  teamSlug: string;
  amountUSD: number;
}): Promise<string | undefined> {
  const token = await getAuthToken();
  if (!token) {
    return undefined;
  }

  const res = await fetch(
    new URL(
      `/v1/teams/${options.teamSlug}/checkout/crypto-top-up`,
      NEXT_PUBLIC_THIRDWEB_API_HOST,
    ),
    {
      method: "POST",
      body: JSON.stringify({
        amountUSD: options.amountUSD,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!res.ok) {
    return undefined;
  }

  const json = await res.json();

  if (!json.result) {
    return undefined;
  }

  return json.result as string;
}

export async function getInvoicePaymentUrl(options: {
  teamSlug: string;
  invoiceId: string;
}): Promise<string | undefined> {
  const token = await getAuthToken();
  if (!token) {
    return undefined;
  }
  const res = await fetch(
    new URL(
      `/v1/teams/${options.teamSlug}/checkout/crypto-pay-invoice`,
      NEXT_PUBLIC_THIRDWEB_API_HOST,
    ),
    {
      method: "POST",
      body: JSON.stringify({
        invoiceId: options.invoiceId,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!res.ok) {
    return undefined;
  }

  const json = await res.json();

  if (!json.result) {
    return undefined;
  }

  return json.result as string;
}
