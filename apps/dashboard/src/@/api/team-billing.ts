import "server-only";
import { API_SERVER_URL, getAbsoluteUrlFromPath } from "@/constants/env";
import { getAuthToken } from "../../app/api/lib/getAuthToken";

export async function getStripeCheckoutLink(slug: string, sku: string) {
  const token = await getAuthToken();

  if (!token) {
    return {
      status: 401,
      link: null,
    };
  }

  const res = await fetch(
    `${API_SERVER_URL}/v1/teams/${slug}/checkout/create-link`,
    {
      method: "POST",
      body: JSON.stringify({
        sku: decodeURIComponent(sku),
        redirectTo: getAbsoluteUrlFromPath(
          `/team/${slug}/~/settings/billing`,
        ).toString(),
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );
  if (res.ok) {
    return {
      status: 200,
      link: (await res.json())?.result as string,
    } as const;
  }
  return {
    status: res.status,
    link: null,
  } as const;
}
