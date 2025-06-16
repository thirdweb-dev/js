import { useMutation } from "@tanstack/react-query";
import {
  type CreateConversationMessageData,
  createConversationMessage,
  getNebulaClient,
} from "@thirdweb-dev/ai";

type UseCreateMessageProps = {
  authToken: string;
  conversationId: string;
};

export const useCreateMessage = ({
  authToken,
  conversationId,
}: UseCreateMessageProps) => {
  const createMessageMutation = useMutation({
    mutationFn: async (message: CreateConversationMessageData["body"]) => {
      const client = getNebulaClient("http://localhost:4242", {
        authToken: authToken,
      });

      return createConversationMessage({
        client,
        path: {
          conversation_id: conversationId,
        },
        body: message,
      });
    },
  });

  return createMessageMutation;
};
