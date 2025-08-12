"use server";

import { getAuthToken } from "@/api/auth-token";
import { NEXT_PUBLIC_THIRDWEB_API_HOST } from "@/constants/public-envs";

export async function confirmEmailWithOTP(otp: string) {
  const token = await getAuthToken();

  if (!token) {
    return {
      errorMessage: "You are not authorized to perform this action",
    };
  }

  const res = await fetch(
    `${NEXT_PUBLIC_THIRDWEB_API_HOST}/v1/account/confirmEmail`,
    {
      body: JSON.stringify({
        confirmationToken: otp,
      }),
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "PUT",
    },
  );

  if (!res.ok) {
    const json = await res.json();

    if (json.error) {
      return {
        errorMessage: json.error.message,
      };
    }

    return {
      errorMessage: "Failed to confirm email",
    };
  }
}
