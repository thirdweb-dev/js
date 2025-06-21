"use server";
import "server-only";

// biome-ignore lint/style/useNodejsImportProtocol: breaks storybook if it's `node:` prefixed
import { randomBytes } from "crypto";
import { format } from "date-fns";
import type { Team } from "@/api/team";
import { getAuthToken } from "../../app/(app)/api/lib/getAuthToken";
import { NEXT_PUBLIC_THIRDWEB_API_HOST } from "../constants/public-envs";

export async function createTeam(options?: { name?: string; slug?: string }) {
  const token = await getAuthToken();

  if (!token) {
    return {
      errorMessage: "You are not authorized to perform this action",
      status: "error",
    } as const;
  }

  const res = await fetch(`${NEXT_PUBLIC_THIRDWEB_API_HOST}/v1/teams`, {
    body: JSON.stringify({
      billingEmail: null,
      image: null,
      name:
        options?.name ?? `Your Projects ${format(new Date(), "MMM d yyyy")}`,
      slug: options?.slug ?? randomBytes(20).toString("hex"),
    }),
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  if (!res.ok) {
    const reason = await res.text();
    console.error("failed to create team", {
      reason,
      status: res.status,
    });
    switch (res.status) {
      case 400: {
        return {
          errorMessage: "Invalid team name or slug.",
          status: "error",
        } as const;
      }
      case 401: {
        return {
          errorMessage: "You are not authorized to perform this action.",
          status: "error",
        } as const;
      }
      default: {
        return {
          errorMessage: "An unknown error occurred.",
          status: "error",
        } as const;
      }
    }
  }

  const json = (await res.json()) as {
    result: Team;
  };

  return {
    data: json.result,
    status: "success",
  } as const;
}
