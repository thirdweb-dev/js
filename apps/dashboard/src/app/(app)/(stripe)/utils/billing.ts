import "server-only";
import { NEXT_PUBLIC_THIRDWEB_API_HOST } from "@/constants/public-envs";
import type { ProductSKU } from "@/lib/billing";
import { getAbsoluteUrl } from "../../../../lib/vercel-utils";
import { getAuthToken } from "../../api/lib/getAuthToken";

export async function getBillingCheckoutUrl(options: {
  teamSlug: string;
  sku: Exclude<ProductSKU, null>;
}) {
  const token = await getAuthToken();

  if (!token) {
    return {
      status: "error",
      error: "You are not logged in",
    } as const;
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
    const text = await res.text();
    console.error("Failed to create checkout link", text, res.status);
    switch (res.status) {
      case 402: {
        return {
          status: "error",
          error:
            "You have outstanding invoices, please pay these first before re-subscribing.",
        } as const;
      }
      case 429: {
        return {
          status: "error",
          error: "Too many requests, please try again later.",
        } as const;
      }
      default: {
        return {
          status: "error",
          error: "An unknown error occurred, please try again later.",
        } as const;
      }
    }
  }

  const json = await res.json();
  if (!json.result) {
    return {
      status: "error",
      error: "An unknown error occurred, please try again later.",
    } as const;
  }

  return {
    status: "success",
    data: json.result as string,
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
