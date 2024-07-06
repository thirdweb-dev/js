import { useQuery } from "@tanstack/react-query";
import type { UserWithData } from "@thirdweb-dev/react";
import { THIRDWEB_API_HOST } from "constants/urls";
import { getAddress } from "thirdweb";
import { useActiveAccount } from "thirdweb/react";

export function fetchUserQuery(address: string) {
  return {
    enabled: !!address,
    queryKey: ["logged_in_user", address],
    queryFn: async () => {
      const res = await fetch(`${THIRDWEB_API_HOST}/v1/auth/user`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        throw new Error("Failed to fetch user data");
      }
      try {
        const json = await res.json();
        if (json === null) {
          throw new Error("Failed to fetch user data");
        }

        const user = json as UserWithData;
        if (user && getAddress(user.address) === getAddress(address)) {
          return user;
        }
        throw new Error("Failed to fetch user data");
      } catch {
        throw new Error("Failed to fetch user data");
      }
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  } as const;
}

export function useLoggedInUser(): {
  isLoading: boolean;
  isLoggedIn: boolean;
  user: UserWithData | null;
} {
  const connectedAddress = useActiveAccount()?.address;
  const query = useQuery(fetchUserQuery(connectedAddress || ""));

  if (query.fetchStatus === "fetching") {
    return {
      isLoading: true,
      isLoggedIn: false,
      user: null,
    };
  }

  return {
    isLoading: query.isLoading,
    isLoggedIn: query.isSuccess ? !!query.data : false,
    user: query.isSuccess ? query.data : null,
  };
}
