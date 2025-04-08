import type { TypedData } from "abitype";

import ky from "ky";
import { x25519 } from "@noble/curves/ed25519";
import { randomBytes } from "@noble/hashes/utils";
import { sha256 } from "@noble/hashes/sha256";
import { hkdf } from "@noble/hashes/hkdf";
import { xchacha20poly1305 } from "@noble/ciphers/chacha";
import { hexToBytes, bytesToHex } from "@noble/hashes/utils";

import type {
  CreateAccessTokenPayload,
  CreateEoaPayload,
  CreateServiceAccountPayload,
  EncryptedPayload,
  GetServiceAccountPayload,
  ListEoaPayload,
  Payload,
  PingPayload,
  RevokeAccessTokenPayload,
  RotateServiceAccountPayload,
  SignMessagePayload,
  SignTransactionPayload,
  Prettify,
  UnencryptedErrorResponse,
  CheckedSignTypedDataPayload,
} from "./types.js";

function encryptForEnclave(
  payload: Payload["input"],
  enclavePublicKey: Uint8Array,
): { encryptedPayload: EncryptedPayload; ephemeralPrivateKey: Uint8Array } {
  const ephemeralPrivateKey = randomBytes(32);
  // Generate ephemeral keypair
  const ephemeralPublicKey = x25519.getPublicKey(ephemeralPrivateKey);

  // Derive shared secret using X25519
  const sharedSecret = x25519.getSharedSecret(
    ephemeralPrivateKey,
    enclavePublicKey,
  );

  // Key derivation
  const encryptionKey = hkdf(sha256, sharedSecret, undefined, "encryption", 32);

  // Convert message to bytes if it's not already
  const messageBytes =
    typeof payload === "string"
      ? new TextEncoder().encode(payload)
      : new TextEncoder().encode(JSON.stringify(payload));

  // XChaCha20-Poly1305 encryption
  const nonce = randomBytes(24); // 24-byte nonce for XChaCha20
  const cipher = xchacha20poly1305(encryptionKey, nonce);
  const ciphertext = cipher.encrypt(messageBytes);

  // Format the encrypted package
  return {
    encryptedPayload: {
      ephemeralPublicKey: bytesToHex(ephemeralPublicKey),
      nonce: bytesToHex(nonce),
      ciphertext: bytesToHex(ciphertext),
    },
    ephemeralPrivateKey: ephemeralPrivateKey,
  };
}

function isErrorResponse(
  response: UnencryptedErrorResponse | EncryptedPayload,
): response is UnencryptedErrorResponse {
  return (response as UnencryptedErrorResponse).error !== undefined;
}

function decryptFromEnclave(
  encryptedPackage: EncryptedPayload,
  ephemeralPrivateKey: Uint8Array,
) {
  const { ephemeralPublicKey, nonce, ciphertext } = encryptedPackage;

  // Convert hex strings back to bytes
  const pubKey = hexToBytes(ephemeralPublicKey);
  const nonceBytes = hexToBytes(nonce);
  const ciphertextBytes = hexToBytes(ciphertext);

  // Derive the same shared secret (from the enclave's ephemeral public key)
  const sharedSecret = x25519.getSharedSecret(ephemeralPrivateKey, pubKey);
  // Derive the same encryption key
  const encryptionKey = hkdf(sha256, sharedSecret, undefined, "encryption", 32);

  // Decrypt the ciphertext
  const cipher = xchacha20poly1305(encryptionKey, nonceBytes);
  const decrypted = cipher.decrypt(ciphertextBytes);

  // Convert bytes back to string and parse JSON if needed
  const decryptedText = new TextDecoder().decode(decrypted);
  try {
    return JSON.parse(decryptedText);
  } catch {
    return decryptedText;
  }
}

export type VaultClient = {
  baseUrl: string;
  publicKey: Uint8Array;
};

export async function createVaultClient({ baseUrl }: { baseUrl: string }) {
  const vaultApi = ky.create({
    prefixUrl: baseUrl,
    headers: {
      "Content-Type": "application/json",
    },
    throwHttpErrors: false,
  });

  type IntrospectionResponse = {
    publicKey: string;
  };

  const res = await vaultApi
    .get("api/v1/enclave")
    .json<IntrospectionResponse>();

  const publicKeyBytes = hexToBytes(res.publicKey);

  return {
    baseUrl: baseUrl,
    publicKey: publicKeyBytes,
  } as VaultClient;
}

// ========== Main API function ==========
type SendRequestParams<P extends Payload> = {
  request: P["input"];
  client: VaultClient;
};

async function sendRequest<P extends Payload>({
  request,
  client,
}: SendRequestParams<P>) {
  const { encryptedPayload, ephemeralPrivateKey } = encryptForEnclave(
    request,
    client.publicKey,
  );

  console.log(client);

  const vaultApi = ky.create({
    prefixUrl: client.baseUrl,
    headers: {
      "Content-Type": "application/json",
    },
    throwHttpErrors: false,
  });

  console.log(
    "Encrypted payload for operation ",
    request.operation,
    encryptedPayload,
  );

  const res = await vaultApi
    .post("api/v1/enclave", {
      json: encryptedPayload,
    })
    .json<EncryptedPayload | UnencryptedErrorResponse>()
    .catch((e) => {
      console.log("Error from vault: ", e);
      throw e;
    });

  if (isErrorResponse(res)) {
    console.log("Error response from vault: ", res);
    return {
      success: false,
      data: null,
      error: res.error,
    } as Prettify<P["output"]>;
  }

  console.log("Encrypted response:", res);

  const decryptedResponse = decryptFromEnclave(
    res,
    ephemeralPrivateKey,
  ) as Prettify<P["output"]>;

  console.log("Decrypted response from vault: ", decryptedResponse);
  return decryptedResponse;
}

// ========== Generic Helper Params ==========
type PayloadParams<P extends Payload> = {
  request: Prettify<Omit<P["input"], "operation">>;
  client: VaultClient;
};

// ========== Helper functions ==========
export function ping({ client, request: options }: PayloadParams<PingPayload>) {
  return sendRequest<PingPayload>({
    request: {
      operation: "ping",
      ...options,
    },
    client,
  });
}

export function createServiceAccount({
  client,
  request: options,
}: PayloadParams<CreateServiceAccountPayload>) {
  return sendRequest<CreateServiceAccountPayload>({
    request: {
      operation: "serviceAccount:create",
      ...options,
    },
    client,
  });
}

export function getServiceAccount({
  client,
  request: options,
}: PayloadParams<GetServiceAccountPayload>) {
  return sendRequest<GetServiceAccountPayload>({
    request: {
      operation: "serviceAccount:get",
      ...options,
    },
    client,
  });
}

export function rotateServiceAccount({
  client,
  request: options,
}: PayloadParams<RotateServiceAccountPayload>) {
  return sendRequest<RotateServiceAccountPayload>({
    request: {
      operation: "serviceAccount:rotate",
      ...options,
    },
    client,
  });
}

export function createEoa({
  client,
  request: options,
}: PayloadParams<CreateEoaPayload>) {
  return sendRequest<CreateEoaPayload>({
    request: {
      operation: "eoa:create",
      ...options,
    },
    client,
  });
}

export function listEoas({
  client,
  request: options,
}: PayloadParams<ListEoaPayload>) {
  return sendRequest<ListEoaPayload>({
    request: {
      operation: "eoa:list",
      ...options,
    },
    client,
  });
}

export function signTransaction({
  client,
  request: options,
}: PayloadParams<SignTransactionPayload>) {
  return sendRequest<SignTransactionPayload>({
    request: {
      operation: "eoa:signTransaction",
      ...options,
    },
    client,
  });
}

export function signMessage({
  client,
  request: options,
}: PayloadParams<SignMessagePayload>) {
  return sendRequest<SignMessagePayload>({
    request: {
      operation: "eoa:signMessage",
      ...options,
    },
    client,
  });
}

export function createAccessToken({
  client,
  request: options,
}: PayloadParams<CreateAccessTokenPayload>) {
  return sendRequest<CreateAccessTokenPayload>({
    request: {
      operation: "accessToken:create",
      ...options,
    },
    client,
  });
}

export function signTypedData<
  Types extends TypedData,
  PrimaryType extends keyof Types,
>({
  client,
  request: options,
}: PayloadParams<CheckedSignTypedDataPayload<Types, PrimaryType>>) {
  return sendRequest<CheckedSignTypedDataPayload<Types, PrimaryType>>({
    request: {
      operation: "eoa:signTypedData",
      auth: options.auth,
      options: {
        from: options.options.from,
        typedData: options.options.typedData,
      },
    },
    client,
  });
}

export function revokeAccessToken({
  client,
  request: options,
}: PayloadParams<RevokeAccessTokenPayload>) {
  return sendRequest<RevokeAccessTokenPayload>({
    request: {
      operation: "accessToken:revoke",
      ...options,
    },
    client,
  });
}
