import type { CognitoUserSession } from "amazon-cognito-identity-js";
import type { ThirdwebClient } from "../../../../../client/client.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import { getClientFetch } from "../../../../../utils/fetch.js";
import { randomBytesHex } from "../../../../../utils/random.js";
import type { UserDetailsApiType } from "../../../core/authentication/type.js";
import {
  ROUTE_EMBEDDED_WALLET_DETAILS,
  ROUTE_IS_VALID_USER_MANAGED_OTP,
  ROUTE_STORE_USER_SHARES,
  ROUTE_USER_MANAGED_OTP,
  ROUTE_VALIDATE_USER_MANAGED_OTP,
  ROUTE_VERIFY_COGNITO_OTP,
  ROUTE_VERIFY_THIRDWEB_CLIENT_ID,
  THIRDWEB_SESSION_NONCE_HEADER,
} from "../constants.js";
import { createErrorMessage } from "../errors.js";
import { getAuthTokenClient } from "../storage/local.js";
import type {
  IsValidUserManagedEmailOTPResponse,
  VerifiedTokenResponse,
} from "../types.js";

const EMBEDDED_WALLET_TOKEN_HEADER = "embedded-wallet-token";
const PAPER_CLIENT_ID_HEADER = "x-thirdweb-client-id";

let sessionNonce: Hex | undefined = undefined;

export function getSessionHeaders() {
  if (!sessionNonce) {
    sessionNonce = randomBytesHex(16);
  }
  return {
    "Content-Type": "application/json",
    [THIRDWEB_SESSION_NONCE_HEADER]: sessionNonce,
  };
}

export const verifyClientId = async (client: ThirdwebClient) => {
  const resp = await getClientFetch(client)(ROUTE_VERIFY_THIRDWEB_CLIENT_ID, {
    method: "POST",
    headers: {
      ...getSessionHeaders(),
    },
    body: JSON.stringify({ clientId: client.clientId, parentDomain: "" }),
  });
  if (!resp.ok) {
    const error = await resp.json();
    throw new Error(
      `Something went wrong generating auth token from user cognito email otp. ${error.message}`,
    );
  }
  return {
    success: true,
  };
};

export const authFetchEmbeddedWalletUser = async (
  client: ThirdwebClient,
  url: string,
  props: Parameters<typeof fetch>[1],
): Promise<Response> => {
  const authTokenClient = await getAuthTokenClient(client.clientId);
  const params = { ...props };
  params.headers = params?.headers
    ? {
        ...params.headers,
        Authorization: `Bearer ${EMBEDDED_WALLET_TOKEN_HEADER}:${
          authTokenClient || ""
        }`,
        [PAPER_CLIENT_ID_HEADER]: client.clientId,
        ...getSessionHeaders(),
      }
    : {
        Authorization: `Bearer ${EMBEDDED_WALLET_TOKEN_HEADER}:${
          authTokenClient || ""
        }`,
        [PAPER_CLIENT_ID_HEADER]: client.clientId,
        ...getSessionHeaders(),
      };
  return getClientFetch(client)(url, params);
};

export async function fetchUserDetails(args: {
  email?: string;
  client: ThirdwebClient;
}): Promise<UserDetailsApiType> {
  const url = new URL(ROUTE_EMBEDDED_WALLET_DETAILS);
  if (args) {
    if (args.email) {
      url.searchParams.append("email", args.email);
    }
    url.searchParams.append("clientId", args.client.clientId);
  }
  const resp = await authFetchEmbeddedWalletUser(args.client, url.href, {
    method: "GET",
  });
  if (!resp.ok) {
    const error = await resp.json();
    throw new Error(
      `Something went wrong determining wallet type. ${error.message}`,
    );
  }
  const result = (await resp.json()) as UserDetailsApiType;
  return result;
}

export async function generateAuthTokenFromCognitoEmailOtp(
  session: CognitoUserSession,
  clientId: string,
) {
  const resp = await fetch(ROUTE_VERIFY_COGNITO_OTP, {
    method: "POST",
    headers: {
      ...getSessionHeaders(),
    },
    body: JSON.stringify({
      access_token: session.getAccessToken().getJwtToken(),
      refresh_token: session.getRefreshToken().getToken(),
      id_token: session.getIdToken().getJwtToken(),
      developerClientId: clientId,
      otpMethod: "email",
    }),
  });
  if (!resp.ok) {
    const error = await resp.json();
    throw new Error(
      `Something went wrong generating auth token from user cognito email otp. ${error.message}`,
    );
  }
  const respJ = await resp.json();
  return respJ as VerifiedTokenResponse;
}

export async function sendUserManagedEmailOtp(email: string, clientId: string) {
  const resp = await fetch(ROUTE_USER_MANAGED_OTP, {
    method: "POST",
    headers: {
      ...getSessionHeaders(),
    },
    body: JSON.stringify({
      email,
      clientId,
    }),
  });
  if (!resp.ok) {
    const error = await resp.json();
    throw new Error(
      `Something went wrong generating auth token from user cognito email otp. ${error.message}`,
    );
  }
  const respJ = await resp.json();
  return respJ;
}

export async function validateUserManagedEmailOtp(options: {
  email: string;
  otp: string;
  clientId: string;
}) {
  const resp = await fetch(ROUTE_VALIDATE_USER_MANAGED_OTP, {
    method: "POST",
    headers: {
      ...getSessionHeaders(),
    },
    body: JSON.stringify({
      email: options.email,
      otp: options.otp,
      clientId: options.clientId,
    }),
  });
  if (!resp.ok) {
    const error = await resp.json();
    throw new Error(
      `Something went wrong generating auth token from user cognito email otp. ${error.message}`,
    );
  }
  const respJ = await resp.json();
  return respJ as VerifiedTokenResponse;
}
export async function isValidUserManagedEmailOtp(options: {
  email: string;
  otp: string;
  clientId: string;
}) {
  const resp = await fetch(ROUTE_IS_VALID_USER_MANAGED_OTP, {
    method: "POST",
    headers: {
      ...getSessionHeaders(),
    },
    body: JSON.stringify({
      email: options.email,
      otp: options.otp,
      clientId: options.clientId,
    }),
  });
  if (!resp.ok) {
    const error = await resp.json();
    throw new Error(
      `Something went wrong generating auth token from user cognito email otp. ${error.message}`,
    );
  }
  const respJ = await resp.json();
  return respJ as IsValidUserManagedEmailOTPResponse;
}

export async function storeUserShares({
  client,
  walletAddress,
  maybeEncryptedRecoveryShares,
  authShare,
}: {
  client: ThirdwebClient;
  walletAddress: string;
  maybeEncryptedRecoveryShares?: {
    share: string;
    isClientEncrypted: boolean;
  }[];
  authShare?: string;
}) {
  const resp = await authFetchEmbeddedWalletUser(
    client,
    ROUTE_STORE_USER_SHARES,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        walletAddress,
        maybeEncryptedRecoveryShares,
        authShare,
      }),
    },
  );

  if (!resp.ok) {
    const error = await resp.json();

    throw new Error(
      `Something went wrong storing user wallet shares: ${JSON.stringify(
        error.message,
        null,
        2,
      )}`,
    );
  }
}

export async function getUserShares(client: ThirdwebClient, getShareUrl: URL) {
  const resp = await authFetchEmbeddedWalletUser(client, getShareUrl.href, {
    method: "GET",
  });
  if (!resp.ok) {
    const error = await resp.json();
    throw new Error(
      `Something went wrong getting user's wallet: ${JSON.stringify(
        error.message,
        null,
        2,
      )} `,
    );
  }

  const respJ = await resp.json();
  try {
    return respJ as {
      authShare?: string;
      maybeEncryptedRecoveryShares?: string[];
    };
  } catch (e) {
    throw new Error(
      createErrorMessage("Malformed response from the ews user wallet API", e),
    );
  }
}

export async function deleteAccount(client: ThirdwebClient) {
  const url = new URL(ROUTE_EMBEDDED_WALLET_DETAILS);
  const resp = await authFetchEmbeddedWalletUser(client, url.href, {
    method: "DELETE",
  });
  if (!resp.ok) {
    const error = await resp.json();
    throw new Error(
      `Something went wrong deleting the active account: ${error.message}`,
    );
  }

  return await resp.json();
}
