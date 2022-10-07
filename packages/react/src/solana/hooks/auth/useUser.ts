import { ensureTWPrefix } from "../../../core/query-utils/query-key";
import { useThirdwebAuthConfig } from "../../contexts/thirdweb-auth";
import { useQuery } from "@tanstack/react-query";
import invariant from "tiny-invariant";

export interface ThirdwebAuthUser {
  address: string;
}

/**
 * Hook to get the currently logged in user.
 *
 * @returns - The currently logged in user or null if not logged in, as well as a loading state.
 *
 * @beta
 */
export function useUser() {
  const authConfig = useThirdwebAuthConfig();

  const { data: user, isLoading } = useQuery(
    ensureTWPrefix(["user"]),
    async () => {
      invariant(
        authConfig,
        "Please specify an authConfig in the ThirdwebProvider",
      );
      const res = await fetch(`${authConfig.authUrl}/user`);
      return (await res.json()) as ThirdwebAuthUser;
    },
    {
      enabled: !!authConfig,
    },
  );

  return { user, isLoading };
}
