import { useThirdwebAuthContext } from "../../contexts/thirdweb-auth";

export * from "./useLogin";
export * from "./useLogout";
export * from "./useUser";

export function useAuth() {
  const authConfig = useThirdwebAuthContext();
  return authConfig?.auth;
}
