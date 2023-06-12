import { LoginOptions } from "@thirdweb-dev/auth";
import { useWallet } from "../../../core/hooks/wallet-hooks";
import { useThirdwebAuthContext } from "../../contexts/thirdweb-auth";
import { doLogin } from "./useLogin";
import invariant from "tiny-invariant";

export { useLogin, doLogin } from "./useLogin";
export { useLogout } from "./useLogout";
export type { UserWithData } from "./useUser";
export { useUser } from "./useUser";
export { useSwitchAccount } from "./useSwitchAccount";

export function useAuth() {
  const wallet = useWallet();
  const authConfig = useThirdwebAuthContext();

  return {
    login: async (options?: LoginOptions) => {
      invariant(
        authConfig,
        "Please specify an authConfig in the ThirdwebProvider",
      );
      invariant(wallet, "Need a connected a wallet!");
      return doLogin(wallet, {
        domain: authConfig.domain,
        ...options,
      });
    },
  };
}
