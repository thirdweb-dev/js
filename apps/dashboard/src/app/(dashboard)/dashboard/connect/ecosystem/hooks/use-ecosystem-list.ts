import { useLoggedInUser } from "@3rdweb-sdk/react/hooks/useLoggedInUser";
import { useQuery } from "@tanstack/react-query";
import { THIRDWEB_API_HOST } from "../../../../../../constants/urls";
import type { Ecosystem } from "../types";

export function useEcosystemList() {
  const { isLoggedIn, user } = useLoggedInUser();

  const ecosystemQuery = useQuery({
    queryKey: ["ecosystems", user?.address],
    queryFn: async () => {
      const res = await fetch(`${THIRDWEB_API_HOST}/v1/ecosystem-wallet/list`);

      if (!res.ok) {
        const data = await res.json();
        console.error(data);
        throw new Error(data?.error?.message ?? "Failed to fetch ecosystems");
      }

      const data = (await res.json()) as { result: Ecosystem[] };
      return data.result;
    },
    enabled: isLoggedIn,
    retry: false,
  });

  return {
    ...ecosystemQuery,
    isLoading: isLoggedIn ? ecosystemQuery.isLoading : false,
    ecosystems: (ecosystemQuery.data ?? []) satisfies Ecosystem[],
  };
}
