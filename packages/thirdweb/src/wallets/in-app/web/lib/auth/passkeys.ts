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
      user: name,
      challenge,
      userVerification: "required",
      domain: rp.id,
      attestation: true,
    });
    const clientDataB64 = base64UrlToBase64(
      registration.response.clientDataJSON,
    );
    const clientDataParsed = JSON.parse(base64ToString(clientDataB64));
    return {
      authenticatorData: registration.response.authenticatorData,
      credentialId: registration.id,
      clientData: registration.response.clientDataJSON,
      credential: {
        publicKey: registration.response.publicKey,
        algorithm: parsers.getAlgoName(
          registration.response.publicKeyAlgorithm,
        ),
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
    const result = await client.authenticate({
      allowCredentials: credentialId ? [credentialId] : [],
      challenge,
      userVerification: "required",
      domain: rp.id,
    });
    const clientDataB64 = base64UrlToBase64(result.response.clientDataJSON);
    const clientDataParsed = JSON.parse(base64ToString(clientDataB64));
    return {
      authenticatorData: result.response.authenticatorData,
      credentialId: result.id,
      clientData: result.response.clientDataJSON,
      signature: result.response.signature,
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
  storage?: AsyncStorage,
) {
  const clientStorage = new ClientScopedStorage({
    storage: storage ?? webLocalStorage, // TODO (passkey) react native variant of this fn
    clientId: client.clientId,
    ecosystem: ecosystemId ? { id: ecosystemId } : undefined,
  });
  const credId = await clientStorage.getPasskeyCredentialId();
  return !!credId;
}
