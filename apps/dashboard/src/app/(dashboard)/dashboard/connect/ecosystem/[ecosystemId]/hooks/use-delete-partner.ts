import { useLoggedInUser } from "@3rdweb-sdk/react/hooks/useLoggedInUser";
import {
  type UseMutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

export type DeletePartnerParams = {
  ecosystemId: string;
  partnerId: string;
};

export function useDeletePartner(
  options?: Omit<
    UseMutationOptions<boolean, unknown, DeletePartnerParams>,
    "mutationFn"
  >,
) {
  const { isLoggedIn } = useLoggedInUser();
  const queryClient = useQueryClient();

  const { mutateAsync: deletePartner, isLoading } = useMutation({
    // Returns true on success
    mutationFn: async (params: DeletePartnerParams): Promise<boolean> => {
      if (!isLoggedIn) {
        throw new Error("Please login to delete this partner");
      }

      await new Promise((resolve) => setTimeout(resolve, 3000));

      // const res = await fetch(
      //   `${process.env.NEXT_PUBLIC_THIRDWEB_IN_APP_WALLET_API_HOST}/v1/ecosystem-wallet/${params.ecosystemId}/partner/${params.partnerId}`,
      //   {
      //     method: "DELETE",
      //     credentials: "include",
      //   },
      // );

      // if (!res.ok) {
      //   const body = await res.json();
      //   console.error(body);
      //   if (res.status === 401) {
      //     throw new Error(
      //       "You're not authorized to delete a partner from this ecosystem",
      //     );
      //   }
      //   throw new Error("Failed to delete ecosystem partner");
      // }

      return true;
    },
    onSuccess: (partner, variables, context) => {
      return Promise.all([
        queryClient.invalidateQueries(["partners", variables.ecosystemId]),
        options?.onSuccess?.(partner, variables, context),
      ]);
    },
    ...options,
  });

  return { deletePartner, isLoading };
}
