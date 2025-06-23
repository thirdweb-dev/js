import type { ThirdwebClient } from "../../../../../client/client.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import { getClientFetch } from "../../../../../utils/fetch.js";
import { stringify } from "../../../../../utils/json.js";
import { randomBytesHex } from "../../../../../utils/random.js";
import type { ClientScopedStorage } from "../../../core/authentication/client-scoped-storage.js";
import type { UserDetailsApiType } from "../../../core/authentication/types.js";
import {
  ROUTE_EMBEDDED_WALLET_DETAILS,
  ROUTE_STORE_USER_SHARES,
  ROUTE_VERIFY_THIRDWEB_CLIENT_ID,
  THIRDWEB_SESSION_NONCE_HEADER,
} from "../constants.js";
import { createErrorMessage } from "../errors.js";

const EMBEDDED_WALLET_TOKEN_HEADER = "embedded-wallet-token";
const PAPER_CLIENT_ID_HEADER = "x-thirdweb-client-id";
const ECOSYSTEM_ID_HEADER = "x-ecosystem-id";
const ECOSYSTEM_PARTNER_ID_HEADER = "x-ecosystem-partner-id";

let sessionNonce: Hex | undefined;

function getSessionHeaders() {
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
    body: stringify({ clientId: client.clientId, parentDomain: "" }),
    headers: {
      ...getSessionHeaders(),
    },
    method: "POST",
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

export async function authFetchEmbeddedWalletUser(args: {
  client: ThirdwebClient;
  url: string;
  props: Parameters<typeof fetch>[1];
  storage: ClientScopedStorage;
  retries?: number;
}): Promise<Response> {
  const { client, url, props, storage, retries = 0 } = args;
  const authTokenClient = await storage.getAuthCookie();
  const params = { ...props };
  params.headers = params?.headers
    ? {
        ...params.headers,
        Authorization: `Bearer ${EMBEDDED_WALLET_TOKEN_HEADER}:${
          authTokenClient || ""
        }`,
        [PAPER_CLIENT_ID_HEADER]: client.clientId,
        ...(storage.ecosystem
          ? {
              [ECOSYSTEM_ID_HEADER]: storage.ecosystem.id,
              [ECOSYSTEM_PARTNER_ID_HEADER]: storage.ecosystem?.partnerId,
            }
          : {}),
        ...getSessionHeaders(),
      }
    : {
        Authorization: `Bearer ${EMBEDDED_WALLET_TOKEN_HEADER}:${
          authTokenClient || ""
        }`,
        [PAPER_CLIENT_ID_HEADER]: client.clientId,
        ...(storage.ecosystem
          ? {
              [ECOSYSTEM_ID_HEADER]: storage.ecosystem.id,
              [ECOSYSTEM_PARTNER_ID_HEADER]: storage.ecosystem?.partnerId,
            }
          : {}),
        ...getSessionHeaders(),
      };

  try {
    return await getClientFetch(client)(url, params);
  } catch (e) {
    if (retries > 0) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return await authFetchEmbeddedWalletUser({
        client,
        props: params,
        retries: retries - 1,
        storage,
        url,
      });
    }
    throw e;
  }
}

export async function fetchUserDetails(args: {
  email?: string;
  client: ThirdwebClient;
  storage: ClientScopedStorage;
}): Promise<UserDetailsApiType> {
  const url = new URL(ROUTE_EMBEDDED_WALLET_DETAILS);
  if (args) {
    // TODO (inapp) remove this, unused in the backend but still required
    url.searchParams.append("email", args.email ?? "none");
    url.searchParams.append("clientId", args.client.clientId);
  }
  const resp = await authFetchEmbeddedWalletUser({
    client: args.client,
    props: {
      method: "GET",
    },
    storage: args.storage,
    url: url.href,
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

export async function storeUserShares({
  client,
  walletAddress,
  maybeEncryptedRecoveryShares,
  authShare,
  storage,
}: {
  client: ThirdwebClient;
  walletAddress: string;
  maybeEncryptedRecoveryShares?: {
    share: string;
    isClientEncrypted: boolean;
  }[];
  authShare?: string;
  storage: ClientScopedStorage;
}) {
  const resp = await authFetchEmbeddedWalletUser({
    client,
    props: {
      body: stringify({
        authShare,
        maybeEncryptedRecoveryShares,
        walletAddress,
      }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    },
    storage,
    url: ROUTE_STORE_USER_SHARES,
  });

  if (!resp.ok) {
    const error = await resp.json();

    throw new Error(
      `Something went wrong storing user wallet shares: ${stringify(
        error.message,
        null,
        2,
      )}`,
    );
  }
}

export async function getUserShares(args: {
  client: ThirdwebClient;
  getShareUrl: URL;
  storage: ClientScopedStorage;
}) {
  const resp = await authFetchEmbeddedWalletUser({
    client: args.client,
    props: {
      method: "GET",
    },
    storage: args.storage,
    url: args.getShareUrl.href,
  });
  if (!resp.ok) {
    const error = await resp.json();
    throw new Error(
      `Something went wrong getting user's wallet: ${stringify(
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

export async function deleteAccount(args: {
  client: ThirdwebClient;
  storage: ClientScopedStorage;
}) {
  const url = new URL(ROUTE_EMBEDDED_WALLET_DETAILS);
  const resp = await authFetchEmbeddedWalletUser({
    client: args.client,
    props: {
      method: "DELETE",
    },
    storage: args.storage,
    url: url.href,
  });
  if (!resp.ok) {
    const error = await resp.json();
    throw new Error(
      `Something went wrong deleting the active account: ${error.message}`,
    );
  }

  return await resp.json();
}
