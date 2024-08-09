import { Passkey } from "react-native-passkey";
import type { ThirdwebClient } from "../../../../client/client";
import { toBytes } from "../../../../utils/encoding/to-bytes";
import { keccak256 } from "../../../../utils/hashing/keccak256";
import { nativeLocalStorage } from "../../../../utils/storage/nativeStorage";
import type { EcosystemWalletId } from "../../../wallet-types";
import type {
  AuthenticateResult,
  PasskeyClient,
  RegisterResult,
} from "../../core/authentication/passkeys.js";
import type { Ecosystem } from "../../web/types";
import { LocalStorage } from "../../web/utils/Storage/LocalStorage";

export class PasskeyNativeClient implements PasskeyClient {
  isAvailable(): boolean {
    return Passkey.isSupported();
  }

  async register(name: string, challenge: string): Promise<RegisterResult> {
    const result = await Passkey.create({
      challenge,
      user: {
        displayName: name,
        name: name,
        id: keccak256(toBytes(name)),
      },
      rp: {
        id: "", // TODO (passkey): add RP ID
        name: "", // TODO (passkey): add RP name
      },
      pubKeyCredParams: [
        {
          alg: -7,
          type: "public-key",
        },
      ],
    });
    return {
      authenticatorData: result.response.attestationObject,
      credentialId: result.id,
      clientData: result.response.clientDataJSON,
      credential: {
        publicKey: result.rawId, // TODO (passkey): extract public key from attestationObject
        algorithm: "-7",
      },
    };
  }

  async authenticate(
    credentialId: string | undefined,
    challenge: string,
  ): Promise<AuthenticateResult> {
    const result = await Passkey.get({
      challenge,
      rpId: "",
      allowCredentials: credentialId
        ? [
            {
              id: credentialId,
              type: "public-key",
            },
          ]
        : [],
    });
    return {
      authenticatorData: result.response.authenticatorData,
      credentialId: result.id,
      clientData: result.response.clientDataJSON,
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
) {
  const storage = new LocalStorage({
    storage: nativeLocalStorage,
    clientId: client.clientId,
    ecosystemId: ecosystemId,
  });
  const credId = await storage.getPasskeyCredentialId();
  return !!credId;
}
