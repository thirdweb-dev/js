import React, { PropsWithChildren, useEffect, useMemo } from "react";
import {
  ThirdwebAuthConfig,
  ThirdwebAuthContext,
  useThirdwebAuthContext,
} from "./thirdweb-auth";
import { useAddress } from "../hooks/wallet";
import { cacheKeys } from "../utils/cache-keys";
import { useQueryClient } from "@tanstack/react-query";

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
  const address = useAddress();
  const authConfig = useThirdwebAuthContext();
  const queryClient = useQueryClient();

  // When active wallet switches, switch the active account cookie and invalidate user query
  useEffect(() => {
    const switchActiveAccount = async () => {
      if (authConfig && authConfig.authUrl) {
        if (address && queryClient) {
          const res = await fetch(`${authConfig.authUrl}/active`, {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              address,
            }),
          });

          if (res.ok) {
            queryClient.invalidateQueries(cacheKeys.auth.user());
          }
        }
      }
    };

    switchActiveAccount();
  }, [address, queryClient, authConfig]);

  return null;
}
