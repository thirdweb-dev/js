import React, { PropsWithChildren, useEffect, useMemo } from "react";
import {
  ThirdwebAuthConfig,
  ThirdwebAuthContext,
  useThirdwebAuthContext,
} from "./thirdweb-auth";
import { useQueryClient } from "@tanstack/react-query";
import { useWallet } from "../../core/hooks/wallet-hooks";
import { WalletData } from "@thirdweb-dev/wallets";
import { useLogout } from "../hooks/auth";
import { useSwitchAccount } from "../hooks/auth/useSwitchAccount";

/**
 * @internal
 */
export const ThirdwebAuthProvider: React.FC<
  PropsWithChildren<{ value?: ThirdwebAuthConfig }>
> = ({ value, children }) => {
  // Remove trailing slash from URL if present
  const authContext = useMemo(() => {
    if (!value) {
      return undefined;
    }

    const context: ThirdwebAuthContext = {
      ...value,
      authUrl: value.authUrl?.replace(/\/$/, ""),
    };

    return context;
  }, [value]);

  return (
    <ThirdwebAuthContext.Provider value={authContext}>
      {children}
      <ChangeActiveWalletOnAccountSwitch />
    </ThirdwebAuthContext.Provider>
  );
};

function ChangeActiveWalletOnAccountSwitch() {
  const wallet = useWallet();
  const { logout } = useLogout();
  const { switchAccount } = useSwitchAccount();
  const authConfig = useThirdwebAuthContext();
  const queryClient = useQueryClient();

  // When active wallet switches, switch the active account cookie and invalidate user query
  useEffect(() => {
    const handleSwitchAccount = async (data: WalletData) => {
      if (!data.address) {
        return;
      }

      try {
        await switchAccount(data.address);
      } catch (err) {
        console.debug(
          `[Auth] Failed to switch account to ${data.address} with error:\n`,
          err,
        );
      }
    };

    const handleLogout = async () => {
      try {
        await logout();
      } catch (err) {
        console.debug(`[Auth] Failed to logout with error:\n`, err);
      }
    };

    const shouldAddListener = !!wallet && authConfig && authConfig.authUrl;

    if (shouldAddListener) {
      wallet.addListener("connect", handleSwitchAccount);
      wallet.addListener("change", handleSwitchAccount);
      wallet.addListener("disconnect", handleLogout);
    }

    return () => {
      if (shouldAddListener) {
        wallet.removeListener("connect", handleSwitchAccount);
        wallet.removeListener("change", handleSwitchAccount);
        wallet.removeListener("disconnect", handleLogout);
      }
    };
  }, [wallet, queryClient, authConfig, logout, switchAccount]);

  return null;
}
