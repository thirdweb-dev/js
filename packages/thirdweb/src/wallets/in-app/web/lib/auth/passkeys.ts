import { client, parsers } from "@passwordless-id/webauthn";
import type { ThirdwebClient } from "../../../../../client/client.js";
import type { AsyncStorage } from "../../../../../utils/storage/AsyncStorage.js";
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
    const registration = await client.register({
      attestation: true,
      challenge,
      domain: rp.id,
      user: name,
      userVerification: "required",
    });
    const clientDataB64 = base64UrlToBase64(
      registration.response.clientDataJSON,
    );
    const clientDataParsed = JSON.parse(base64ToString(clientDataB64));
    return {
      authenticatorData: registration.response.authenticatorData,
      clientData: registration.response.clientDataJSON,
      credential: {
        algorithm: parsers.getAlgoName(
          registration.response.publicKeyAlgorithm,
        ),
        publicKey: registration.response.publicKey,
      },
      credentialId: registration.id,
      origin: clientDataParsed.origin,
    };
  }

  async authenticate(args: {
    credentialId: string | undefined;
    challenge: string;
    rp: RpInfo;
  }): Promise<AuthenticateResult> {
    const { credentialId, challenge, rp } = args;
    const result = await client.authenticate({
      allowCredentials: credentialId ? [credentialId] : [],
      challenge,
      domain: rp.id,
      userVerification: "required",
    });
    const clientDataB64 = base64UrlToBase64(result.response.clientDataJSON);
    const clientDataParsed = JSON.parse(base64ToString(clientDataB64));
    return {
      authenticatorData: result.response.authenticatorData,
      clientData: result.response.clientDataJSON,
      credentialId: result.id,
      origin: clientDataParsed.origin,
      signature: result.response.signature,
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
  storage?: AsyncStorage,
) {
  const clientStorage = new ClientScopedStorage({
    clientId: client.clientId, // TODO (passkey) react native variant of this fn
    ecosystem: ecosystemId ? { id: ecosystemId } : undefined,
    storage: storage ?? webLocalStorage,
  });
  const credId = await clientStorage.getPasskeyCredentialId();
  return !!credId;
}
