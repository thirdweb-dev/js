import { useMutation } from "@tanstack/react-query";
import {
  type CreateAgentToolData,
  createAgentTool,
  getNebulaClient,
} from "@thirdweb-dev/ai";

type UseCreateAgentToolProps = {
  authToken: string;
  agentId: string;
};

export const useCreateAgentTool = ({
  authToken,
  agentId,
}: UseCreateAgentToolProps) => {
  const createAgentToolMutation = useMutation({
    mutationFn: async (tool: CreateAgentToolData["body"]) => {
      const client = getNebulaClient("http://localhost:4242", {
        authToken: authToken,
      });

      return createAgentTool({
        client,
        path: {
          agent_id: agentId,
        },
        body: tool,
      });
    },
  });

  return createAgentToolMutation;
};
