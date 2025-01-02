"use server";
import { getAuthToken } from "../../app/api/lib/getAuthToken";
import { API_SERVER_URL } from "../constants/env";

export async function updateAccount(values: {
  name?: string;
  email?: string;
}) {
  const token = await getAuthToken();

  if (!token) {
    throw new Error("No Auth token");
  }

  const res = await fetch(`${API_SERVER_URL}/v1/account`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
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
}
