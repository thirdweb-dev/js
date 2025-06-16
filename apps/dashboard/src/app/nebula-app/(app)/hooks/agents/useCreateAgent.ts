import { useMutation } from "@tanstack/react-query";
import {
  type CreateAgentData,
  createAgent,
  getNebulaClient,
} from "@thirdweb-dev/ai";

type UseCreateAgentProps = {
  authToken: string;
};

export const useCreateAgent = ({ authToken }: UseCreateAgentProps) => {
  const createAgentMutation = useMutation({
    mutationFn: async (agent: CreateAgentData["body"]) => {
      const client = getNebulaClient("http://localhost:4242", {
        authToken: authToken,
      });
      return createAgent({
        client,
        body: agent,
      });
    },
  });

  return createAgentMutation;
};
