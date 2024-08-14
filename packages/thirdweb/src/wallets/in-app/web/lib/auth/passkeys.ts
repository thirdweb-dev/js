import { client } from "@passwordless-id/webauthn";
import type { ThirdwebClient } from "../../../../../client/client.js";
import { webLocalStorage } from "../../../../../utils/storage/webStorage.js";
import {
  base64ToString,
  base64UrlToBase64,
} from "../../../../../utils/uint8-array.js";
import type { EcosystemWalletId } from "../../../../wallet-types.js";
import { ClientScopedStorage } from "../../../core/authentication/client-scoped-storage.js";
import type {
  AuthenticateResult,
  PasskeyClient,
  RegisterResult,
  RpInfo,
} from "../../../core/authentication/passkeys.js";

export class PasskeyWebClient implements PasskeyClient {
  isAvailable(): boolean {
    return client.isAvailable();
  }

  async register(args: {
    name: string;
    challenge: string;
    rp: RpInfo;
  }): Promise<RegisterResult> {
    const { name, challenge, rp } = args;
    const registration = await client.register(name, challenge, {
      authenticatorType: "auto",
      userVerification: "required",
      domain: rp.id,
      attestation: true,
      debug: false,
    });
    const clientDataB64 = base64UrlToBase64(registration.clientData);
    const clientDataParsed = JSON.parse(base64ToString(clientDataB64));
    return {
      authenticatorData: registration.authenticatorData,
      credentialId: registration.credential.id,
      clientData: registration.clientData,
      credential: {
        publicKey: registration.credential.publicKey,
        algorithm: registration.credential.algorithm,
      },
      origin: clientDataParsed.origin,
    };
  }

  async authenticate(args: {
    credentialId: string | undefined;
    challenge: string;
    rp: RpInfo;
  }): Promise<AuthenticateResult> {
    const { credentialId, challenge, rp } = args;
    const result = await client.authenticate(
      credentialId ? [credentialId] : [],
      challenge,
      {
        authenticatorType: "auto",
        userVerification: "required",
        domain: rp.id,
      },
    );
    const clientDataB64 = base64UrlToBase64(result.clientData);
    const clientDataParsed = JSON.parse(base64ToString(clientDataB64));
    return {
      authenticatorData: result.authenticatorData,
      credentialId: result.credentialId,
      clientData: result.clientData,
      signature: result.signature,
      origin: clientDataParsed.origin,
    };
  }
}

/**
 * Returns whether this device has a stored passkey ready to be used for sign-in
 * @param client - the thirdweb client
 * @returns whether the device has a stored passkey
 * @walletUtils
 */
export async function hasStoredPasskey(
  client: ThirdwebClient,
  ecosystemId?: EcosystemWalletId,
) {
  const storage = new ClientScopedStorage({
    storage: webLocalStorage, // TODO (passkey) react native variant of this fn
    clientId: client.clientId,
    ecosystemId: ecosystemId,
  });
  const credId = await storage.getPasskeyCredentialId();
  return !!credId;
}
