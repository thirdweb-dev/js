import { client } from "@passwordless-id/webauthn";
import type { AuthType } from "@passwordless-id/webauthn/dist/esm/types.js";
import type { ThirdwebClient } from "../../../../../client/client.js";
import { getThirdwebBaseUrl } from "../../../../../utils/domains.js";
import { getClientFetch } from "../../../../../utils/fetch.js";
import type { AuthStoredTokenWithCookieReturnType } from "../../interfaces/auth.js";
import { LocalStorage } from "../../utils/Storage/LocalStorage.js";

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

export async function registerPasskey(options: {
  client: ThirdwebClient;
  authenticatorType?: AuthType;
  username?: string;
}): Promise<AuthStoredTokenWithCookieReturnType> {
  if (!client.isAvailable()) {
    throw new Error("Passkeys are not available on this device");
  }
  // TODO inject this
  const storage = new LocalStorage({ clientId: options.client.clientId });
  const fetchWithId = getClientFetch(options.client);
  const generatedName = options.username ?? generateUsername();
  // 1. request challenge from  server
  const res = await fetchWithId(getChallengePath("sign-up", generatedName));
  const challengeData = await res.json();
  if (!challengeData.challenge) {
    throw new Error("No challenge received");
  }
  const challenge = challengeData.challenge;
  // 2. initiate registration
  const registration = await client.register(generatedName, challenge, {
    authenticatorType: options.authenticatorType ?? "auto",
    userVerification: "required",
    attestation: true,
    debug: false,
  });
  // 3. store the credentialId in local storage
  await storage.savePasskeyCredentialId(registration.credential.id);

  // 4. send the registration object to the server
  const verifRes = await fetchWithId(getVerificationPath(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      type: "sign-up",
      authenticatorData: registration.authenticatorData,
      credentialId: registration.credential.id,
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
  authenticatorType?: AuthType;
}): Promise<AuthStoredTokenWithCookieReturnType> {
  if (!client.isAvailable()) {
    throw new Error("Passkeys are not available on this device");
  }
  // TODO inject this
  const storage = new LocalStorage({ clientId: options.client.clientId });
  const fetchWithId = getClientFetch(options.client);
  // 1. request challenge from  server/iframe
  const res = await fetchWithId(getChallengePath("sign-in"));
  const challengeData = await res.json();
  if (!challengeData.challenge) {
    throw new Error("No challenge received");
  }
  const challenge = challengeData.challenge;
  // 1.2. find the user's credentialId in local storage
  const credentialId = await storage.getPasskeyCredentialId();
  const credentials = credentialId ? [credentialId] : [];
  // 2. initiate login
  const authentication = await client.authenticate(credentials, challenge, {
    authenticatorType: options.authenticatorType ?? "auto",
    userVerification: "required",
  });
  // 3. send the authentication object to the server/iframe
  const verifRes = await fetchWithId(getVerificationPath(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
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

/**
 * Returns whether this device has a stored passkey ready to be used for sign-in
 * @param client - the thirdweb client
 * @returns whether the device has a stored passkey
 */
export async function hasStoredPasskey(client: ThirdwebClient) {
  const storage = new LocalStorage({ clientId: client.clientId });
  const credId = await storage.getPasskeyCredentialId();
  return !!credId;
}

function generateUsername() {
  return `wallet-${new Date().toISOString()}`;
}
