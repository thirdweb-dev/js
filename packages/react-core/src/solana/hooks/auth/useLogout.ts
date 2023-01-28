import { ensureTWPrefix } from "../../../core/query-utils/query-key";
import { useThirdwebAuthContext } from "../../contexts/thirdweb-auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import invariant from "tiny-invariant";

/**
 * Hook to logout the connected wallet from the backend.
 * The backend logout URL must be configured on the ThirdwebProvider.
 *
 * @returns - A function to invoke to logout.
 *
 * @beta
 */
export function useLogout() {
  const queryClient = useQueryClient();
  const authConfig = useThirdwebAuthContext();

  const logout = useMutation({
    mutationFn: async () => {
      invariant(
        authConfig,
        "Please specify an authConfig in the ThirdwebProvider",
      );

      await fetch(`${authConfig.authUrl}/logout`, {
        method: "POST",
      });

      queryClient.invalidateQueries(ensureTWPrefix(["user"]));
    },
  });

  return { logout: logout.mutateAsync, isLoading: logout.isLoading };
}
