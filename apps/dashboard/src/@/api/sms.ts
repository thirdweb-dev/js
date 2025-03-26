import { API_SERVER_URL, THIRDWEB_API_SECRET } from "../constants/env";

export type SMSCountryTiers = {
  tier1: string[];
  tier2: string[];
  tier3: string[];
  tier4: string[];
  tier5: string[];
};

export async function getSMSCountryTiers() {
  if (!THIRDWEB_API_SECRET) {
    throw new Error("API_SERVER_SECRET is not set");
  }
  const res = await fetch(`${API_SERVER_URL}/v1/sms/list-country-tiers`, {
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
      "Failed to fetch sms country tiers",
      res.status,
      res.statusText,
    );
    res.body?.cancel();
    return {
      tier1: [],
      tier2: [],
      tier3: [],
      tier4: [],
      tier5: [],
    };
  }

  try {
    return (await res.json()).data as SMSCountryTiers;
  } catch (e) {
    console.error("Failed to parse sms country tiers", e);
    return {
      tier1: [],
      tier2: [],
      tier3: [],
      tier4: [],
      tier5: [],
    };
  }
}
