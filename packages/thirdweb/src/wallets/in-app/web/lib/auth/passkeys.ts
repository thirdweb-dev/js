import { client } from "@passwordless-id/webauthn";
import type { ThirdwebClient } from "../../../../../client/client.js";
import { webLocalStorage } from "../../../../../utils/storage/webStorage.js";
import type { EcosystemWalletId } from "../../../../wallet-types.js";
import type {
  AuthenticateResult,
  PasskeyClient,
  RegisterResult,
} from "../../../core/authentication/passkeys.js";
import { LocalStorage } from "../../utils/Storage/LocalStorage.js";

export class PasskeyWebClient implements PasskeyClient {
  isAvailable(): boolean {
    return client.isAvailable();
  }

  async register(name: string, challenge: string): Promise<RegisterResult> {
    const registration = await client.register(name, challenge, {
      authenticatorType: "auto",
      userVerification: "required",
      attestation: true,
      debug: false,
    });
    return {
      authenticatorData: registration.authenticatorData,
      credentialId: registration.credential.id,
      clientData: registration.clientData,
      credential: {
        publicKey: registration.credential.publicKey,
        algorithm: registration.credential.algorithm,
      },
    };
  }

  async authenticate(
    credentialId: string | undefined,
    challenge: string,
  ): Promise<AuthenticateResult> {
    const result = await client.authenticate(
      credentialId ? [credentialId] : [],
      challenge,
      {
        authenticatorType: "auto",
        userVerification: "required",
      },
    );
    return {
      authenticatorData: result.authenticatorData,
      credentialId: result.credentialId,
      clientData: result.clientData,
      signature: result.signature,
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
  const storage = new LocalStorage({
    storage: webLocalStorage, // TODO (passkey) react native variant of this fn
    clientId: client.clientId,
    ecosystemId: ecosystemId,
  });
  const credId = await storage.getPasskeyCredentialId();
  return !!credId;
}
