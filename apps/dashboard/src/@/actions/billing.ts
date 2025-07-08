"use server";
import "server-only";

import { getAuthToken } from "@/api/auth-token";
import { NEXT_PUBLIC_THIRDWEB_API_HOST } from "@/constants/public-envs";
import type { ChainInfraSKU } from "@/types/billing";
import { getAbsoluteUrl } from "@/utils/vercel";

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
    new URL(
      `/v1/teams/${options.teamId}/checkout/resubscribe-plan`,
      NEXT_PUBLIC_THIRDWEB_API_HOST,
    ),
    {
      body: JSON.stringify({}),
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "PUT",
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

export async function getChainInfraCheckoutURL(options: {
  teamSlug: string;
  skus: ChainInfraSKU[];
  chainId: number;
  annual: boolean;
}) {
  const token = await getAuthToken();

  if (!token) {
    return {
      error: "You are not logged in",
      status: "error",
    } as const;
  }

  const res = await fetch(
    new URL(
      `/v1/teams/${options.teamSlug}/checkout/create-link`,
      NEXT_PUBLIC_THIRDWEB_API_HOST,
    ),
    {
      body: JSON.stringify({
        annual: options.annual,
        baseUrl: getAbsoluteUrl(),
        chainId: options.chainId,
        skus: options.skus,
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
      case 403: {
        return {
          error: "You are not authorized to deploy infrastructure.",
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
