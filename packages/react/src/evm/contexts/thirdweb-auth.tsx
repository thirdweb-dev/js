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
  authUrl: string;

  /**
   * The frontend domain used to generate the login payload.
   * This domain should match the domain used on your auth backend.
   */
  domain: string;

  /**
   * The URL to redirect to after a succesful login.
   */
  loginRedirect?: string;
}

const ThirdwebAuthConfigContext = createContext<ThirdwebAuthConfig | undefined>(
  undefined,
);

export const ThirdwebAuthConfigProvider: React.FC<
  PropsWithChildren<{ value?: ThirdwebAuthConfig }>
> = ({ value, children }) => {
  // Remove trailing slash from URL if present
  const authConfig = useMemo(
    () =>
      value
        ? {
            ...value,
            authUrl: value.authUrl.replace(/\/$/, ""),
          }
        : undefined,
    [value],
  );
  return (
    <ThirdwebAuthConfigContext.Provider value={authConfig}>
      {children}
    </ThirdwebAuthConfigContext.Provider>
  );
};

export function useThirdwebAuthConfig() {
  return useContext(ThirdwebAuthConfigContext);
}
