import { useQuery } from "@tanstack/react-query";
import { getAgent, getNebulaClient } from "@thirdweb-dev/ai";

type UseAgentProps = {
  authToken: string;
  agentId: string;
};

export const useAgent = ({ authToken, agentId }: UseAgentProps) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["agent", agentId],
    queryFn: async () => {
      const client = getNebulaClient("http://localhost:4242", {
        authToken: authToken,
      });
      const { data: agent } = await getAgent({
        client,
        path: {
          agent_id: agentId,
        },
      });

      return agent?.result;
    },
  });

  return {
    agent: data,
    isLoading,
    error,
  };
};
