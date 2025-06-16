import { useMutation } from "@tanstack/react-query";
import {
  type UpdateConversationMessageData,
  getNebulaClient,
  updateConversationMessage,
} from "@thirdweb-dev/ai";

type UseUpdateMessageProps = {
  authToken: string;
  conversationId: string;
  messageId: string;
};

export const useUpdateMessage = ({
  authToken,
  conversationId,
  messageId,
}: UseUpdateMessageProps) => {
  const updateMessageMutation = useMutation({
    mutationFn: async (message: UpdateConversationMessageData["body"]) => {
      const client = getNebulaClient("http://localhost:4242", {
        authToken: authToken,
      });

      return updateConversationMessage({
        client,
        path: {
          conversation_id: conversationId,
          message_id: messageId,
        },
        body: message,
      });
    },
  });

  return updateMessageMutation;
};
