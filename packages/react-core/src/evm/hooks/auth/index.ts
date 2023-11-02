import { ThirdwebAuth } from "@thirdweb-dev/auth";
import { useWallet } from "../../../core/hooks/wallet-hooks";
import { useThirdwebAuthContext } from "../../contexts/thirdweb-auth";
import { useMemo } from "react";

export { useLogin } from "./useLogin";
export { useLogout } from "./useLogout";
export type { UserWithData } from "./useUser";
export { useUser } from "./useUser";
export { useSwitchAccount } from "./useSwitchAccount";

export function useAuth() {
  const wallet = useWallet();
  const authConfig = useThirdwebAuthContext();

  return useMemo(() => {
    if (!authConfig?.domain) {
      return undefined;
    }

    if (!wallet) {
      return undefined;
    }

    return new ThirdwebAuth(wallet, authConfig.domain);
  }, [wallet, authConfig?.domain]);
}
