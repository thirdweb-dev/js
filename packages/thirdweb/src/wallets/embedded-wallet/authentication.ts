import type {
  AuthArgsType,
  AuthResultType,
  AuthTokenStorageType,
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

export const createAuthClient = ({
  fetchToken,
  storeToken,
}: AuthTokenStorageType): AuthTokenStorageType => {
  return { fetchToken, storeToken };
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
  arg: MultiStepAuthProviderType,
): Promise<InitiateAuthResultType> => {
  switch (arg.provider) {
    case "email": {
      const { email } = arg;
      const resp = await fetch(ROUTE_INITIATE_AUTH(arg.provider), {
        method: "POST",
        body: JSON.stringify({
          email,
        }),
      });
      const result = await resp.json();
      return result as InitiateAuthResultType;
    }
    case "phone": {
      const { phone } = arg;
      const resp = await fetch(ROUTE_INITIATE_AUTH(arg.provider), {
        method: "POST",
        body: JSON.stringify({
          phone,
        }),
      });
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
  const oauthListener = new Promise<AuthResultType>((res, rej) => {
    const authSuccessListener = async (event: MessageEvent) => {
      console.log("event.origin", event.origin);
      console.log("getBaseUrl()", getBaseUrl());
      if (event.data.eventType === "oauthSuccessResult") {
        window.removeEventListener("message", authSuccessListener);
        const authResult = event.data.authResult as AuthResultType;
        await arg.storage.storeToken({
          key: THIRDWEB_AUTH_TOKEN_KEY,
          value: authResult.authToken,
        });
        res(authResult);
      } else if (event.data.eventType === "oauthFailureResult") {
        window.removeEventListener("message", authSuccessListener);
        const error = event.data.error as Error;
        rej(error);
      }
    };
    window.addEventListener("message", authSuccessListener);
  });
  switch (arg.provider) {
    case "discord":
    case "google": {
      openPopUp(ROUTE_INITIATE_AUTH(arg.provider));
      return oauthListener;
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
