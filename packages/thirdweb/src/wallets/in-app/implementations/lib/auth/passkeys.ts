import { client } from "@passwordless-id/webauthn";
import type { ThirdwebClient } from "../../../../../client/client.js";
import type { AsyncStorage } from "../../../../storage/AsyncStorage.js";

async function registerPasskey(options: {
  client: ThirdwebClient;
  storage: AsyncStorage;
}) {
  if (!client.isAvailable()) {
    throw new Error("Passkeys are not available on this device");
  }
  // 1. request challenge from  server/iframe
  const challenge = "a7c61ef9-dc23-4806-b486-2428938a547e";
  // 2. initiate registration
  const generatedName = `in-app-wallet-${options.client.clientId}`;
  const registration = await client.register(generatedName, challenge, {
    authenticatorType: "auto",
    userVerification: "required",
    attestation: true,
    debug: false,
  });
  // 3. send the registration object to the server/iframe
  // 4. store the credentialId in local storage
  await options.storage.setItem(
    `in-app-wallet-credential-id-${options.client.clientId}`,
    registration.credential.id,
  );
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
    authenticatorType: "auto",
    userVerification: "required",
  });
  // 3. send the authentication object to the server/iframe
  return authentication;
}
