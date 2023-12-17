import { useThirdwebAuthContext } from "../../contexts/thirdweb-auth";
import { cacheKeys } from "../../utils/cache-keys";
import { useQuery } from "@tanstack/react-query";
import type { Json, User } from "@thirdweb-dev/auth";
import invariant from "tiny-invariant";
import { AUTH_TOKEN_STORAGE_KEY } from "../../../core/constants/auth";

export interface UserWithData<
  TData extends Json = Json,
  TContext extends Json = Json,
> extends User<TContext> {
  data?: TData;
}

/**
 * Hook for retrieving information about the currently signed-in user using [auth](https://portal.thirdweb.com/auth).
 *
 * Useful to get the user's address and session data, or `undefined` if no user is signed in.
 *
 * ```jsx
 * import { useUser } from "@thirdweb-dev/react";
 *
 * function App() {
 *   const { user, isLoggedIn, isLoading } = useUser();
 * }
 * ```
 *
 * @auth
 *
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

      const token = await authConfig.secureStorage?.getItem(
        AUTH_TOKEN_STORAGE_KEY,
      );
      // We include credentials so we can getUser even if API is on different URL
      const params = {
        credentials: "include",
        ...(token
          ? {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          : {}),
      };

      const res = await fetch(
        `${authConfig.authUrl}/user`,
        params as RequestInit,
      );

      return (await res.json()) as UserWithData<TData, TContext>;
    },
    {
      enabled: !!authConfig,
    },
  );

  return { user, isLoggedIn: !!user, isLoading };
}
