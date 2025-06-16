import { useMutation } from "@tanstack/react-query";
import { deleteAgentTool, getNebulaClient } from "@thirdweb-dev/ai";

type UseDeleteAgentToolProps = {
  authToken: string;
  agentId: string;
  toolId: string;
};

export const useDeleteAgentTool = ({
  authToken,
  agentId,
  toolId,
}: UseDeleteAgentToolProps) => {
  const deleteAgentToolMutation = useMutation({
    mutationFn: async () => {
      const client = getNebulaClient("http://localhost:4242", {
        authToken: authToken,
      });

      return deleteAgentTool({
        client,
        path: {
          agent_id: agentId,
          tool_id: toolId,
        },
      });
    },
  });

  return deleteAgentToolMutation;
};
