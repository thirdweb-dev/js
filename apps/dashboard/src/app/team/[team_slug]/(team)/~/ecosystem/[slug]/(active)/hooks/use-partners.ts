import { useQuery } from "@tanstack/react-query";
import type { Ecosystem, Partner } from "../../../types";
import { fetchPartners } from "../configuration/hooks/fetchPartners";

export function usePartners({
  ecosystem,
  authToken,
}: { ecosystem: Ecosystem; authToken: string }) {
  const partnersQuery = useQuery({
    queryKey: ["ecosystem", ecosystem.id, "partners"],
    queryFn: async () => {
      return fetchPartners({ ecosystem, authToken });
    },
    retry: false,
  });

  return {
    isPending: partnersQuery.isPending,
    partners: (partnersQuery.data ?? []) satisfies Partner[],
  };
}
