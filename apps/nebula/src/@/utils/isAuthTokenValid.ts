import { NEXT_PUBLIC_NEBULA_URL } from "@/constants/public-envs";

export async function isNebulaAuthTokenValid(token: string) {
  const res = await fetch(`${NEXT_PUBLIC_NEBULA_URL}/auth/verify`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    method: "GET",
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
