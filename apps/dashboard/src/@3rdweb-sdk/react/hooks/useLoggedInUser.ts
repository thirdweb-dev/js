import { useQuery } from "@tanstack/react-query";
import type { UserWithData } from "@thirdweb-dev/react";
import { THIRDWEB_API_HOST } from "constants/urls";
import { useMemo } from "react";
import {
  useActiveAccount,
  useActiveWalletConnectionStatus,
} from "thirdweb/react";

export function useLoggedInUser(): {
  isLoading: boolean;
  isLoggedIn: boolean;
  user: UserWithData | null;
} {
  const connectedAddress = useActiveAccount()?.address;
  const connectionStatus = useActiveWalletConnectionStatus();
  const userQuery = useQuery({
    queryKey: ["logged_in_user"],
    queryFn: async () => {
      const res = await fetch(`${THIRDWEB_API_HOST}/v1/auth/user`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      return (await res.json()) as UserWithData | null;
    },
    enabled: !!connectedAddress,
  });

  return useMemo(() => {
    switch (connectionStatus) {
      case "disconnected": {
        return {
          user: null,
          isLoading: false,
          isLoggedIn: false,
        };
      }
      case "connected": {
        if (connectedAddress !== userQuery.data?.address) {
          return {
            user: null,
            isLoading: userQuery.isLoading,
            isLoggedIn: false,
          };
        }
        return {
          user: userQuery.data ?? null,
          isLoading: userQuery.isLoading,
          isLoggedIn: !!userQuery.data,
        };
      }
      case "connecting": {
        return {
          user: null,
          isLoading: true,
          isLoggedIn: false,
        };
      }
    }
  }, [connectionStatus, userQuery.data, userQuery.isLoading, connectedAddress]);
}
