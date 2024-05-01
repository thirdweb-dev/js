import { client } from "@passwordless-id/webauthn";
import type { ThirdwebClient } from "../../../../../client/client.js";
import type { AuthLoginReturnType } from "../../interfaces/auth.js";
import { LocalStorage } from "../../utils/Storage/LocalStorage.js";

export async function registerPasskey(options: {
  client: ThirdwebClient;
  authenticatorType?: string;
  username?: string;
}): Promise<AuthLoginReturnType> {
  if (!client.isAvailable()) {
    throw new Error("Passkeys are not available on this device");
  }
  // TODO inject this
  const storage = new LocalStorage({ clientId: options.client.clientId });
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
  await storage.savePasskeyCredentialId(registration.credential.id);

  // 4. send the registration object to the server
  // TODO endpoint to send registration data

  // 5. returns back the IAW authentication token
  // 6. pass it to the iframe and call postLogin to store the auth token
  // 7. return the auth'd user type

  //return registration;
  throw new Error("Not implemented");
}

export async function loginWithPasskey(options: {
  client: ThirdwebClient;
}): Promise<AuthLoginReturnType> {
  if (!client.isAvailable()) {
    throw new Error("Passkeys are not available on this device");
  }
  // TODO inject this
  const storage = new LocalStorage({ clientId: options.client.clientId });
  // 1. request challenge from  server/iframe
  const challenge = "a7c61ef9-dc23-4806-b486-2428938a547e";
  // 1.2. find the user's credentialId in local storage
  const credentialId = await storage.getPasskeyCredentialId();
  const credentials = credentialId ? [credentialId] : [];
  // 2. initiate login
  const authentication = await client.authenticate(credentials, challenge, {
    authenticatorType: "roaming",
    userVerification: "required",
  });
  // 3. send the authentication object to the server/iframe
  // 4. return the auth'd user type
  void authentication;
  throw new Error("Not implemented");
}
