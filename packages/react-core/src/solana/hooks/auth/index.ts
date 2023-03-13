import { useThirdwebAuthContext } from "../../contexts/thirdweb-auth";

export { useLogin } from "./useLogin";
export type { LoginConfig } from "./useLogin";

export { useLogout } from "./useLogout";

export type { UserWithData } from "./useUser";
export { useUser } from "./useUser";

export function useAuth() {
  const authConfig = useThirdwebAuthContext();
  return authConfig?.auth;
}
