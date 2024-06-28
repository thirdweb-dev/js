import { thirdwebClient } from "@/constants/client";
import { useLoggedInUser } from "@3rdweb-sdk/react/hooks/useLoggedInUser";
import {
  type UseMutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { upload } from "thirdweb/storage";

export type CreateEcosystemParams = {
  slug: string;
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
  const { isLoggedIn } = useLoggedInUser();
  const queryClient = useQueryClient();

  const { mutateAsync: createEcosystem, isLoading } = useMutation({
    // Returns the created ecosystem ID
    mutationFn: async (params: CreateEcosystemParams): Promise<string> => {
      if (!isLoggedIn) {
        throw new Error("Please login to create an ecosystem");
      }

      const logoUri = await upload({
        client: thirdwebClient,
        files: [params.logo],
      });

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_THIRDWEB_API_HOST}/v1/ecosystem-wallet/add-cloud-hosted`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            slug: params.slug,
            name: params.name,
            imageUrl: logoUri,
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
        throw new Error("Failed to create ecosystem");
      }

      const data = await res.json();

      return data.id;
    },
    onSuccess: (id, variables, context) => {
      return Promise.all([
        queryClient.invalidateQueries(["ecosystems"]),
        options?.onSuccess?.(id, variables, context),
      ]);
    },
    ...options,
  });

  return { createEcosystem, isLoading };
}
