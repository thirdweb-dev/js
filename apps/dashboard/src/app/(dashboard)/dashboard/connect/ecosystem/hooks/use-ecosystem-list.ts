import { useLoggedInUser } from "@3rdweb-sdk/react/hooks/useLoggedInUser";
import { useQuery } from "@tanstack/react-query";
import type { Ecosystem } from "../types";

export function useEcosystemList() {
  const { isLoggedIn, user } = useLoggedInUser();

  const ecosystemQuery = useQuery({
    queryKey: ["ecosystems", user?.address],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_THIRDWEB_API_HOST}/v1/ecosystem-wallet/list`,
        { credentials: "include" },
      );

      if (!res.ok) {
        const data = await res.json();
        console.error(data);
        throw new Error(data?.error?.message ?? "Failed to fetch ecosystems");
      }

      const data = (await res.json()) as { result: Ecosystem[] };
      return data;
    },
    enabled: isLoggedIn,
    retry: false,
  });

  return {
    isLoading: isLoggedIn ? ecosystemQuery.isLoading : false,
    isFetched: isLoggedIn ? ecosystemQuery.isFetched : false,
    ecosystems: (ecosystemQuery.data?.result ?? []) satisfies Ecosystem[],
  };
}
