import { ensureTWPrefix } from "../../../core/query-utils/query-key";
import { useThirdwebAuthConfig } from "../../contexts/thirdweb-auth";
import { useQueryClient } from "@tanstack/react-query";
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
  const authConfig = useThirdwebAuthConfig();

  function logout() {
    invariant(
      authConfig,
      "Please specify an authConfig in the ThirdwebProvider",
    );
    queryClient.invalidateQueries(ensureTWPrefix(["user"]));
    window.location.href = `${authConfig.authUrl}/logout`;
  }

  return logout;
}
