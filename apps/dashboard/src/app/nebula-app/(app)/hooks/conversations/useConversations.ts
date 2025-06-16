import { useQuery } from "@tanstack/react-query";
import { getConversations, getNebulaClient } from "@thirdweb-dev/ai";

type UseConversationsProps = {
  authToken: string;
  agentId: string;
};

export const useConversations = ({
  authToken,
  agentId,
}: UseConversationsProps) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["conversations"],
    queryFn: async () => {
      const client = getNebulaClient("http://localhost:4242", {
        authToken: authToken,
      });

      const { data: conversations } = await getConversations({
        client,
        query: {
          agent_id: agentId,
        },
      });

      return conversations || [];
    },
  });

  return {
    conversations: data,
    isLoading,
    error,
  };
};
