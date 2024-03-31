import { useAddress, useUser } from "@thirdweb-dev/react";

export function useLoggedInUser(): ReturnType<typeof useUser> {
  const connectedAddress = useAddress();
  const userQuery = useUser();

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
}
