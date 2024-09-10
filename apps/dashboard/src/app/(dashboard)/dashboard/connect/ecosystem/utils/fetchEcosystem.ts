import type { Ecosystem } from "../types";

export async function fetchEcosystem(slug: string, authToken: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_THIRDWEB_API_HOST || "https://api.thirdweb.com"}/v1/ecosystem-wallet/${slug}`,
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    },
  );
  if (!res.ok) {
    const data = await res.json();
    console.error(data);
    return null;
  }

  const data = (await res.json()) as { result: Ecosystem };
  return data.result;
}
