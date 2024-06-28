import { useLoggedInUser } from "@3rdweb-sdk/react/hooks/useLoggedInUser";
import {
  type UseMutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import type { Partner } from "../../types";

export type AddPartnerParams = {
  ecosystemId: string;
  name: string;
  allowlistedDomains: string[];
  allowlistedBundleIds: string[];
  permissions: "PROMPT_USER_V1" | "FULL_CONTROL_V1";
};

export function useAddPartner(
  options?: Omit<
    UseMutationOptions<Partner, unknown, AddPartnerParams>,
    "mutationFn"
  >,
) {
  const { isLoggedIn } = useLoggedInUser();
  const queryClient = useQueryClient();

  const { mutateAsync: addPartner, isLoading } = useMutation({
    // Returns the created partner object
    mutationFn: async (params: AddPartnerParams): Promise<Partner> => {
      if (!isLoggedIn) {
        throw new Error("Please login to add a partner");
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));

      // const res = await fetch(
      //   `${process.env.NEXT_PUBLIC_THIRDWEB_IN_APP_WALLET_API_HOST}/v1/ecosystem-wallet/${params.ecosystemId}/partner`,
      //   {
      //     method: "POST",
      //     credentials: "include",
      //     headers: { "Content-Type": "application/json" },
      //     body: JSON.stringify({
      //       name: params.name,
      //       allowlistedDomains: params.allowlistedDomains,
      //       allowlistedBundleIds: params.allowlistedBundleIds,
      //       permissions: params.permissions,
      //     }),
      //   },
      // );

      // if (!res.ok) {
      //   const body = await res.json();
      //   console.error(body);
      //   if (res.status === 401) {
      //     throw new Error(
      //       "You're not authorized to add a partner to this ecosystem",
      //     );
      //   }
      //   if (res.status === 406) {
      //     throw new Error(
      //       "Please setup billing on your account to continue managing this ecosystem",
      //     );
      //   }
      //   throw new Error("Failed to add ecosystem partner");
      // }

      // const data = await res.json();

      // return data;
      return {
        id: "123",
        name: "Test",
        permissions: "PROMPT_USER_V1",
        allowlistedDomains: ["test.com"],
        allowlistedBundleIds: ["123"],
        createdAt: "2023-05-05T00:00:00.000Z",
        updatedAt: "2023-05-05T00:00:00.000Z",
      } as Partner;
    },
    onSuccess: (partner, variables, context) => {
      return Promise.all([
        options?.onSuccess?.(partner, variables, context),
        queryClient.invalidateQueries(["partners", variables.ecosystemId]),
      ]);
    },
    ...options,
  });

  return { addPartner, isLoading };
}
