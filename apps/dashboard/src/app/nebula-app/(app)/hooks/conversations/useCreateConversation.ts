import { useMutation } from "@tanstack/react-query";
import {
  type CreateConversationData,
  createConversation,
  getNebulaClient,
} from "@thirdweb-dev/ai";

type UseCreateConversationProps = {
  authToken: string;
};

export const useCreateConversation = ({
  authToken,
}: UseCreateConversationProps) => {
  const createConversationMutation = useMutation({
    mutationFn: async (conversation: CreateConversationData["body"]) => {
      const client = getNebulaClient("http://localhost:4242", {
        authToken: authToken,
      });

      return createConversation({
        client,
        body: conversation,
      });
    },
  });

  return createConversationMutation;
};
