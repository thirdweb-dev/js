import { useMutation } from "@tanstack/react-query";
import {
  type CreateAgentTriggerData,
  createAgentTrigger,
  getNebulaClient,
} from "@thirdweb-dev/ai";

type UseCreateAgentTriggerProps = {
  authToken: string;
  agentId: string;
};

export const useCreateAgentTrigger = ({
  authToken,
  agentId,
}: UseCreateAgentTriggerProps) => {
  const createAgentTriggerMutation = useMutation({
    mutationFn: async (trigger: CreateAgentTriggerData["body"]) => {
      const client = getNebulaClient("http://localhost:4242", {
        authToken: authToken,
      });

      return createAgentTrigger({
        client,
        path: {
          agent_id: agentId,
        },
        body: trigger,
      });
    },
  });

  return createAgentTriggerMutation;
};
