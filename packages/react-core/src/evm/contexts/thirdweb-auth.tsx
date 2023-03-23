import { ThirdwebAuth } from "@thirdweb-dev/auth";
import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useMemo,
} from "react";
import { useWallet } from "../../core/hooks/wallet-hooks";

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
}

interface ThirdwebAuthContext extends ThirdwebAuthConfig {
  auth?: ThirdwebAuth;
}

const ThirdwebAuthContext = createContext<ThirdwebAuthContext | undefined>(
  undefined,
);

export const ThirdwebAuthProvider: React.FC<
  PropsWithChildren<ThirdwebAuthConfig>
> = ({ domain, authUrl, children }) => {
  const wallet = useWallet();

  // Remove trailing slash from URL if present
  const authContext = useMemo(() => {
    if (!domain) {
      return undefined;
    }

    const context: ThirdwebAuthContext = {
      domain,
      authUrl: authUrl?.replace(/\/$/, ""),
      auth: undefined,
    };

    if (wallet) {
      context.auth = new ThirdwebAuth(wallet, domain);
    }

    return context;
  }, [domain, authUrl, wallet]);
  return (
    <ThirdwebAuthContext.Provider value={authContext}>
      {children}
    </ThirdwebAuthContext.Provider>
  );
};

export function useThirdwebAuthContext() {
  return useContext(ThirdwebAuthContext);
}
