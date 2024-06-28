import { useLoggedInUser } from "@3rdweb-sdk/react/hooks/useLoggedInUser";
import { useQuery } from "@tanstack/react-query";

export function useEcosystemList() {
  const { isLoggedIn, user } = useLoggedInUser();

  const ecosystemQuery = useQuery({
    queryKey: ["ecosystems", user?.address],
    queryFn: async () => {
      const res = await fetch(
        "https://api.thirdweb-dev.com/v1/ecosystem-wallet/list",
        { credentials: "include" },
      );

      if (!res.ok) {
        throw new Error("Failed to fetch ecosystems");
      }

      return (await res.json()) as {
        result: Array<{
          name: string;
          imageUrl?: string;
          id: string;
          permission: unknown;
          authOptions: unknown;
          url: string;
          createdAt: string;
          updatedAt: string;
        }>;
      };
    },
    enabled: isLoggedIn,
    retry: false,
  });

  return {
    isLoading: isLoggedIn ? ecosystemQuery.isLoading : false,
    ecosystems: ecosystemQuery.data?.result ?? [],
  };
}
