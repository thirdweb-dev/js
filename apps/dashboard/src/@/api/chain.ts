import "server-only";
import { API_SERVER_URL, THIRDWEB_API_SECRET } from "../constants/env";

export async function getGasSponsoredChains() {
  if (!THIRDWEB_API_SECRET) {
    throw new Error("API_SERVER_SECRET is not set");
  }
  const res = await fetch(`${API_SERVER_URL}/v1/chains/gas-sponsored`, {
    headers: {
      "Content-Type": "application/json",
      "x-service-api-key": THIRDWEB_API_SECRET,
    },
    next: {
      revalidate: 15 * 60, //15 minutes
    },
  });

  if (!res.ok) {
    console.error(
      "Failed to fetch gas sponsored chains",
      res.status,
      res.statusText,
    );
    res.body?.cancel();
    return [];
  }

  try {
    return (await res.json()).data as number[];
  } catch (e) {
    console.error("Failed to parse gas sponsored chains", e);
    return [];
  }
}
