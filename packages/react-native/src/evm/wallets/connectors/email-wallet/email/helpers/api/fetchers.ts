import {
  AuthProvider,
  RecoveryShareManagement,
} from "@paperxyz/embedded-wallet-service-sdk";
import { CognitoUserSession } from "amazon-cognito-identity-js";
import {
  ROUTE_GET_EMBEDDED_WALLET_DETAILS,
  ROUTE_INIT_RECOVERY_CODE_FREE_WALLET,
  ROUTE_STORE_USER_SHARES,
  ROUTE_VERIFY_COGNITO_OTP,
} from "../constants";
import { getAuthTokenClient } from "../storage/local";

const EMBEDDED_WALLET_TOKEN = "embedded-wallet-token";
const PAPER_CLIENT_ID_HEADER = "x-paper-client-id";

export const authFetchEmbeddedWalletUser = async (
  { clientId }: { clientId: string },
  url: Parameters<typeof fetch>[0],
  props: Parameters<typeof fetch>[1],
): Promise<Response> => {
  const authTokenClient = await getAuthTokenClient(clientId);
  console.log("url being called", url);
  console.log("authTokenClient", authTokenClient?.slice(0, 10));
  const params = { ...props };
  params.headers = params?.headers
    ? {
        ...params.headers,
        Authorization: `Bearer ${EMBEDDED_WALLET_TOKEN}:${
          authTokenClient || ""
        }`,
        [PAPER_CLIENT_ID_HEADER]: clientId,
      }
    : {
        Authorization: `Bearer ${EMBEDDED_WALLET_TOKEN}:${
          authTokenClient || ""
        }`,
        [PAPER_CLIENT_ID_HEADER]: clientId,
      };
  return fetch(url, params);
};

export async function getEmbeddedWalletUserDetail(args: {
  email?: string;
  userWalletId?: string;
  clientId: string;
}) {
  const url = new URL(ROUTE_GET_EMBEDDED_WALLET_DETAILS);
  if (args) {
    if (args.email) {
      url.searchParams.append("email", args.email);
    }
    if (args.userWalletId) {
      url.searchParams.append("userWalletId", args.userWalletId);
    }
    url.searchParams.append("clientId", args.clientId);
  }
  const resp = await authFetchEmbeddedWalletUser(
    { clientId: args.clientId },
    url.href,
    {
      method: "GET",
    },
  );
  if (!resp.ok) {
    const { error } = await resp.json();
    throw new Error(`Something went wrong determining wallet type. ${error}`);
  }
  const result = (await resp.json()) as
    | {
        isNewUser: true;
      }
    | {
        isNewUser: false;
        walletUserId: string;
        recoveryShareManagement: RecoveryShareManagement;
      };
  return result;
}

export async function generateAuthTokenFromCognitoEmailOtp(
  session: CognitoUserSession,
  clientId: string,
) {
  const resp = await fetch(ROUTE_VERIFY_COGNITO_OTP, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      access_token: session.getAccessToken().getJwtToken(),
      refresh_token: session.getRefreshToken().getToken(),
      id_token: session.getIdToken().getJwtToken(),
      developerClientId: clientId,
      otpMethod: "email",
      recoveryShareManagement: RecoveryShareManagement.AWS_MANAGED,
    }),
  });
  if (!resp.ok) {
    const { error } = await resp.json();
    throw new Error(
      `Something went wrong generating auth token from user cognito email otp. ${error}`,
    );
  }
  return (await resp.json()) as {
    verifiedToken: {
      rawToken: string;
      authDetails: {
        email?: string;
        userWalletId: string;
        recoveryCode?: string;
        recoveryShareManagement: RecoveryShareManagement;
      };
      authProvider: AuthProvider;
      userId: string;
      developerClientId: string;
      isNewUser: boolean;
    };
    verifiedTokenJwtString: string;
  };
}

export async function initWalletWithoutRecoveryCode({
  clientId,
}: {
  clientId: string;
}) {
  const resp = await authFetchEmbeddedWalletUser(
    { clientId },
    ROUTE_INIT_RECOVERY_CODE_FREE_WALLET,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clientId,
      }),
    },
  );
  if (!resp.ok) {
    const { error } = await resp.json();
    console.error(`Error initializing wallet: ${error} `);
    return { success: false };
  }

  return { success: true };
}

export async function storeUserShares({
  clientId,
  walletAddress,
  maybeEncryptedRecoveryShares,
  authShare,
}: {
  clientId: string;
  walletAddress: string;
  maybeEncryptedRecoveryShares?: {
    share: string;
    isClientEncrypted: boolean;
  }[];
  authShare?: string;
}) {
  const resp = await authFetchEmbeddedWalletUser(
    { clientId },
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
    const { error } = await resp.json();
    throw new Error(
      `Something went wrong storing user wallet shares: ${JSON.stringify(
        error,
        null,
        2,
      )}`,
    );
  }
}

export async function getUserShares(clientId: string, getShareUrl: URL) {
  const resp = await authFetchEmbeddedWalletUser(
    { clientId },
    getShareUrl.href,
    {
      method: "GET",
    },
  );
  if (!resp.ok) {
    const { error } = await resp.json();
    throw new Error(
      `Something went wrong getting user's wallet: ${JSON.stringify(
        error,
        null,
        2,
      )} `,
    );
  }

  try {
    return (await resp.json()) as {
      authShare?: string;
      maybeEncryptedRecoveryShares?: string[];
    };
  } catch (e) {
    throw new Error(
      `Malformed response from the ews user wallet API: ${JSON.stringify(e)}`,
    );
  }
}
