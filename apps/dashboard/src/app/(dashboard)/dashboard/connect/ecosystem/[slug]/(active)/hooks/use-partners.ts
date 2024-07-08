import { useLoggedInUser } from "@3rdweb-sdk/react/hooks/useLoggedInUser";
import { useQuery } from "@tanstack/react-query";
import type { Ecosystem, Partner } from "../../../types";

export function usePartners({ ecosystem }: { ecosystem: Ecosystem }) {
  const { isLoggedIn, user } = useLoggedInUser();

  const partnersQuery = useQuery({
    queryKey: ["ecosystem", ecosystem.id, "partners"],
    queryFn: async () => {
      const res = await fetch(`${ecosystem.url}/${ecosystem.id}/partners`, {
        headers: {
          Authorization: `Bearer ${user?.jwt}`,
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
    enabled: isLoggedIn && !!user?.jwt,
    retry: false,
  });

  return {
    isLoading: isLoggedIn ? partnersQuery.isLoading : false,
    partners: (partnersQuery.data ?? []) satisfies Partner[],
  };
}
