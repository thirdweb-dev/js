import "server-only";
import { getAuthToken } from "@/api/auth-token";
import { NEXT_PUBLIC_THIRDWEB_API_HOST } from "@/constants/public-envs";
import type { ProductSKU } from "@/types/billing";
import { getAbsoluteUrl } from "@/utils/vercel";

export async function getBillingCheckoutUrl(options: {
  teamSlug: string;
  sku: Exclude<ProductSKU, null>;
}) {
  const token = await getAuthToken();

  if (!token) {
    return {
      error: "You are not logged in",
      status: "error",
    } as const;
  }

  const res = await fetch(
    `${NEXT_PUBLIC_THIRDWEB_API_HOST}/v1/teams/${options.teamSlug}/checkout/create-link`,
    {
      body: JSON.stringify({
        redirectTo: getAbsoluteStripeRedirectUrl(),
        sku: options.sku,
      }),
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "POST",
    },
  );
  if (!res.ok) {
    const text = await res.text();
    console.error("Failed to create checkout link", text, res.status);
    switch (res.status) {
      case 402: {
        return {
          error:
            "You have outstanding invoices, please pay these first before re-subscribing.",
          status: "error",
        } as const;
      }
      case 429: {
        return {
          error: "Too many requests, please try again later.",
          status: "error",
        } as const;
      }
      default: {
        return {
          error: "An unknown error occurred, please try again later.",
          status: "error",
        } as const;
      }
    }
  }

  const json = await res.json();
  if (!json.result) {
    return {
      error: "An unknown error occurred, please try again later.",
      status: "error",
    } as const;
  }

  return {
    data: json.result as string,
    status: "success",
  } as const;
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
      body: JSON.stringify({
        redirectTo: getAbsoluteStripeRedirectUrl(),
      }),
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "POST",
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
      body: JSON.stringify({
        redirectTo: getAbsoluteStripeRedirectUrl(),
      }),
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "POST",
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
      body: JSON.stringify({
        amountUSD: options.amountUSD,
      }),
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "POST",
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
      body: JSON.stringify({
        invoiceId: options.invoiceId,
      }),
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "POST",
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
