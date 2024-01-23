import {
  AuthenticationError,
  USER_ABORT_AUTHENTICATION_ERROR_MESSAGE,
  UserAbortError,
} from "./authentication.error.js";
import type {
  AuthArgsType,
  AuthResultType,
  AuthTokenStorageType,
  InitiateAuthArgsType,
  InitiateAuthResultType,
  LinkAuthArgsType,
  MultiStepAuthArgsType,
  MultiStepAuthProviderType,
} from "./authentication.type.js";
import { openPopUp } from "./authentication.utils.js";
import { getBaseUrl } from "./base-url.js";
import {
  ROUTE_COMPLETE_AUTH,
  ROUTE_FETCH_USER,
  ROUTE_INITIATE_2FA_AUTH,
  ROUTE_INITIATE_AUTH,
} from "./routes.js";

const THIRDWEB_AUTH_TOKEN_KEY = "thirdweb-auth-token";

export const createAuthStorage = ({
  fetchToken,
  storeToken,
}: AuthTokenStorageType): AuthTokenStorageType => {
  return { fetchToken, storeToken };
};
export const createAuthLocalStorage = () => {
  return createAuthStorage({
    fetchToken: ({ key }) => {
      return localStorage.getItem(key) ?? undefined;
    },
    storeToken: async ({ key, value }) => {
      localStorage.setItem(key, value);
    },
  });
};

export const getAuthenticatedUser = async (arg: {
  storage: AuthTokenStorageType;
}) => {
  const token = await arg.storage.fetchToken({ key: THIRDWEB_AUTH_TOKEN_KEY });
  if (!token) {
    return undefined;
  }

  const userResp = await fetch(ROUTE_FETCH_USER, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const user = (await userResp.json()) as AuthResultType;

  // store the refreshed token
  await arg.storage.storeToken({
    key: THIRDWEB_AUTH_TOKEN_KEY,
    value: user.authToken,
  });

  return user;
};

// for 2 step Auth
export const preAuthenticate = async (
  arg: InitiateAuthArgsType,
): Promise<InitiateAuthResultType> => {
  switch (arg.provider) {
    case "email": {
      const { email } = arg;
      const resp = await fetch(
        ROUTE_INITIATE_AUTH(
          arg.provider,
          arg.client.clientId,
          arg.config?.autoLinkAccount,
        ),
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
        ROUTE_INITIATE_AUTH(
          arg.provider,
          arg.client.clientId,
          arg.config?.autoLinkAccount,
        ),
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

export const authenticate = async (
  arg: AuthArgsType,
): Promise<AuthResultType> => {
  const oauthListener = (popup: Window | null) =>
    new Promise<AuthResultType>((res, rej) => {
      const interval = setInterval(() => {
        if (popup?.closed) {
          clearInterval(interval);
          rej(new UserAbortError());
        }
      }, 1000); // 1 second

      const authSuccessListener = async (event: MessageEvent) => {
        if (event.origin !== getBaseUrl()) {
          return;
        }
        if (event.data.eventType === "oauthSuccessResult") {
          window.removeEventListener("message", authSuccessListener);
          const authResult = event.data.authResult as AuthResultType;
          await arg.storage.storeToken({
            key: THIRDWEB_AUTH_TOKEN_KEY,
            value: authResult.authToken,
          });
          popup?.close();
          res(authResult);
        } else if (event.data.eventType === "oauthFailureResult") {
          window.removeEventListener("message", authSuccessListener);
          popup?.close();
          const errorString = event.data.errorString as string;
          if (errorString === USER_ABORT_AUTHENTICATION_ERROR_MESSAGE) {
            return rej(new UserAbortError());
          }
          rej(new AuthenticationError(errorString));
        }
      };
      window.addEventListener("message", authSuccessListener);
    });
  switch (arg.provider) {
    case "discord": {
      const popup = openPopUp(
        ROUTE_INITIATE_AUTH(
          arg.provider,
          arg.client.clientId,
          arg.config?.autoLinkAccount,
        ),
        "width=450,height=600",
      );
      return oauthListener(popup);
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
      console.log("baseUrl.href", baseUrl.href);
      const popup = openPopUp(baseUrl.href);
      return oauthListener(popup);
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
      return result as AuthResultType;
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
      return result as AuthResultType;
    }
    default: {
      throw new Error(`Invalid authentication provider`);
    }
  }
};

export const pre2FA = async (
  arg: MultiStepAuthProviderType & { storage: AuthTokenStorageType },
): Promise<InitiateAuthResultType> => {
  switch (arg.provider) {
    case "email": {
      const { email } = arg;
      const resp = await fetch(ROUTE_INITIATE_2FA_AUTH(arg.provider), {
        method: "POST",
        body: JSON.stringify({
          email,
        }),
        headers: {
          Authorization: `Bearer ${await arg.storage.fetchToken({
            key: THIRDWEB_AUTH_TOKEN_KEY,
          })}`,
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
          Authorization: `Bearer ${await arg.storage.fetchToken({
            key: THIRDWEB_AUTH_TOKEN_KEY,
          })}`,
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

export const confirm2FA = async (
  arg: MultiStepAuthArgsType & { storage: AuthTokenStorageType },
) => {
  // TODO: Implement
  console.log("arg", arg);
};

export const preLinkAuthentication = async (
  arg: MultiStepAuthProviderType,
): Promise<InitiateAuthResultType> => {
  console.log("arg", arg);
  return {
    initiationType: "link",
    ...arg,
  };
};

export const linkAuthentication = (arg: LinkAuthArgsType) => {
  // TODO: Implement
  console.log("arg", arg);
};
