"use server";
import "server-only";
import { redirect } from "next/navigation";
import { upload } from "thirdweb/storage";
import { BASE_URL } from "@/constants/env-utils";
import { NEXT_PUBLIC_THIRDWEB_API_HOST } from "@/constants/public-envs";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { getAuthToken } from "../../../../../../../../../@/api/auth-token";

export async function createEcosystem(options: {
  teamSlug: string;
  teamId: string;
  name: string;
  logo: File;
  permission: "PARTNER_WHITELIST" | "ANYONE";
}) {
  const token = await getAuthToken();
  if (!token) {
    return {
      status: 401,
    };
  }

  const { teamSlug, teamId, logo, ...data } = options;

  const imageUrl = await upload({
    client: getClientThirdwebClient({
      jwt: token,
      teamId: teamId,
    }),
    files: [logo],
  });

  const res = await fetch(
    `${NEXT_PUBLIC_THIRDWEB_API_HOST}/v1/teams/${teamSlug}/checkout/create-link`,
    {
      body: JSON.stringify({
        baseUrl: BASE_URL,
        metadata: {
          ...data,
          // not something we pass in today during creation, but required to be there
          authOptions: [],
          imageUrl,
        },
        sku: "product:ecosystem_wallets",
      }),
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "POST",
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
