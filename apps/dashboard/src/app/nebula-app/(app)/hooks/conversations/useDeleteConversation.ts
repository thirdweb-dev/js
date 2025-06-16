import { useMutation } from "@tanstack/react-query";
import { deleteConversation, getNebulaClient } from "@thirdweb-dev/ai";

type UseDeleteConversationProps = {
  authToken: string;
  conversationId: string;
};

export const useDeleteConversation = ({
  authToken,
  conversationId,
}: UseDeleteConversationProps) => {
  const deleteConversationMutation = useMutation({
    mutationFn: async () => {
      const client = getNebulaClient("http://localhost:4242", {
        authToken: authToken,
      });

      return deleteConversation({
        client,
        path: {
          conversation_id: conversationId,
        },
      });
    },
  });

  return deleteConversationMutation;
};
