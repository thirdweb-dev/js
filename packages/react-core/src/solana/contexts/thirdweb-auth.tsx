import { ThirdwebAuth } from "@thirdweb-dev/auth";
import { SignerWallet } from "@thirdweb-dev/auth/solana";
import { ThirdwebSDK } from "@thirdweb-dev/sdk/solana";
import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useMemo,
} from "react";

/**
 * The configuration to use the react SDK with an [auth](https://portal.thirdweb.com/auth) server.
 *
 * @beta
 */
export interface ThirdwebAuthConfig {
  /**
   * The backend URL of the authentication endoints. For example, if your endpoints are
   * at `/api/auth/login`, `/api/auth/logout`, etc. then this should be set to `/api/auth`.
   */
  authUrl?: string;

  /**
   * The frontend domain used to generate the login payload.
   * This domain should match the domain used on your auth backend.
   */
  domain: string;

  /**
   * Solana SDK
   */
  sdk?: ThirdwebSDK;
}

interface ThirdwebAuthContext extends ThirdwebAuthConfig {
  auth?: ThirdwebAuth;
}

const ThirdwebAuthContext = createContext<ThirdwebAuthContext | undefined>(
  undefined,
);

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
      auth: undefined,
    };

    const identity = value.sdk?.wallet.getSigner();
    if (identity) {
      context.auth = new ThirdwebAuth(new SignerWallet(identity), value.domain);
    }

    return context;
  }, [value]);
  return (
    <ThirdwebAuthContext.Provider value={authContext}>
      {children}
    </ThirdwebAuthContext.Provider>
  );
};

export function useThirdwebAuthContext() {
  return useContext(ThirdwebAuthContext);
}
