import { useQuery } from "@tanstack/react-query";
import { getAgentTool, getNebulaClient } from "@thirdweb-dev/ai";

type UseAgentToolProps = {
  authToken: string;
  agentId: string;
  toolId: string;
};

export const useAgentTool = ({
  authToken,
  agentId,
  toolId,
}: UseAgentToolProps) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["agentTool", agentId],
    queryFn: async () => {
      const client = getNebulaClient("http://localhost:4242", {
        authToken: authToken,
      });

      const { data: agentTool } = await getAgentTool({
        client,
        path: {
          agent_id: agentId,
          tool_id: toolId,
        },
      });

      return agentTool;
    },
  });

  return {
    agentTool: data,
    isLoading,
    error,
  };
};
