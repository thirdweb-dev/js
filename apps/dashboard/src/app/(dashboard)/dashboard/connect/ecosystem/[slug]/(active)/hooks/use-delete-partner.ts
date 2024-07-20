import { useLoggedInUser } from "@3rdweb-sdk/react/hooks/useLoggedInUser";
import {
  type UseMutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import type { Ecosystem } from "../../../types";

export type DeletePartnerParams = {
  ecosystem: Ecosystem;
  partnerId: string;
};

export function useDeletePartner(
  options?: Omit<
    UseMutationOptions<boolean, unknown, DeletePartnerParams>,
    "mutationFn"
  >,
) {
  const { onSuccess, ...queryOptions } = options || {};
  const { isLoggedIn, user } = useLoggedInUser();
  const queryClient = useQueryClient();

  const { mutateAsync: deletePartner, isLoading } = useMutation({
    // Returns true on success
    mutationFn: async (params: DeletePartnerParams): Promise<boolean> => {
      if (!isLoggedIn || !user?.jwt) {
        throw new Error("Please login to delete this partner");
      }

      await new Promise((resolve) => setTimeout(resolve, 3000));

      const res = await fetch(
        `${params.ecosystem.url}/${params.ecosystem.id}/partner/${params.partnerId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${user.jwt}`,
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

  return { deletePartner, isLoading };
}
