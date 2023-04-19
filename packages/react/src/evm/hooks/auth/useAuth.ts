import type { LoginOptions } from "@thirdweb-dev/auth";
import {
  doLogin,
  useThirdwebAuthContext,
  useWallet,
} from "@thirdweb-dev/react-core";
import invariant from "tiny-invariant";

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
