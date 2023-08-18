import {
  AuthProvider,
  RecoveryShareManagement,
} from "@paperxyz/embedded-wallet-service-sdk";
import { CognitoUserSession } from "amazon-cognito-identity-js";
import { getAuthShareClient } from "../storage/local";
import {
  BASE_URL,
  ROUTE_GET_EMBEDDED_WALLET_DETAILS,
  ROUTE_VERIFY_COGNITO_OTP,
} from "./routes";

const EMBEDDED_WALLET_TOKEN = "embedded-wallet-token";
const PAPER_CLIENT_ID_HEADER = "x-paper-client-id";

export const authFetchEmbeddedWalletUser = async (
  { clientId }: { clientId: string },
  url: Parameters<typeof fetch>[0],
  props: Parameters<typeof fetch>[1],
): Promise<Response> => {
  const authShareClient = await getAuthShareClient(clientId);
  const params = { ...props };
  params.headers = params?.headers
    ? {
        ...params.headers,
        Authorization: `Bearer ${EMBEDDED_WALLET_TOKEN}:${
          authShareClient || ""
        }`,
        [PAPER_CLIENT_ID_HEADER]: clientId,
      }
    : {
        Authorization: `Bearer ${EMBEDDED_WALLET_TOKEN}:${
          authShareClient || ""
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
  const url = new URL(ROUTE_GET_EMBEDDED_WALLET_DETAILS, BASE_URL);
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
