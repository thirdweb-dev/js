import { NEXT_PUBLIC_THIRDWEB_API_HOST } from "@/constants/public-envs";
import type { UsageBillableByService } from "@3rdweb-sdk/react/hooks/useApi";
import { getAuthToken } from "../../../../../api/lib/getAuthToken";

export async function getAccountUsage() {
  const token = await getAuthToken();

  if (!token) {
    return undefined;
  }

  const res = await fetch(`${NEXT_PUBLIC_THIRDWEB_API_HOST}/v1/account/usage`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    return undefined;
  }

  const json = await res.json();
  return json.data as UsageBillableByService;
}
