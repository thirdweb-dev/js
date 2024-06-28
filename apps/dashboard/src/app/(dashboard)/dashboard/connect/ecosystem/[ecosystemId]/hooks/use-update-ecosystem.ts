import { useLoggedInUser } from "@3rdweb-sdk/react/hooks/useLoggedInUser";
import {
  type UseMutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

export type UpdateEcosystemParams = {
  id: string;
  permission: "PARTNER_WHITELIST" | "ANYONE";
};

export function useUpdateEcosystem(
  options?: Omit<
    UseMutationOptions<boolean, unknown, UpdateEcosystemParams>,
    "mutationFn"
  >,
) {
  const { isLoggedIn } = useLoggedInUser();
  const queryClient = useQueryClient();

  const {
    mutateAsync: updateEcosystem,
    isLoading,
    variables,
  } = useMutation({
    // Returns true if the update was successful
    mutationFn: async (params: UpdateEcosystemParams): Promise<boolean> => {
      if (!isLoggedIn) {
        throw new Error("Please login to update this ecosystem");
      }

      //   const res = await fetch(
      //     `${process.env.NEXT_PUBLIC_THIRDWEB_IN_APP_WALLET_API_HOST}/v1/ecosystem-wallet/2024-05-05/ecosystem-wallet/${params.id}`,
      //     {
      //       method: "PATCH",
      //       credentials: "include",
      //       headers: { "Content-Type": "application/json" },
      //       body: JSON.stringify({
      //         permission: params.permission,
      //       }),
      //     },
      //   );

      //   if (!res.ok) {
      //     const body = await res.json();
      //     console.error(body);
      //     if (res.status === 401) {
      //       throw new Error("You're not authorized to update this ecosystem");
      //     }
      //     if (res.status === 406) {
      //       throw new Error(
      //         "Please setup billing on your account to continue managing this ecosystem",
      //       );
      //     }
      //     throw new Error("Failed to update ecosystem");
      //   }

      await new Promise((resolve) => setTimeout(resolve, 3000));

      return true;
    },
    onSuccess: (partner, variables, context) => {
      return Promise.all([
        queryClient.invalidateQueries(["ecosystems"]),
        options?.onSuccess?.(partner, variables, context),
      ]);
    },
    ...options,
  });

  return { updateEcosystem, isLoading, variables };
}
