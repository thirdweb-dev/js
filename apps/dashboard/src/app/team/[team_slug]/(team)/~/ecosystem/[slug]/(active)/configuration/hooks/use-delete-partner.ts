import {
  type UseMutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import type { Ecosystem } from "../../../../types";

type DeletePartnerParams = {
  ecosystem: Ecosystem;
  partnerId: string;
};

export function useDeletePartner(
  params: {
    authToken: string;
  },
  options?: Omit<
    UseMutationOptions<boolean, unknown, DeletePartnerParams>,
    "mutationFn"
  >,
) {
  const { authToken } = params;
  const { onSuccess, ...queryOptions } = options || {};
  const queryClient = useQueryClient();

  return useMutation({
    // Returns true on success
    mutationFn: async (params: DeletePartnerParams): Promise<boolean> => {
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const res = await fetch(
        `${params.ecosystem.url}/${params.ecosystem.id}/partner/${params.partnerId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      );

      if (!res.ok) {
        const body = await res.json();
        console.error(body);
        if (res.status === 401) {
          throw new Error(
            "You're not authorized to delete a partner from this ecosystem",
          );
        }
        throw new Error(
          body?.message ??
            body?.error?.message ??
            "Failed to delete ecosystem partner",
        );
      }

      return true;
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
