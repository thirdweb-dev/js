import type {
  AuthArgsType,
  AuthTokenStorageType,
  AuthUserType,
  InitiateAuthArgsType,
  InitiateAuthResultType,
  LinkAuthArgsType,
  MultiStepAuthArgsType,
  MultiStepAuthProviderType,
} from "./authentication.type.js";

export const createAuthStorage = ({
  fetchToken,
  storeToken,
  removeToken,
}: AuthTokenStorageType): AuthTokenStorageType => {
  return { fetchToken, storeToken, removeToken };
};

export const getAuthenticatedUser = async (arg: {
  storage: AuthTokenStorageType;
}) => {
  const { ROUTE_FETCH_USER } = await import("./routes.js");
  const { THIRDWEB_AUTH_TOKEN_KEY } = await import(
    "./authentication.constant.js"
  );

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
export const preAuthenticate = async (
  arg: InitiateAuthArgsType,
): Promise<InitiateAuthResultType> => {
  const { ROUTE_INITIATE_AUTH } = await import("./routes.js");

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

export const authenticate = async (
  arg: AuthArgsType & {
    handleOauth: (arg: { url: string }) => Promise<AuthUserType>;
  },
): Promise<AuthUserType> => {
  const { ROUTE_INITIATE_AUTH, ROUTE_COMPLETE_AUTH } = await import(
    "./routes.js"
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

export const pre2FA = async (
  arg: MultiStepAuthProviderType & { storage: AuthTokenStorageType },
): Promise<InitiateAuthResultType> => {
  const { ROUTE_INITIATE_2FA_AUTH } = await import("./routes.js");
  const { AuthenticationError } = await import("./authentication.error.js");
  const { THIRDWEB_AUTH_TOKEN_KEY } = await import(
    "./authentication.constant.js"
  );

  const token = await arg.storage.fetchToken({
    key: THIRDWEB_AUTH_TOKEN_KEY,
  });
  if (!token) {
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

export const logout = async (arg: { storage: AuthTokenStorageType }) => {
  const { THIRDWEB_AUTH_TOKEN_KEY } = await import(
    "./authentication.constant.js"
  );
  const { ROUTE_LOGOUT } = await import("./routes.js");

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
