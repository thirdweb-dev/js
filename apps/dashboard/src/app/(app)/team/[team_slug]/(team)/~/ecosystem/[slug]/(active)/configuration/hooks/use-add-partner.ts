import {
  type UseMutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import type { Ecosystem, Partner } from "@/api/ecosystems";

type AddPartnerParams = {
  ecosystem: Ecosystem;
  name: string;
  allowlistedDomains: string[];
  allowlistedBundleIds: string[];
  accessControl?: Partner["accessControl"] | null;
};

export function useAddPartner(
  params: {
    authToken: string;
    teamId: string;
  },
  options?: Omit<
    UseMutationOptions<Partner, unknown, AddPartnerParams>,
    "mutationFn"
  >,
) {
  const { authToken, teamId } = params;
  const { onSuccess, ...queryOptions } = options || {};
  const queryClient = useQueryClient();

  return useMutation({
    // Returns the created partner object
    mutationFn: async (params: AddPartnerParams): Promise<Partner> => {
      const res = await fetch(
        `${params.ecosystem.url}/${params.ecosystem.id}/partner`,
        {
          body: JSON.stringify({
            accessControl: params.accessControl ?? undefined,
            allowlistedBundleIds: params.allowlistedBundleIds,
            allowlistedDomains: params.allowlistedDomains,
            name: params.name,
            // TODO - remove the requirement for permissions in API endpoint
            permissions: ["FULL_CONTROL_V1"],
          }),

          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
            "x-thirdweb-team-id": teamId,
          },
          method: "POST",
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
