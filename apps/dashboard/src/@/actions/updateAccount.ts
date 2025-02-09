"use server";
import { revalidateTag } from "next/cache";
import { getAuthToken } from "../../app/api/lib/getAuthToken";
import { accountCacheTag } from "../constants/cacheTags";
import { API_SERVER_URL } from "../constants/env";

export async function updateAccount(values: {
  name?: string;
  email?: string;
  image?: string | null;
}) {
  const authToken = await getAuthToken();

  if (!authToken) {
    throw new Error("No Auth token");
  }

  const res = await fetch(`${API_SERVER_URL}/v1/account`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify(values),
  });

  if (!res.ok) {
    const json = await res.json();

    if (json.error) {
      return {
        errorMessage: json.error.message,
      };
    }

    return {
      errorMessage: "Failed To Update Account",
    };
  }

  revalidateTag(accountCacheTag(authToken));
}
