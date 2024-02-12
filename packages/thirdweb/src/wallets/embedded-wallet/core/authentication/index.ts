import type {
  AuthArgsType,
  AuthTokenStorageType,
  AuthUserType,
  InitiateAuthArgsType,
  InitiateAuthResultType,
  LinkAuthArgsType,
  MultiStepAuthArgsType,
  MultiStepAuthProviderType,
} from "./type.js";

/**
 * Create a new AuthTokenStorageType instance.
 * @param arg - The options for creating a new AuthTokenStorageType instance.
 * @param arg.fetchToken - The function to fetch the auth token.
 * @param arg.storeToken - The function to store the auth token.
 * @param arg.removeToken - The function to remove the auth token.
 * @example
 *  ```ts
 * import { createAuthStorage } from "thirdweb/wallets/embedded-wallet/core/authentication";
 * const storage = createAuthStorage({
 *    fetchToken: ({ key }) => localStorage.getItem(key),
 *    storeToken: ({ key, value }) => localStorage.setItem(key, value),
 *    removeToken: ({ key }) => localStorage.removeItem(key),
 *  });
 * ```
 * @returns A new AuthTokenStorageType instance.
 */
export const createAuthStorage = ({
  fetchToken,
  storeToken,
  removeToken,
}: AuthTokenStorageType): AuthTokenStorageType => {
  return { fetchToken, storeToken, removeToken };
};

/**
 * Fetches the authenticated user.
 * @param arg - The options for fetching the authenticated user.
 * @param arg.storage - The storage options for the user's auth token
 * @example
 * ```ts
 * import { getAuthenticatedUser } from "thirdweb/wallets/embedded-wallet/core/authentication";
 * const storage = createAuthStorage({ ... });
 * const user = await getAuthenticatedUser({ storage });
 * ```
 * @returns A Promise that resolves to the authenticated user. undefined otherwise
 */
export const getAuthenticatedUser = async (arg: {
  storage: AuthTokenStorageType;
}) => {
  const { ROUTE_FETCH_USER } = await import("../routes.js");
  const { THIRDWEB_AUTH_TOKEN_KEY } = await import("./constant.js");

  const token = await arg.storage.fetchToken({ key: THIRDWEB_AUTH_TOKEN_KEY });
  if (!token) {
    await arg.storage.removeToken({
      key: THIRDWEB_AUTH_TOKEN_KEY,
    });
    return undefined;
  }

  // TODO: 500 seems to be throwing??
  const userResp = await fetch(ROUTE_FETCH_USER(), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!userResp.ok) {
    await arg.storage.removeToken({
      key: THIRDWEB_AUTH_TOKEN_KEY,
    });
    return undefined;
  }

  const user = (await userResp.json()) as AuthUserType;

  // store the refreshed token
  await arg.storage.storeToken({
    key: THIRDWEB_AUTH_TOKEN_KEY,
    value: user.authToken,
  });

  return user;
};

// for 2 step Auth
/**
 * Initiates the authentication process.
 * @param arg - The options for initiating the authentication process
 * @example
 * ```ts
 * import { preAuthenticate } from "thirdweb/wallets/embedded-wallet/core/authentication";
 *
 * await preAuthenticate({
 *    provider: "email",
 *    email: "you@example.com"
 * });
 * ```
 * @returns A Promise that resolves to the initiation result.
 */
export const preAuthenticate = async (
  arg: InitiateAuthArgsType,
): Promise<InitiateAuthResultType> => {
  const { ROUTE_INITIATE_AUTH } = await import("../routes.js");

  switch (arg.provider) {
    case "email": {
      const { email } = arg;
      const resp = await fetch(
        ROUTE_INITIATE_AUTH(arg.provider, arg.client.clientId),
        {
          method: "POST",
          body: JSON.stringify({
            email,
          }),
        },
      );
      const result = await resp.json();
      return result as InitiateAuthResultType;
    }
    case "phone": {
      const { phone } = arg;
      const resp = await fetch(
        ROUTE_INITIATE_AUTH(arg.provider, arg.client.clientId),
        {
          method: "POST",
          body: JSON.stringify({
            phone,
          }),
        },
      );
      const result = await resp.json();
      return result as InitiateAuthResultType;
    }
    default: {
      throw new Error(`Invalid authentication provider`);
    }
  }
};

/**
 * Completes the authentication process.
 * @param arg - The options for completing the authentication process
 * @param arg.handleOauth - The function to handle the oauth process. Does a postmessage with the result under "oauthSuccessResult" and "oauthFailureResult" for success and failure respectively.
 * @example
 * ```ts
 * import { authenticate } from "thirdweb/wallets/embedded-wallet/core/authentication";
 *
 *  const user = await authenticate({
 *    provider: "google",
 *  });
 *  ```
 * @returns A Promise that resolves to the authenticated user.
 */
export const authenticate = async (
  arg: AuthArgsType & {
    handleOauth: (arg: { url: string }) => Promise<AuthUserType>;
  },
): Promise<AuthUserType> => {
  const { ROUTE_INITIATE_AUTH, ROUTE_COMPLETE_AUTH } = await import(
    "../routes.js"
  );

  switch (arg.provider) {
    case "discord": {
      return arg.handleOauth({
        url: ROUTE_INITIATE_AUTH(
          arg.provider,
          arg.client.clientId,
          arg.config?.autoLinkAccount,
        ),
      });
    }
    case "google": {
      const baseUrl = new URL(
        ROUTE_INITIATE_AUTH(
          arg.provider,
          arg.client.clientId,
          arg.config?.autoLinkAccount,
        ),
      );
      if (arg.googleOauthPrompt) {
        baseUrl.searchParams.set("prompt", arg.googleOauthPrompt);
      }
      return arg.handleOauth({
        url: baseUrl.href,
      });
    }
    case "email": {
      const { email, code } = arg;
      const resp = await fetch(ROUTE_COMPLETE_AUTH(arg.provider), {
        method: "POST",
        body: JSON.stringify({
          email,
          code,
        }),
      });
      const result = await resp.json();
      return result as AuthUserType;
    }
    case "phone": {
      const { phone, code } = arg;
      const resp = await fetch(ROUTE_COMPLETE_AUTH(arg.provider), {
        method: "POST",
        body: JSON.stringify({
          phone,
          code,
        }),
      });
      const result = await resp.json();
      return result as AuthUserType;
    }
    default: {
      throw new Error(`Invalid authentication provider`);
    }
  }
};

/**
 * Initiates the 2FA authentication process.
 * @param arg - The options for initiating the 2FA authentication process
 * @example
 *  ```ts
 * import { pre2FA } from "thirdweb/wallets/embedded-wallet/core/authentication";
 * await pre2FA({
 *    provider: "email",
 *    email: "you@example.com"
 *   storage: createAuthStorage({ ... })
 * });
 * ```
 * @returns A Promise that resolves to the initiation result.
 */
export const pre2FA = async (
  arg: MultiStepAuthProviderType & { storage: AuthTokenStorageType },
): Promise<InitiateAuthResultType> => {
  const { ROUTE_INITIATE_2FA_AUTH } = await import("../routes.js");
  const { AuthenticationError } = await import("./error.js");
  const { THIRDWEB_AUTH_TOKEN_KEY } = await import("./constant.js");

  const token = await arg.storage.fetchToken({
    key: THIRDWEB_AUTH_TOKEN_KEY,
  });
  if (!token) {
    await arg.storage.removeToken({
      key: THIRDWEB_AUTH_TOKEN_KEY,
    });
    throw new AuthenticationError("No authenticated user found!");
  }

  switch (arg.provider) {
    case "email": {
      const { email } = arg;
      const resp = await fetch(ROUTE_INITIATE_2FA_AUTH(arg.provider), {
        method: "POST",
        body: JSON.stringify({
          email,
        }),
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await resp.json();
      return result as InitiateAuthResultType;
    }
    case "phone": {
      const { phone } = arg;
      const resp = await fetch(ROUTE_INITIATE_2FA_AUTH(arg.provider), {
        method: "POST",
        body: JSON.stringify({
          phone,
        }),
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await resp.json();
      return result as InitiateAuthResultType;
    }
    default: {
      throw new Error(`Invalid authentication provider`);
    }
  }
};

/**
 * Completes the 2FA authentication process.
 * @param arg - The options for completing the 2FA authentication process
 * @example
 * ```ts
 * import { confirm2FA } from "thirdweb/wallets/embedded-wallet/core/authentication";
 * await confirm2FA({
 *    provider: "email",
 *    email: "you@example.com""
 *    code: "123456",
 *    storage: createAuthStorage({ ... })
 * });
 * ```
 * @returns A Promise that resolves to the authenticated user.
 */
export const confirm2FA = async (
  arg: MultiStepAuthArgsType & { storage: AuthTokenStorageType },
) => {
  // TODO: Implement
  console.log("arg", arg);
};

/**
 * Initiates the linking of an existing user account with a new authentication provider. Used for 2 step authentication.
 * @param arg - The options for initiating the linking of the user account
 * @example
 * ```ts
 * import { preLinkAuthentication } from "thirdweb/wallets/embedded-wallet/core/authentication";
 *
 * await preLinkAuthentication({
 *    provider: "email",
 *    email: "you@example.com"
 * });
 * ```
 * @returns A Promise that resolves to the initiation result.
 */
export const preLinkAuthentication = async (
  arg: MultiStepAuthProviderType,
): Promise<InitiateAuthResultType> => {
  console.log("arg", arg);
  return {
    initiationType: "link",
    ...arg,
  };
};

/**
 * Links an existing user account with a new authentication provider.
 * @param arg - The options for linking the user account
 * @example
 * ```ts
 * import { linkAuthentication } from "thirdweb/wallets/embedded-wallet/core/authentication";
 * await linkAuthentication({
 *     provider: "google",
 *     googleOauthPrompt: "select_account",
 * });
 * ```
 * @returns A Promise that resolves to the authenticated user.
 */
export const linkAuthentication = async (
  arg: LinkAuthArgsType & {
    handleOauth: (arg: { url: string }) => Promise<AuthUserType>;
  },
) => {
  const { ROUTE_INITIATE_LINK } = await import("../routes.js");

  switch (arg.provider) {
    case "google": {
      const baseUrl = new URL(
        ROUTE_INITIATE_LINK(
          arg.provider,
          arg.client.clientId,
          arg.authUser.authToken,
        ),
      );
      if (arg.googleOauthPrompt) {
        baseUrl.searchParams.set("prompt", arg.googleOauthPrompt);
      }
      return arg.handleOauth({
        url: baseUrl.href,
      });
    }
    case "discord": {
      const baseUrl = new URL(
        ROUTE_INITIATE_LINK(
          arg.provider,
          arg.client.clientId,
          arg.authUser.authToken,
        ),
      );
      return arg.handleOauth({
        url: baseUrl.href,
      });
    }
    case "phone":
    case "email":
    default: {
      throw new Error(`Invalid authentication provider`);
    }
  }
};

/**
 * Logs out the user. This function will alway succeed.
 * @param arg - The options for logging out the user
 * @param arg.storage - The storage options for the user's auth token
 * @example
 * ```ts
 * import { logout } from "thirdweb/wallets";
 * const storage = createAuthStorage({});
 * await logout({ storage });
 * ```
 * @returns nothing
 */
export const logout = async (arg: { storage: AuthTokenStorageType }) => {
  const { THIRDWEB_AUTH_TOKEN_KEY } = await import("./constant.js");
  const { ROUTE_LOGOUT } = await import("../routes.js");

  const token = await arg.storage.fetchToken({
    key: THIRDWEB_AUTH_TOKEN_KEY,
  });

  if (!token) {
    return await arg.storage.removeToken({
      key: THIRDWEB_AUTH_TOKEN_KEY,
    });
  }

  return await Promise.all([
    fetch(ROUTE_LOGOUT(), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
    arg.storage.removeToken({
      key: THIRDWEB_AUTH_TOKEN_KEY,
    }),
  ]);
};
