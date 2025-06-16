import { useMutation } from "@tanstack/react-query";
import { deleteAgent, getNebulaClient } from "@thirdweb-dev/ai";

type UseDeleteAgentProps = {
  authToken: string;
  agentId: string;
};

export const useDeleteAgent = ({ authToken, agentId }: UseDeleteAgentProps) => {
  const deleteAgentMutation = useMutation({
    mutationFn: async () => {
      const client = getNebulaClient("http://localhost:4242", {
        authToken: authToken,
      });

      return deleteAgent({
        client,
        path: {
          agent_id: agentId,
        },
      });
    },
  });

  return deleteAgentMutation;
};
