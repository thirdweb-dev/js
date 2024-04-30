import { client } from "@passwordless-id/webauthn";
import type { ThirdwebClient } from "../../../../../client/client.js";
import type { AsyncStorage } from "../../../../storage/AsyncStorage.js";

async function registerPasskey(options: {
  client: ThirdwebClient;
  storage: AsyncStorage;
  authenticatorType?: string;
  username?: string;
}) {
  if (!client.isAvailable()) {
    throw new Error("Passkeys are not available on this device");
  }
  // 1. request challenge from  server
  // TODO enpoint to req challenge

  const challenge = "a7c61ef9-dc23-4806-b486-2428938a547e";
  // 2. initiate registration
  const generatedName =
    options.username ?? `in-app-wallet-${options.client.clientId}`;
  const registration = await client.register(generatedName, challenge, {
    authenticatorType: "roaming",
    userVerification: "required",
    attestation: true,
    debug: false,
  });
  // 3. store the credentialId in local storage
  await options.storage.setItem(
    `in-app-wallet-credential-id-${options.client.clientId}`,
    registration.credential.id,
  );

  // 4. send the registration object to the server
  // TODO endpoint to send registration data

  // 5. returns back the IAW authentication token
  // 6. pass it to the iframe and call postLogin to store the auth token

  return registration;
}

async function loginWithPasskey(options: {
  client: ThirdwebClient;
  storage: AsyncStorage;
}) {
  if (!client.isAvailable()) {
    throw new Error("Passkeys are not available on this device");
  }
  // 1. request challenge from  server/iframe
  const challenge = "a7c61ef9-dc23-4806-b486-2428938a547e";
  // 1.2. find the user's credentialId in local storage
  const credentialId = await options.storage.getItem(
    `in-app-wallet-credential-id-${options.client.clientId}`,
  );
  const credentials = credentialId ? [credentialId] : [];
  // 2. initiate login
  const authentication = await client.authenticate(credentials, challenge, {
    authenticatorType: "roaming",
    userVerification: "required",
  });
  // 3. send the authentication object to the server/iframe
  return authentication;
}
