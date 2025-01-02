"use server";

import { getAuthToken } from "../../app/api/lib/getAuthToken";
import { API_SERVER_URL } from "../constants/env";

export async function confirmEmailWithOTP(otp: string) {
  const token = await getAuthToken();

  if (!token) {
    return {
      errorMessage: "You are not authorized to perform this action",
    };
  }

  const res = await fetch(`${API_SERVER_URL}/v1/account/confirmEmail`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      confirmationToken: otp,
    }),
  });

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
