import { useQuery } from "@tanstack/react-query";
import type { Ecosystem, Partner } from "@/api/team/ecosystems";
import { fetchPartners } from "../configuration/hooks/fetchPartners";

export function usePartners({
  ecosystem,
  authToken,
  teamId,
}: {
  ecosystem: Ecosystem;
  authToken: string;
  teamId: string;
}) {
  const partnersQuery = useQuery({
    queryFn: async () => {
      return fetchPartners({ authToken, ecosystem, teamId });
    },
    queryKey: ["ecosystem", ecosystem.id, "partners"],
    retry: false,
  });

  return {
    isPending: partnersQuery.isPending,
    partners: (partnersQuery.data ?? []) satisfies Partner[],
  };
}
