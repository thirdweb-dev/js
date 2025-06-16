import { useMutation } from "@tanstack/react-query";
import {
  type UpdateAgentData,
  getNebulaClient,
  updateAgent,
} from "@thirdweb-dev/ai";

type UseUpdateAgentProps = {
  authToken: string;
  agentId: string;
};

export const useUpdateAgent = ({ authToken, agentId }: UseUpdateAgentProps) => {
  const updateAgentMutation = useMutation({
    mutationFn: async (agent: UpdateAgentData["body"]) => {
      const client = getNebulaClient("http://localhost:4242", {
        authToken: authToken,
      });

      return updateAgent({
        client,
        path: {
          agent_id: agentId,
        },
        body: agent,
      });
    },
  });

  return updateAgentMutation;
};
