import { useMutation } from "@tanstack/react-query";
import { type CreateAgentData, createAgent } from "@thirdweb-dev/ai";

export const useCreateAgent = () => {
  const createAgentMutation = useMutation({
    mutationFn: async (agent: CreateAgentData["body"]) => {
      return createAgent({
        body: agent,
      });
    },
  });

  return createAgentMutation;
};
