import { useCallback } from "react";
import { AUTH_TOKEN_STORAGE_KEY } from "../../../core/constants/auth";
import { useThirdwebAuthContext } from "../../contexts/thirdweb-auth";

/**
 * Hook to access the JWT token after a successfull login event.
 * 
 * const getToken = useAuthToken();
 * const token = await getToken();
 *
 * @returns - The current JWT token or undefined if not logged in.
 *
 * @beta
 */
export function useAuthToken() {
  const authConfig = useThirdwebAuthContext();

  const getToken = useCallback(async () => {
    return authConfig?.secureStorage?.getItem(AUTH_TOKEN_STORAGE_KEY);
  }, [authConfig]);

  return { getToken };
}
