import type { ThirdwebClient } from "../../../../client/client.js";
import { getThirdwebBaseUrl } from "../../../../utils/domains.js";
import { getClientFetch } from "../../../../utils/fetch.js";
import { stringify } from "../../../../utils/json.js";
import type { Ecosystem } from "../wallet/types.js";
import type { ClientScopedStorage } from "./client-scoped-storage.js";
import type { AuthStoredTokenWithCookieReturnType } from "./types.js";

function getVerificationPath() {
  return `${getThirdwebBaseUrl(
    "inAppWallet",
  )}/api/2024-05-05/login/passkey/callback`;
}
function getChallengePath(type: "sign-in" | "sign-up", username?: string) {
  return `${getThirdwebBaseUrl(
    "inAppWallet",
  )}/api/2024-05-05/login/passkey?type=${type}${
    username ? `&username=${username}` : ""
  }`;
}

export type RegisterResult = {
  authenticatorData: string;
  credentialId: string;
  clientData: string;
  credential: {
    publicKey: string;
    algorithm: string;
  };
  origin: string;
};

export type AuthenticateResult = {
  credentialId: string;
  authenticatorData: string;
  clientData: string;
  signature: string;
  origin: string;
};

export type RpInfo = { name: string; id: string };

export interface PasskeyClient {
  register: (args: {
    name: string;
    challenge: string;
    rp: RpInfo;
  }) => Promise<RegisterResult>;
  authenticate: (args: {
    credentialId: string | undefined;
    challenge: string;
    rp: RpInfo;
  }) => Promise<AuthenticateResult>;
  isAvailable: () => boolean;
}

export async function registerPasskey(options: {
  client: ThirdwebClient;
  passkeyClient: PasskeyClient;
  storage?: ClientScopedStorage;
  ecosystem?: Ecosystem;
  username?: string;
  rp: RpInfo;
}): Promise<AuthStoredTokenWithCookieReturnType> {
  if (!options.passkeyClient.isAvailable()) {
    throw new Error("Passkeys are not available on this device");
  }
  const fetchWithId = getClientFetch(options.client, options.ecosystem);
  const generatedName = options.username ?? generateUsername(options.ecosystem);
  // 1. request challenge from  server
  const res = await fetchWithId(getChallengePath("sign-up", generatedName));
  const challengeData = await res.json();
  if (!challengeData.challenge) {
    throw new Error("No challenge received");
  }
  const challenge = challengeData.challenge;

  // 2. initiate registration
  const registration = await options.passkeyClient.register({
    challenge,
    name: generatedName,
    rp: options.rp,
  });

  const customHeaders: Record<string, string> = {};
  if (options.ecosystem?.partnerId) {
    customHeaders["x-ecosystem-partner-id"] = options.ecosystem.partnerId;
  }
  if (options.ecosystem?.id) {
    customHeaders["x-ecosystem-id"] = options.ecosystem.id;
  }

  // 3. send the registration object to the server
  const verifRes = await fetchWithId(getVerificationPath(), {
    body: stringify({
      authenticatorData: registration.authenticatorData,
      clientData: registration.clientData,
      credential: {
        algorithm: registration.credential.algorithm,
        publicKey: registration.credential.publicKey,
      },
      credentialId: registration.credentialId,
      origin: registration.origin,
      rpId: options.rp.id,
      serverVerificationId: challengeData.serverVerificationId,
      type: "sign-up",
      username: generatedName,
    }),
    headers: {
      "Content-Type": "application/json",
      ...customHeaders,
    },
    method: "POST",
  });
  const verifData = await verifRes.json();

  if (!verifData || !verifData.storedToken) {
    throw new Error(
      `Error verifying passkey: ${verifData.message ?? "unknown error"}`,
    );
  }
  // 4. store the credentialId in local storage
  await options.storage?.savePasskeyCredentialId(registration.credentialId);

  // 5. returns back the IAW authentication token
  return verifData;
}

export async function loginWithPasskey(options: {
  client: ThirdwebClient;
  passkeyClient: PasskeyClient;
  rp: RpInfo;
  storage?: ClientScopedStorage;
  ecosystem?: Ecosystem;
}): Promise<AuthStoredTokenWithCookieReturnType> {
  if (!options.passkeyClient.isAvailable()) {
    throw new Error("Passkeys are not available on this device");
  }
  const fetchWithId = getClientFetch(options.client, options.ecosystem);
  // 1. request challenge from  server/iframe
  const [challengeData, credentialId] = await Promise.all([
    fetchWithId(getChallengePath("sign-in")).then((r) => r.json()),
    options.storage?.getPasskeyCredentialId(),
  ]);
  if (!challengeData.challenge) {
    throw new Error("No challenge received");
  }
  const challenge = challengeData.challenge;
  // 2. initiate login
  const authentication = await options.passkeyClient.authenticate({
    challenge,
    credentialId: credentialId ?? undefined,
    rp: options.rp,
  });

  const customHeaders: Record<string, string> = {};
  if (options.ecosystem?.partnerId) {
    customHeaders["x-ecosystem-partner-id"] = options.ecosystem.partnerId;
  }
  if (options.ecosystem?.id) {
    customHeaders["x-ecosystem-id"] = options.ecosystem.id;
  }

  const verifRes = await fetchWithId(getVerificationPath(), {
    body: stringify({
      authenticatorData: authentication.authenticatorData,
      clientData: authentication.clientData,
      credentialId: authentication.credentialId,
      origin: authentication.origin,
      rpId: options.rp.id,
      serverVerificationId: challengeData.serverVerificationId,
      signature: authentication.signature,
      type: "sign-in",
    }),
    headers: {
      "Content-Type": "application/json",
      ...customHeaders,
    },
    method: "POST",
  });

  const verifData = await verifRes.json();

  if (!verifData || !verifData.storedToken) {
    throw new Error(
      `Error verifying passkey: ${verifData.message ?? "unknown error"}`,
    );
  }

  // 5. store the credentialId in local storage
  await options.storage?.savePasskeyCredentialId(authentication.credentialId);

  // 6. return the auth'd user type
  return verifData;
}

function generateUsername(ecosystem?: Ecosystem) {
  return `${ecosystem?.id ?? "wallet"}-${new Date().toISOString()}`;
}
