import { NEXT_PUBLIC_NEBULA_URL } from "@/constants/env";

export async function isNebulaAuthTokenValid(token: string) {
  const res = await fetch(`${NEXT_PUBLIC_NEBULA_URL}/auth/verify`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    return false;
  }

  const json = (await res.json()) as {
    result: {
      address: string;
      is_valid: boolean;
    };
  };

  return json.result.is_valid;
}
