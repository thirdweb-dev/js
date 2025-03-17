import type { Ecosystem, Partner } from "../../../../types";

/**
 * Fetches partners for an ecosystem
 */
export async function fetchPartners({
  ecosystem,
  authToken,
}: {
  ecosystem: Ecosystem;
  authToken: string;
}): Promise<Partner[]> {
  const res = await fetch(`${ecosystem.url}/${ecosystem.id}/partners`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
    next: {
      revalidate: 0,
    },
  });

  if (!res.ok) {
    const data = await res.json();
    console.error(data);
    throw new Error(
      data?.message ?? data?.error?.message ?? "Failed to fetch partners",
    );
  }

  const partners = (await res.json()) as Partner[];
  return partners.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}
