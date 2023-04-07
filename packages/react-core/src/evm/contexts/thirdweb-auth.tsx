import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useMemo,
} from "react";

export interface ISecureStorage {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}

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
   * Secure storage to use for storing the auth token when using JWT tokens.
   * 
   * Do not use a storage option that stores values accessible outside 
   * your aplication (like localStorage on web environments) since you may 
   * be exposing your auth token to malicious actors.
   * 
   * ** By default auth uses cookies so no need to set this unless you want to specifically use JWT tokens **
   */
  secureStorage?: ISecureStorage;
}

interface ThirdwebAuthContext extends ThirdwebAuthConfig {}

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
    };

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
