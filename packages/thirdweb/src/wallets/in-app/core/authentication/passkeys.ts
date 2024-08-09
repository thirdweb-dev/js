import type { AuthType } from "@passwordless-id/webauthn/dist/esm/types.js";
import type { ThirdwebClient } from "../../../../client/client.js";
import { getThirdwebBaseUrl } from "../../../../utils/domains.js";
import { getClientFetch } from "../../../../utils/fetch.js";
import type { AsyncStorage } from "../../../../utils/storage/AsyncStorage.js";
import type { Ecosystem } from "../../web/types.js";
import { LocalStorage } from "../../web/utils/Storage/LocalStorage.js";
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
};

export type AuthenticateResult = {
  credentialId: string;
  authenticatorData: string;
  clientData: string;
  signature: string;
};

export interface PasskeyClient {
  register: (name: string, challenge: string) => Promise<RegisterResult>;
  authenticate: (
    credentialId: string | undefined,
    challenge: string,
  ) => Promise<AuthenticateResult>;
  isAvailable: () => boolean;
}

export async function registerPasskey(options: {
  client: ThirdwebClient;
  storage: AsyncStorage;
  passkeyClient: PasskeyClient;
  ecosystem?: Ecosystem;
  username?: string;
}): Promise<AuthStoredTokenWithCookieReturnType> {
  if (!options.passkeyClient.isAvailable()) {
    throw new Error("Passkeys are not available on this device");
  }
  const storage = new LocalStorage({
    storage: options.storage,
    clientId: options.client.clientId,
    ecosystemId: options.ecosystem?.id,
  });
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
  const registration = await options.passkeyClient.register(
    generatedName,
    challenge,
  );
  // 3. store the credentialId in local storage
  await storage.savePasskeyCredentialId(registration.credentialId);

  const customHeaders: Record<string, string> = {};
  if (options.ecosystem?.partnerId) {
    customHeaders["x-ecosystem-partner-id"] = options.ecosystem.partnerId;
  }
  if (options.ecosystem?.id) {
    customHeaders["x-ecosystem-id"] = options.ecosystem.id;
  }

  // 4. send the registration object to the server
  const verifRes = await fetchWithId(getVerificationPath(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...customHeaders,
    },
    body: JSON.stringify({
      type: "sign-up",
      authenticatorData: registration.authenticatorData,
      credentialId: registration.credentialId,
      serverVerificationId: challengeData.serverVerificationId,
      clientData: registration.clientData,
      username: generatedName,
      credential: {
        publicKey: registration.credential.publicKey,
        algorithm: registration.credential.algorithm,
      },
    }),
  });
  const verifData = await verifRes.json();

  if (!verifData) {
    throw new Error("No token received");
  }
  // 5. returns back the IAW authentication token
  return verifData;
}

export async function loginWithPasskey(options: {
  client: ThirdwebClient;
  storage: AsyncStorage;
  passkeyClient: PasskeyClient;
  ecosystem?: Ecosystem;
  authenticatorType?: AuthType;
}): Promise<AuthStoredTokenWithCookieReturnType> {
  if (!options.passkeyClient.isAvailable()) {
    throw new Error("Passkeys are not available on this device");
  }
  const storage = new LocalStorage({
    storage: options.storage,
    clientId: options.client.clientId,
    ecosystemId: options.ecosystem?.id,
  });
  const fetchWithId = getClientFetch(options.client, options.ecosystem);
  // 1. request challenge from  server/iframe
  const res = await fetchWithId(getChallengePath("sign-in"));
  const challengeData = await res.json();
  if (!challengeData.challenge) {
    throw new Error("No challenge received");
  }
  const challenge = challengeData.challenge;
  // 1.2. find the user's credentialId in local storage
  const credentialId = (await storage.getPasskeyCredentialId()) ?? undefined;
  // 2. initiate login
  const authentication = await options.passkeyClient.authenticate(
    credentialId,
    challenge,
  );

  const customHeaders: Record<string, string> = {};
  if (options.ecosystem?.partnerId) {
    customHeaders["x-ecosystem-partner-id"] = options.ecosystem.partnerId;
  }
  if (options.ecosystem?.id) {
    customHeaders["x-ecosystem-id"] = options.ecosystem.id;
  }

  // 3. send the authentication object to the server/iframe
  const verifRes = await fetchWithId(getVerificationPath(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...customHeaders,
    },
    body: JSON.stringify({
      type: "sign-in",
      authenticatorData: authentication.authenticatorData,
      credentialId: authentication.credentialId,
      serverVerificationId: challengeData.serverVerificationId,
      clientData: authentication.clientData,
      signature: authentication.signature,
    }),
  });
  // 5. store the credentialId in local storage
  await storage.savePasskeyCredentialId(authentication.credentialId);

  const verifData = await verifRes.json();

  if (!verifData) {
    throw new Error("No token received");
  }
  // 6. return the auth'd user type
  return verifData;
}

function generateUsername(ecosystem?: Ecosystem) {
  return `${ecosystem?.id ?? "wallet"}-${new Date().toISOString()}`;
}
