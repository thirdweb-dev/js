import { useMutation } from "@tanstack/react-query";
import {
  type UpdateAgentTriggerData,
  getNebulaClient,
  updateAgentTrigger,
} from "@thirdweb-dev/ai";

type UseUpdateAgentTriggerProps = {
  authToken: string;
  agentId: string;
  triggerId: string;
};

export const useUpdateAgentTrigger = ({
  authToken,
  agentId,
  triggerId,
}: UseUpdateAgentTriggerProps) => {
  const updateAgentTriggerMutation = useMutation({
    mutationFn: async (trigger: UpdateAgentTriggerData["body"]) => {
      const client = getNebulaClient("http://localhost:4242", {
        authToken: authToken,
      });

      return updateAgentTrigger({
        client,
        path: {
          agent_id: agentId,
          trigger_id: triggerId,
        },
        body: trigger,
      });
    },
  });

  return updateAgentTriggerMutation;
};
