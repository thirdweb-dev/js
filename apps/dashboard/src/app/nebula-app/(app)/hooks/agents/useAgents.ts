import { useQuery } from "@tanstack/react-query";
import { getAgents } from "@thirdweb-dev/ai";

export const useAgents = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["getAgents"],
    queryFn: async () => {
      try {
        const { data: agents } = await getAgents();

        return agents || [];
      } catch (error) {
        console.error("[useAgents] Error fetching agents", error);
        return [];
      }
    },
  });

  return {
    agents: data,
    isLoading,
    error,
  };
};
