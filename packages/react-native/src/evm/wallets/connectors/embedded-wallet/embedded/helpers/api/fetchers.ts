import { CognitoUserSession } from "amazon-cognito-identity-js";
import {
  ROUTE_GET_EMBEDDED_WALLET_DETAILS,
  ROUTE_STORE_USER_SHARES,
  ROUTE_VERIFY_THIRDWEB_CLIENT_ID,
  ROUTE_VERIFY_COGNITO_OTP,
  ROUTE_USER_MANAGED_OTP,
  ROUTE_VALIDATE_USER_MANAGED_OTP,
  ROUTE_IS_VALID_USER_MANAGED_OTP,
  EWS_VERSION_HEADER,
  BUNDLE_ID_HEADER,
} from "../constants";
import { getAuthTokenClient } from "../storage/local";
import {
  RecoveryShareManagement,
  UserWalletStatus,
} from "@thirdweb-dev/wallets";
import {
  IsValidUserManagedEmailOTPResponse,
  VerifiedTokenResponse,
} from "../../../types";
import { createErrorMessage } from "../errors";
import {
  appBundleId,
  reactNativePackageVersion,
} from "../../../../../../utils/version";

const EMBEDDED_WALLET_TOKEN_HEADER = "embedded-wallet-token";
const PAPER_CLIENT_ID_HEADER = "x-thirdweb-client-id";
const HEADERS = {
  "Content-Type": "application/json",
  [BUNDLE_ID_HEADER]: appBundleId,
  [EWS_VERSION_HEADER]: reactNativePackageVersion,
};

export const verifyClientId = async (clientId: string) => {
  const resp = await fetch(ROUTE_VERIFY_THIRDWEB_CLIENT_ID, {
    method: "POST",
    headers: {
      ...HEADERS,
    },
    body: JSON.stringify({ clientId, parentDomain: "" }),
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
  { clientId }: { clientId: string },
  url: Parameters<typeof fetch>[0],
  props: Parameters<typeof fetch>[1],
): Promise<Response> => {
  const authTokenClient = await getAuthTokenClient(clientId);
  const params = { ...props };
  params.headers = params?.headers
    ? {
        ...params.headers,
        Authorization: `Bearer ${EMBEDDED_WALLET_TOKEN_HEADER}:${
          authTokenClient || ""
        }`,
        [BUNDLE_ID_HEADER]: appBundleId,
        [PAPER_CLIENT_ID_HEADER]: clientId,
        [EWS_VERSION_HEADER]: reactNativePackageVersion,
      }
    : {
        Authorization: `Bearer ${EMBEDDED_WALLET_TOKEN_HEADER}:${
          authTokenClient || ""
        }`,
        [BUNDLE_ID_HEADER]: appBundleId,
        [PAPER_CLIENT_ID_HEADER]: clientId,
        [EWS_VERSION_HEADER]: reactNativePackageVersion,
      };
  return fetch(url, params);
};

export async function getEmbeddedWalletUserDetail(args: {
  email?: string;
  clientId: string;
}) {
  const url = new URL(ROUTE_GET_EMBEDDED_WALLET_DETAILS);
  if (args) {
    if (args.email) {
      url.searchParams.append("email", args.email);
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
    const error = await resp.json();
    throw new Error(
      `Something went wrong determining wallet type. ${error.message}`,
    );
  }
  const result = (await resp.json()) as
    | {
        isNewUser: true;
        recoveryShareManagement: RecoveryShareManagement;
        status: UserWalletStatus;
        walletUserId: string;
      }
    | {
        isNewUser: false;
        walletUserId: string;
        recoveryShareManagement: RecoveryShareManagement;
        status: UserWalletStatus;
      };
  return result;
}

export async function generateAuthTokenFromCognitoEmailOtp(
  session: CognitoUserSession,
  clientId: string,
) {
  const resp = await fetch(ROUTE_VERIFY_COGNITO_OTP, {
    method: "POST",
    headers: {
      ...HEADERS,
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
      ...HEADERS,
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
      ...HEADERS,
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
      ...HEADERS,
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

export async function getUserShares(clientId: string, getShareUrl: URL) {
  const resp = await authFetchEmbeddedWalletUser(
    { clientId },
    getShareUrl.href,
    {
      method: "GET",
    },
  );
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
