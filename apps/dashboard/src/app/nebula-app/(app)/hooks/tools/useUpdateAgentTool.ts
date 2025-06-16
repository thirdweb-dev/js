import { useMutation } from "@tanstack/react-query";
import {
  type UpdateAgentToolData,
  getNebulaClient,
  updateAgentTool,
} from "@thirdweb-dev/ai";

type UseUpdateAgentToolProps = {
  authToken: string;
  agentId: string;
  toolId: string;
};

export const useUpdateAgentTool = ({
  authToken,
  agentId,
  toolId,
}: UseUpdateAgentToolProps) => {
  const updateAgentToolMutation = useMutation({
    mutationFn: async (tool: UpdateAgentToolData["body"]) => {
      const client = getNebulaClient("http://localhost:4242", {
        authToken: authToken,
      });

      return updateAgentTool({
        client,
        path: {
          agent_id: agentId,
          tool_id: toolId,
        },
        body: tool,
      });
    },
  });

  return updateAgentToolMutation;
};
