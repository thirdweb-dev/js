import {
  type UseMutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import type { Ecosystem, Partner } from "../../../../types";

type UpdatePartnerParams = {
  partnerId: string;
  ecosystem: Ecosystem;
  name: string;
  allowlistedDomains: string[];
  allowlistedBundleIds: string[];
};

export function useUpdatePartner(
  params: {
    authToken: string;
  },
  options?: Omit<
    UseMutationOptions<Partner, unknown, UpdatePartnerParams>,
    "mutationFn"
  >,
) {
  const { authToken } = params;
  const { onSuccess, ...queryOptions } = options || {};
  const queryClient = useQueryClient();

  return useMutation({
    // Returns the created partner object
    mutationFn: async (params: UpdatePartnerParams): Promise<Partner> => {
      const res = await fetch(
        `${params.ecosystem.url}/${params.ecosystem.id}/partner/${params.partnerId}`,
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            name: params.name,
            allowlistedDomains: params.allowlistedDomains,
            allowlistedBundleIds: params.allowlistedBundleIds,
          }),
        },
      );

      if (!res.ok) {
        const body = await res.json();
        console.error(body);
        if (res.status === 401) {
          throw new Error("You're not authorized to update this partner");
        }
        if (res.status === 406) {
          throw new Error(
            "Please setup billing on your account to continue managing this ecosystem",
          );
        }
        throw new Error(
          body?.message ??
            body?.error?.message ??
            "Failed to update ecosystem partner",
        );
      }

      const data = await res.json();

      return data;
    },
    onSuccess: async (partner, variables, context) => {
      await queryClient.invalidateQueries({
        queryKey: ["ecosystem", variables.ecosystem.id, "partners"],
      });
      if (onSuccess) {
        return onSuccess(partner, variables, context);
      }
      return;
    },
    ...queryOptions,
  });
}
