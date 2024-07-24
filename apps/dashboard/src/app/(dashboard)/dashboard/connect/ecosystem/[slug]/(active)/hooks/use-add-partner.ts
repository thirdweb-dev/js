import { useLoggedInUser } from "@3rdweb-sdk/react/hooks/useLoggedInUser";
import {
  type UseMutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import type { Ecosystem, Partner } from "../../../types";

export type AddPartnerParams = {
  ecosystem: Ecosystem;
  name: string;
  allowlistedDomains: string[];
  allowlistedBundleIds: string[];
  permissions: ["PROMPT_USER_V1" | "FULL_CONTROL_V1"];
};

export function useAddPartner(
  options?: Omit<
    UseMutationOptions<Partner, unknown, AddPartnerParams>,
    "mutationFn"
  >,
) {
  const { onSuccess, ...queryOptions } = options || {};
  const { isLoggedIn, user } = useLoggedInUser();
  const queryClient = useQueryClient();

  const { mutateAsync: addPartner, isLoading } = useMutation({
    // Returns the created partner object
    mutationFn: async (params: AddPartnerParams): Promise<Partner> => {
      if (!isLoggedIn || !user?.jwt) {
        throw new Error("Please login to add a partner");
      }

      const res = await fetch(
        `${params.ecosystem.url}/${params.ecosystem.id}/partner`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.jwt}`,
          },
          body: JSON.stringify({
            name: params.name,
            allowlistedDomains: params.allowlistedDomains,
            allowlistedBundleIds: params.allowlistedBundleIds,
            permissions: params.permissions,
          }),
        },
      );

      if (!res.ok) {
        const body = await res.json();
        console.error(body);
        if (res.status === 401) {
          throw new Error(
            "You're not authorized to add a partner to this ecosystem",
          );
        }
        if (res.status === 406) {
          throw new Error(
            "Please setup billing on your account to continue managing this ecosystem",
          );
        }
        throw new Error(
          body?.message ??
            body?.error?.message ??
            "Failed to add ecosystem partner",
        );
      }

      const data = await res.json();

      return data;
    },
    onSuccess: async (partner, variables, context) => {
      await queryClient.invalidateQueries([
        "ecosystem",
        variables.ecosystem.id,
        "partners",
      ]);
      if (onSuccess) {
        return onSuccess(partner, variables, context);
      }
      return;
    },
    ...queryOptions,
  });

  return { addPartner, isLoading };
}
