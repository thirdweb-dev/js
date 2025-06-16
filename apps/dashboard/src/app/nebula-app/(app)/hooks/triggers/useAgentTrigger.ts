import { useQuery } from "@tanstack/react-query";
import { getAgentTrigger, getNebulaClient } from "@thirdweb-dev/ai";

type UseAgentTriggerProps = {
  authToken: string;
  agentId: string;
  triggerId: string;
};

export const useAgentTrigger = ({
  authToken,
  agentId,
  triggerId,
}: UseAgentTriggerProps) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["agentTrigger", agentId],
    queryFn: async () => {
      const client = getNebulaClient("http://localhost:4242", {
        authToken: authToken,
      });

      const { data: agentTrigger } = await getAgentTrigger({
        client,
        path: {
          agent_id: agentId,
          trigger_id: triggerId,
        },
      });

      return agentTrigger;
    },
  });

  return {
    agentTrigger: data,
    isLoading,
    error,
  };
};
