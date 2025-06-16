import { useMutation } from "@tanstack/react-query";
import {
  type UpdateConversationData,
  getNebulaClient,
  updateConversation,
} from "@thirdweb-dev/ai";

type UseUpdateConversationProps = {
  authToken: string;
  conversationId: string;
};

export const useUpdateConversation = ({
  authToken,
  conversationId,
}: UseUpdateConversationProps) => {
  const updateConversationMutation = useMutation({
    mutationFn: async (conversation: UpdateConversationData["body"]) => {
      const client = getNebulaClient("http://localhost:4242", {
        authToken: authToken,
      });

      return updateConversation({
        client,
        path: {
          conversation_id: conversationId,
        },
        body: conversation,
      });
    },
  });

  return updateConversationMutation;
};
