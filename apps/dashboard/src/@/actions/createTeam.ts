"use server";

import { randomBytes } from "node:crypto";
import type { Team } from "@/api/team";
import { format } from "date-fns";
import { getAuthToken } from "../../app/(app)/api/lib/getAuthToken";
import { NEXT_PUBLIC_THIRDWEB_API_HOST } from "../constants/public-envs";

export async function createTeam(options: {
  name?: string;
  slug?: string;
}): Promise<
  | {
      ok: true;
      data: Team;
    }
  | {
      ok: false;
      errorMessage: string;
    }
> {
  const token = await getAuthToken();

  if (!token) {
    return {
      ok: false,
      errorMessage: "You are not authorized to perform this action",
    };
  }

  const res = await fetch(`${NEXT_PUBLIC_THIRDWEB_API_HOST}/v1/teams`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: options.name ?? `Your Projects ${format(new Date(), "MMM d yyyy")}`,
      slug: options.slug ?? randomBytes(20).toString("hex"),
      billingEmail: null,
      image: null,
    }),
  });

  if (!res.ok) {
    return {
      ok: false,
      errorMessage: await res.text(),
    };
  }

  const json = await res.json();

  return {
    ok: true,
    data: json.result,
  };
}
