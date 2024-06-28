import { useLoggedInUser } from "@3rdweb-sdk/react/hooks/useLoggedInUser";
import { useQuery } from "@tanstack/react-query";
import type { Partner } from "../../types";

export function usePartners({ ecosystemId }: { ecosystemId: string }) {
  const { isLoggedIn } = useLoggedInUser();

  const partnersQuery = useQuery({
    queryKey: ["partners", ecosystemId],
    queryFn: async () => {
      // const res = await fetch(
      //   `${process.env.NEXT_PUBLIC_THIRDWEB_IN_APP_WALLET_API_HOST}/v1/ecosystem-wallet/${ecosystemId}/partners`,
      //   {
      //     credentials: "include",
      //   },
      // );

      // if (!res.ok) {
      //   const data = await res.json();
      //   console.error(data);
      //   throw new Error(data?.error?.message ?? "Failed to fetch ecosystems");
      // }

      // return (await res.json()) as { result: Partner[] };
      await new Promise((resolve) => setTimeout(resolve, 3000));
      return {
        result: [
          {
            id: "123",
            name: "Test",
            permissions: "PROMPT_USER_V1",
            allowlistedDomains: ["test.com"],
            allowlistedBundleIds: ["123"],
            createdAt: "2023-05-05T00:00:00.000Z",
            updatedAt: "2023-05-05T00:00:00.000Z",
          } as Partner,
        ],
      };
    },
    enabled: isLoggedIn,
    retry: false,
  });

  return {
    isLoading: isLoggedIn ? partnersQuery.isLoading : false,
    partners: (partnersQuery.data?.result ?? []) satisfies Partner[],
  };
}
