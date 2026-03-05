import {
  type UseMutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import type { Ecosystem, Partner } from "@/api/team/ecosystems";

type UpdatePartnerParams = {
  partnerId: string;
  ecosystem: Ecosystem;
  name: string;
  imageUrl?: string | null;
  allowlistedDomains: string[];
  allowlistedBundleIds: string[];
  accessControl?: {
    serverVerifier?: {
      url: string;
      headers?: { key: string; value: string }[];
    } | null;
  } | null;
};

export function useUpdatePartner(
  params: {
    authToken: string;
    teamId: string;
  },
  options?: Omit<
    UseMutationOptions<Partner, unknown, UpdatePartnerParams>,
    "mutationFn"
  >,
) {
  const { authToken, teamId } = params;
  const { onSuccess, ...queryOptions } = options || {};
  const queryClient = useQueryClient();

  return useMutation({
    // Returns the created partner object
    mutationFn: async (params: UpdatePartnerParams): Promise<Partner> => {
      const res = await fetch(
        `${params.ecosystem.url}/${params.ecosystem.id}/partner/${params.partnerId}`,
        {
          body: JSON.stringify({
            accessControl: params.accessControl,
            allowlistedBundleIds: params.allowlistedBundleIds,
            allowlistedDomains: params.allowlistedDomains,
            imageUrl: params.imageUrl,
            name: params.name,
          }),

          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
            "x-thirdweb-team-id": teamId,
          },
          method: "PATCH",
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
