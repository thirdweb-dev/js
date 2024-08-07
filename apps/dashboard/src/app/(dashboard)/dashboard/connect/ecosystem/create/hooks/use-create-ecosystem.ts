import { thirdwebClient } from "@/constants/client";
import { useLoggedInUser } from "@3rdweb-sdk/react/hooks/useLoggedInUser";
import {
  type UseMutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { THIRDWEB_API_HOST } from "constants/urls";
import { upload } from "thirdweb/storage";

export type CreateEcosystemParams = {
  name: string;
  logo: File;
  permission: "PARTNER_WHITELIST" | "ANYONE";
};

export function useCreateEcosystem(
  options?: Omit<
    UseMutationOptions<string, unknown, CreateEcosystemParams>,
    "mutationFn"
  >,
) {
  const { onSuccess, ...queryOptions } = options ?? {};
  const { isLoggedIn } = useLoggedInUser();
  const queryClient = useQueryClient();

  const { mutateAsync: createEcosystem, isLoading } = useMutation({
    // Returns the created ecosystem slug
    mutationFn: async (params: CreateEcosystemParams): Promise<string> => {
      if (!isLoggedIn) {
        throw new Error("Please login to create an ecosystem");
      }

      const imageUri = await upload({
        client: thirdwebClient,
        files: [params.logo],
      });

      const res = await fetch(
        `${THIRDWEB_API_HOST}/v1/ecosystem-wallet/add-cloud-hosted`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: params.name,
            imageUrl: imageUri,
            permission: params.permission,
          }),
        },
      );

      if (!res.ok) {
        const body = await res.json();
        console.error(body);
        if (res.status === 401) {
          throw new Error(
            "You're not authorized to create an ecosystem, are you logged in?",
          );
        }
        if (res.status === 406) {
          throw new Error(
            "Please setup billing on your account to create an ecosystem",
          );
        }
        throw new Error(
          body.message ?? body?.error?.message ?? "Failed to create ecosystem",
        );
      }

      const data = await res.json();

      return data.result.slug;
    },
    onSuccess: async (id, variables, context) => {
      if (onSuccess) {
        await onSuccess(id, variables, context);
      }
      return queryClient.invalidateQueries(["ecosystems"]);
    },
    ...queryOptions,
  });

  return { createEcosystem, isLoading };
}
