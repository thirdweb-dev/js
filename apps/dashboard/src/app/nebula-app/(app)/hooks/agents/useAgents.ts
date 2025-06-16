import { useQuery } from "@tanstack/react-query";
import { getAgents, getNebulaClient } from "@thirdweb-dev/ai";

type UseAgentsProps = {
  authToken: string;
};

export const useAgents = ({ authToken }: UseAgentsProps) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["getAgents"],
    queryFn: async () => {
      try {
        const client = getNebulaClient("http://localhost:4242", {
          authToken: authToken,
        });
        const { data: agents } = await getAgents({
          client,
        });

        return agents?.result || [];
      } catch (error) {
        console.error("[useAgents] Error fetching agents", error);
        return [];
      }
    },
  });

  return {
    agents: data || [],
    isLoading,
    error,
  };
};
