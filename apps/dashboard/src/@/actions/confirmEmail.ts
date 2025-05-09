"use server";

import { getAuthToken } from "../../app/(app)/api/lib/getAuthToken";
import { NEXT_PUBLIC_THIRDWEB_API_HOST } from "../constants/public-envs";

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
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        confirmationToken: otp,
      }),
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
