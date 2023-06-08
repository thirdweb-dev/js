import React, { PropsWithChildren, useEffect, useMemo } from "react";
import { useLogout, useUser } from "../hooks/auth";
import { useWallet } from "../../core/hooks/wallet-hooks";
import { ThirdwebAuthConfig, ThirdwebAuthContext } from "./thirdweb-auth";

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
      <DisconnectOnAccountSwitch />
    </ThirdwebAuthContext.Provider>
  );
};
function DisconnectOnAccountSwitch() {
  const { logout } = useLogout();
  const wallet = useWallet();
  const { isLoggedIn } = useUser();

  useEffect(() => {
    const handleChange = (data: { address?: string; chainId?: number }) => {
      // if the user changes their account, logout
      if (data.address) {
        logout();
      }
    };

    const shouldAddListener = wallet && isLoggedIn;

    if (shouldAddListener) {
      wallet.addListener("change", handleChange);
    }

    return () => {
      if (shouldAddListener) {
        wallet.removeListener("change", handleChange);
      }
    };
  }, [wallet, logout, isLoggedIn]);

  return null;
}
