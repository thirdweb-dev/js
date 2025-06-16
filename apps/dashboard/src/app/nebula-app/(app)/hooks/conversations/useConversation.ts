import { useQuery } from "@tanstack/react-query";
import { getConversation, getNebulaClient } from "@thirdweb-dev/ai";

type UseConversationProps = {
  authToken: string;
  conversationId: string;
};

export const useConversation = ({
  authToken,
  conversationId,
}: UseConversationProps) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["conversation", conversationId],
    queryFn: async () => {
      const client = getNebulaClient("http://localhost:4242", {
        authToken: authToken,
      });

      const { data: conversation } = await getConversation({
        client,
        path: {
          conversation_id: conversationId,
        },
      });

      return conversation;
    },
  });

  return {
    conversation: data,
    isLoading,
    error,
  };
};
