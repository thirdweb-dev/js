import { useMutation } from "@tanstack/react-query";
import { deleteAgentTrigger, getNebulaClient } from "@thirdweb-dev/ai";

type UseDeleteAgentTriggerProps = {
  authToken: string;
  agentId: string;
  triggerId: string;
};

export const useDeleteAgentTrigger = ({
  authToken,
  agentId,
  triggerId,
}: UseDeleteAgentTriggerProps) => {
  const deleteAgentTriggerMutation = useMutation({
    mutationFn: async () => {
      const client = getNebulaClient("http://localhost:4242", {
        authToken: authToken,
      });

      return deleteAgentTrigger({
        client,
        path: {
          agent_id: agentId,
          trigger_id: triggerId,
        },
      });
    },
  });

  return deleteAgentTriggerMutation;
};
