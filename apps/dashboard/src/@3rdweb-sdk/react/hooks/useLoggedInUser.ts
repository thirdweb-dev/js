import { useQuery } from "@tanstack/react-query";
import type { UserWithData } from "@thirdweb-dev/react";
import { THIRDWEB_API_HOST } from "constants/urls";
import { useActiveAccount } from "thirdweb/react";

export function useLoggedInUser() {
  const connectedAddress = useActiveAccount()?.address;
  const userQuery = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await fetch(`${THIRDWEB_API_HOST}/v1/auth/user`, {
        method: "GET",
        credentials: "include",
      });
      return (await res.json()) as UserWithData;
    },
    enabled: !!connectedAddress,
  });

  // user is not considered logged in if the connected address does not match the user's address
  if (
    !userQuery.data ||
    !connectedAddress ||
    userQuery.data.address !== connectedAddress
  ) {
    return {
      user: undefined,
      isLoading: userQuery.isLoading,
      isLoggedIn: false,
    };
  }

  return {
    user: userQuery.data,
    isLoading: userQuery.isLoading,
    isLoggedIn: true,
  };
}
