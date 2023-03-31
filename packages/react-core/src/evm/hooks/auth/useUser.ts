import { useThirdwebAuthContext } from "../../contexts/thirdweb-auth";
import { cacheKeys } from "../../utils/cache-keys";
import { useQuery } from "@tanstack/react-query";
import type { Json, User } from "@thirdweb-dev/auth";
import invariant from "tiny-invariant";
import { coordinatorStorage } from "../../../core/providers/thirdweb-wallet-provider";

export interface UserWithData<
  TData extends Json = Json,
  TContext extends Json = Json,
> extends User<TContext> {
  data?: TData;
}

/**
 * Hook to get the currently logged in user.
 *
 * @returns - The currently logged in user or null if not logged in, as well as a loading state.
 *
 * @beta
 */
export function useUser<
  TData extends Json = Json,
  TContext extends Json = Json,
>() {
  const authConfig = useThirdwebAuthContext();

  const { data: user, isLoading } = useQuery(
    cacheKeys.auth.user(),
    async () => {
      invariant(
        authConfig,
        "Please specify an authConfig in the ThirdwebProvider",
      );
      invariant(
        authConfig.authUrl,
        "Please specify an authUrl in the authConfig.",
      );

      console.log("fetchUser");
      const token = await coordinatorStorage.getItem("cookie")

      console.log("token", token);

      if (!token) {
          return null;
      }
      // We include credentials so we can getUser even if API is on different URL
      const res = await fetch(`${authConfig.authUrl}/user`, {
        credentials: "include",
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      return (await res.json()) as UserWithData<TData, TContext>;
    },
    {
      enabled: !!authConfig,
    },
  );

  return { user, isLoggedIn: !!user, isLoading };
}
