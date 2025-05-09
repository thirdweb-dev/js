"use server";
import "server-only";
import { BASE_URL } from "@/constants/env-utils";
import { NEXT_PUBLIC_THIRDWEB_API_HOST } from "@/constants/public-envs";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { redirect } from "next/navigation";
import { upload } from "thirdweb/storage";
import { getAuthToken } from "../../../../../../../api/lib/getAuthToken";

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
      method: "POST",
      body: JSON.stringify({
        baseUrl: BASE_URL,
        sku: "product:ecosystem_wallets",
        metadata: {
          ...data,
          imageUrl,
          // not something we pass in today during creation, but required to be there
          authOptions: [],
        },
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
