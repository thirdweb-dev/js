import React, { PropsWithChildren, useEffect, useMemo } from "react";
import { useUser } from "../hooks/auth";
import { useWallet } from "../../core/hooks/wallet-hooks";
import { ThirdwebAuthConfig, ThirdwebAuthContext } from "./thirdweb-auth";
import Cookies from "js-cookie";

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
  const { isLoggedIn } = useUser();

  useEffect(() => {
    const handleChange = (data: { address?: string; chainId?: number }) => {
      // if the user changes their account, switch the active account cookie
      if (
        data.address &&
        Cookies.get(`thirdweb_auth_active_account`) &&
        data.address !== Cookies.get(`thirdweb_auth_active_account`)
      ) {
        Cookies.set(`thirdweb_auth_active_account`, data.address);
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
  }, [wallet, isLoggedIn]);

  return null;
}
