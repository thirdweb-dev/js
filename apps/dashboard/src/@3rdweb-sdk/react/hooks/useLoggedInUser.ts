import { useAddress, useConnectionStatus, useUser } from "@thirdweb-dev/react";

export function useLoggedInUser(): ReturnType<typeof useUser> {
  const connectedAddress = useAddress();
  const status = useConnectionStatus();
  const userQuery = useUser();

  switch (status) {
    case "disconnected":
      return {
        user: undefined,
        isLoading: false,
        isLoggedIn: false,
      };
    case "connecting":
      return {
        user: undefined,
        isLoading: true,
        isLoggedIn: false,
      };
    case "connected":
      // user is not considered logged in if the connected address does not match the user's address
      if (
        !userQuery.isLoggedIn ||
        !connectedAddress ||
        userQuery.user?.address !== connectedAddress
      ) {
        return {
          user: undefined,
          isLoading: userQuery.isLoading,
          isLoggedIn: false,
        };
      }
      return userQuery;
    default:
      return {
        user: undefined,
        isLoading: true,
        isLoggedIn: false,
      };
  }
}
