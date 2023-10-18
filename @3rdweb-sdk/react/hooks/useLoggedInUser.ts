import { useAddress, useUser } from "@thirdweb-dev/react";

export function useLoggedInUser(): ReturnType<typeof useUser> {
  const connectedAddress = useAddress();
  const user = useUser();
  // ONLY RETURN THE USER IF THE ADDRESS MATCHES
  if (user.user?.address === connectedAddress) {
    return user;
  }

  return { user: undefined, isLoading: user.isLoading, isLoggedIn: false };
}
