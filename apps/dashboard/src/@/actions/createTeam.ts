"use server";
import "server-only";

// biome-ignore lint/style/useNodejsImportProtocol: breaks storybook if it's `node:` prefixed
import { randomBytes } from "crypto";
import type { Team } from "@/api/team";
import { format } from "date-fns";
import { getAuthToken } from "../../app/(app)/api/lib/getAuthToken";
import { NEXT_PUBLIC_THIRDWEB_API_HOST } from "../constants/public-envs";

export async function createTeam(options?: {
  name?: string;
  slug?: string;
}) {
  const token = await getAuthToken();

  if (!token) {
    return {
      status: "error",
      errorMessage: "You are not authorized to perform this action",
    } as const;
  }

  const res = await fetch(`${NEXT_PUBLIC_THIRDWEB_API_HOST}/v1/teams`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name:
        options?.name ?? `Your Projects ${format(new Date(), "MMM d yyyy")}`,
      slug: options?.slug ?? randomBytes(20).toString("hex"),
      billingEmail: null,
      image: null,
    }),
  });

  if (!res.ok) {
    const reason = await res.text();
    console.error("failed to create team", {
      status: res.status,
      reason,
    });
    switch (res.status) {
      case 400: {
        return {
          status: "error",
          errorMessage: "Invalid team name or slug.",
        } as const;
      }
      case 401: {
        return {
          status: "error",
          errorMessage: "You are not authorized to perform this action.",
        } as const;
      }
      default: {
        return {
          status: "error",
          errorMessage: "An unknown error occurred.",
        } as const;
      }
    }
  }

  const json = (await res.json()) as {
    result: Team;
  };

  return {
    status: "success",
    data: json.result,
  } as const;
}
