"use server";
import { getAuthToken } from "@/api/auth-token";
import { NEXT_PUBLIC_THIRDWEB_API_HOST } from "@/constants/public-envs";

export async function updateAccount(values: {
  name?: string;
  email?: string;
  image?: string | null;
}) {
  const token = await getAuthToken();

  if (!token) {
    throw new Error("No Auth token");
  }

  const res = await fetch(`${NEXT_PUBLIC_THIRDWEB_API_HOST}/v1/account`, {
    body: JSON.stringify(values),
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    method: "PUT",
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
}
