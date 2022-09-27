import { LoginConfig, useLogin } from "./useLogin";
import { useLogout } from "./useLogout";
import { useUser } from "./useUser";

export * from "./useLogin";
export * from "./useLogout";
export * from "./useUser";

/**
 *
 * @returns
 * @internal
 */
export function useAuth(loginConfig?: LoginConfig) {
  const user = useUser();
  const login = useLogin(loginConfig);
  const logout = useLogout();
  return { ...user, login, logout };
}
