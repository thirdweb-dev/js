import { useQuery } from "@tanstack/react-query";
import type { Ecosystem, Partner } from "../../../types";

export function usePartners({
  ecosystem,
  authToken,
}: { ecosystem: Ecosystem; authToken: string }) {
  const partnersQuery = useQuery({
    queryKey: ["ecosystem", ecosystem.id, "partners"],
    queryFn: async () => {
      const res = await fetch(`${ecosystem.url}/${ecosystem.id}/partners`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!res.ok) {
        const data = await res.json();
        console.error(data);
        throw new Error(
          data?.message ?? data?.error?.message ?? "Failed to fetch ecosystems",
        );
      }

      return (await res.json()) as Partner[];
    },
    retry: false,
  });

  return {
    isPending: partnersQuery.isPending,
    partners: (partnersQuery.data ?? []) satisfies Partner[],
  };
}
