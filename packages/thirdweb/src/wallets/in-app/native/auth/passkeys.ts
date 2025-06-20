import { Passkey } from "react-native-passkey";
import { concat } from "viem";
import type { ThirdwebClient } from "../../../../client/client.js";
import { toBytes } from "../../../../utils/encoding/to-bytes.js";
import { keccak256 } from "../../../../utils/hashing/keccak256.js";
import type { AsyncStorage } from "../../../../utils/storage/AsyncStorage.js";
import { nativeLocalStorage } from "../../../../utils/storage/nativeStorage.js";
import {
  base64ToString,
  base64ToUint8Array,
  base64UrlToBase64,
  uint8ArrayToBase64,
} from "../../../../utils/uint8-array.js";
import type { EcosystemWalletId } from "../../../wallet-types.js";
import { ClientScopedStorage } from "../../core/authentication/client-scoped-storage.js";
import type {
  AuthenticateResult,
  PasskeyClient,
  RegisterResult,
  RpInfo,
} from "../../core/authentication/passkeys.js";

export class PasskeyNativeClient implements PasskeyClient {
  isAvailable(): boolean {
    return Passkey.isSupported();
  }

  async register(args: {
    name: string;
    challenge: string;
    rp: RpInfo;
  }): Promise<RegisterResult> {
    const { name, challenge, rp } = args;
    const result = await Passkey.create({
      authenticatorSelection: {
        authenticatorAttachment: "platform",
        requireResidentKey: true,
        residentKey: "required",
        userVerification: "required",
      },
      challenge,
      pubKeyCredParams: [
        {
          alg: -7,
          type: "public-key",
        },
      ],
      rp,
      user: {
        displayName: name,
        id: keccak256(toBytes(name)),
        name: name,
      },
    });

    const parsedResult =
      typeof result === "string" ? JSON.parse(result) : result;
    const { publicKey, authData } = await extractPublicKeyAndAuthData(
      parsedResult.response,
    );
    const clientDataB64 = base64UrlToBase64(
      parsedResult.response.clientDataJSON,
    );
    const clientDataParsed = JSON.parse(base64ToString(clientDataB64));

    return {
      authenticatorData: authData,
      clientData: clientDataB64,
      credential: {
        algorithm: "ES256",
        publicKey,
      },
      credentialId: parsedResult.id,
      origin: clientDataParsed.origin,
    };
  }

  async authenticate(args: {
    credentialId: string | undefined;
    challenge: string;
    rp: RpInfo;
  }): Promise<AuthenticateResult> {
    const { credentialId, challenge, rp } = args;
    const result = await Passkey.get({
      allowCredentials: credentialId
        ? [
            {
              id: credentialId,
              // biome-ignore lint/suspicious/noExplicitAny: enum not exported
              transports: ["hybrid" as any],
              type: "public-key",
            },
          ]
        : [],
      challenge,
      rpId: rp.id,
    });

    const parsedResult =
      typeof result === "string" ? JSON.parse(result) : result;
    const clientDataB64 = base64UrlToBase64(
      parsedResult.response.clientDataJSON,
    );
    const clientDataParsed = JSON.parse(base64ToString(clientDataB64));

    return {
      authenticatorData: parsedResult.response.authenticatorData,
      clientData: clientDataB64,
      credentialId: parsedResult.id,
      origin: clientDataParsed.origin,
      signature: parsedResult.response.signature,
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
    clientId: client.clientId,
    ecosystem: ecosystemId ? { id: ecosystemId } : undefined,
    storage: storage ?? nativeLocalStorage,
  });
  const credId = await clientStorage.getPasskeyCredentialId();
  return !!credId;
}

type ExtractedData = {
  publicKey: string;
  authData: string;
};

async function extractPublicKeyAndAuthData(response: {
  attestationObject: string;
}): Promise<ExtractedData> {
  const { decode } = await import("../../../../utils/bytecode/cbor-decode.js");
  const { attestationObject } = response;
  const attestationBase64 = base64UrlToBase64(attestationObject);

  // Decode the attestationObject from base64url
  const attestationBytes = base64ToUint8Array(attestationBase64);
  const decodedAttestationObject = decode(attestationBytes);

  // Extract the authenticator data (authData) from the attestation object
  const authData = Uint8Array.from(decodedAttestationObject.authData);
  const decoded = decodeAuthData(authData);

  if (!decoded.publicKey) {
    throw new Error("No public key found");
  }
  const coseKey = decode(decoded.publicKey);
  // convert to PEM format
  const x = Uint8Array.from(coseKey[-2]); // x coordinate
  const y = Uint8Array.from(coseKey[-3]); // y coordinate
  // Concatenate x and y coordinates with the uncompressed point indicator (0x04)
  const pubKey = concat([
    Uint8Array.from([
      // ASN.1 DER encoding, aka X.690 ... https://en.wikipedia.org/wiki/X.690

      0x30, // DER Sequence
      0x59, // Length (2+19 + 2+66) = 89

      0x30, // DER Sequence
      0x13, // Length (2+7 + 2+8) = 19

      0x06, // DER OBJECT IDENTIFIER
      0x07, // Length
      0x2a,
      0x86,
      0x48,
      0xce,
      0x3d,
      0x02,
      0x01, // OID 1.2.840.10045.2.1 ecPublicKey

      0x06, // DER OBJECT IDENTIFIER
      0x08, // Length
      0x2a,
      0x86,
      0x48,
      0xce,
      0x3d,
      0x03,
      0x01,
      0x07, // OID 1.2.840.10045.3.1.7 prime256v1

      0x03, // DER BIT STRING
      0x42, // Length (32 + 32 + 1(null) + 1) = 66
      0x00,

      0x04, // ECC uncompressed... beginning of X9.62 Key
    ]), // Uncompressed point indicator
    x,
    y,
  ]);

  return {
    authData: uint8ArrayToBase64(authData),
    publicKey: uint8ArrayToBase64(pubKey),
  };
}

function decodeAuthData(authData: Uint8Array) {
  let offset = 0;

  // Step 1: Read the RP ID hash (32 bytes)
  const rpIdHash = authData.slice(offset, offset + 32);
  offset += 32;

  // Step 2: Read the flags (1 byte)
  const flags = authData[offset];
  offset += 1;

  if (!flags) {
    throw new Error("No flags found");
  }

  // Step 3: Read the sign count (4 bytes)
  const signCount = authData.slice(offset, offset + 4);
  offset += 4;

  // Step 4: Check if attested credential data is present
  const attestedCredentialDataPresent = (flags & 0x40) !== 0;
  let aaguid: Uint8Array | undefined;
  let credentialIdLength: number | undefined;
  let credentialId: Uint8Array | undefined;
  let publicKey: Uint8Array | undefined;

  if (attestedCredentialDataPresent) {
    // Step 5: Read AAGUID (16 bytes)
    aaguid = authData.slice(offset, offset + 16);
    offset += 16;

    const start = authData[offset];
    const end = authData[offset + 1];

    if (start === undefined || end === undefined) {
      throw new Error("No credential ID found");
    }

    // Step 6: Read Credential ID Length (2 bytes)
    credentialIdLength = (start << 8) + end;
    offset += 2;

    // Step 7: Read Credential ID (variable length)
    credentialId = authData.slice(offset, offset + credentialIdLength);
    offset += credentialIdLength;

    // Step 8: Read Public Key (variable length, COSE-encoded)
    publicKey = authData.slice(offset); // The rest is the public key
    offset += publicKey.length;
  }

  return {
    aaguid,
    credentialId,
    credentialIdLength,
    flags,
    publicKey,
    rpIdHash,
    signCount,
  };
}
