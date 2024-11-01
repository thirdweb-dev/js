import { GenerateDataKeyCommand, KMSClient } from "@aws-sdk/client-kms";
import { fromCognitoIdentity } from "@aws-sdk/credential-providers";
import QuickCrypto from "react-native-quick-crypto";
import type { ThirdwebClient } from "../../../../../client/client.js";
import { getThirdwebBaseUrl } from "../../../../../utils/domains.js";
import { stringToBytes } from "../../../../../utils/encoding/to-bytes.js";
import { stringify } from "../../../../../utils/json.js";
import { randomBytesBuffer } from "../../../../../utils/random.js";
import {
  concatUint8Arrays,
  uint8ArrayToBase64,
} from "../../../../../utils/uint8-array.js";
import { privateKeyToAccount } from "../../../../private-key.js";
import type { ClientScopedStorage } from "../../../core/authentication/client-scoped-storage.js";
import type { AuthStoredTokenWithCookieReturnType } from "../../../core/authentication/types.js";
import type { UserWallet } from "../../../core/wallet/enclave-wallet.js";
import { authFetchEmbeddedWalletUser } from "../api/fetchers.js";
import { postAuth } from "../auth/middleware.js";
import {
  AWS_REGION,
  ENCLAVE_KMS_KEY_ARN,
  ROUTE_AUTH_COGNITO_ID_TOKEN_V2,
} from "../constants.js";
import { getShares, getWalletPrivateKeyFromShares } from "./retrieval.js";

/**
 * Migrate a sharded wallet to an enclave wallet.
 *
 * @param args - The arguments for the migration process.
 * @returns The migrated user wallet.
 */
export async function migrateToEnclaveWallet(args: {
  client: ThirdwebClient;
  storage: ClientScopedStorage;
  storedToken: AuthStoredTokenWithCookieReturnType["storedToken"];
  encryptionKey?: string;
}): Promise<UserWallet> {
  // setup sharded wallet first, so we have the shares available
  await postAuth({
    storedToken: args.storedToken,
    client: args.client,
    storage: args.storage,
    encryptionKey: args.encryptionKey,
  });

  const { authShare, deviceShare } = await getShares({
    client: args.client,
    authShare: { toRetrieve: true },
    deviceShare: { toRetrieve: true },
    recoveryShare: { toRetrieve: false },
    storage: args.storage,
  });

  // construct the sharded wallet
  const privateKey = await getWalletPrivateKeyFromShares([
    authShare,
    deviceShare,
  ]);
  const account = privateKeyToAccount({
    client: args.client,
    privateKey,
  });
  const address = account.address;

  // get cognito identity
  const idTokenResponse = await authFetchEmbeddedWalletUser({
    client: args.client,
    url: ROUTE_AUTH_COGNITO_ID_TOKEN_V2,
    props: {
      method: "GET",
    },
    storage: args.storage,
  });
  if (!idTokenResponse.ok) {
    throw new Error(
      `Failed to fetch id token from Cognito: ${stringify(
        await idTokenResponse.json(),
        null,
        2,
      )}`,
    );
  }
  const idTokenResult = await idTokenResponse.json();
  const { token, identityId } = idTokenResult;

  const cognitoIdentity = fromCognitoIdentity({
    clientConfig: {
      region: AWS_REGION,
    },
    identityId,
    logins: {
      "cognito-identity.amazonaws.com": token,
    },
  });

  // get kms key
  const kmsClient = new KMSClient({
    region: AWS_REGION,
    credentials: cognitoIdentity,
  });
  const generateDataKeyCommand = new GenerateDataKeyCommand({
    KeyId: ENCLAVE_KMS_KEY_ARN,
    KeySpec: "AES_256",
  });
  const encryptedKeyResult = await kmsClient.send(generateDataKeyCommand);
  const plaintextKeyBlob = encryptedKeyResult.Plaintext;
  const cipherTextBlob = encryptedKeyResult.CiphertextBlob;
  if (!plaintextKeyBlob || !cipherTextBlob) {
    throw new Error("No migration key found. Please try again.");
  }

  // encrypt private key
  const iv = randomBytesBuffer(16);
  // @ts-ignore - default import buils but ts doesn't like it
  const key = await QuickCrypto.subtle.importKey(
    "raw",
    plaintextKeyBlob,
    "AES-CBC",
    false,
    ["encrypt", "decrypt"],
  );

  // @ts-ignore - default import buils but ts doesn't like it
  const encryptedPrivateKey = await QuickCrypto.subtle.encrypt(
    {
      name: "AES-CBC",
      iv,
    },
    key,
    stringToBytes(privateKey),
  );

  const encryptedData = concatUint8Arrays([
    iv,
    new Uint8Array(encryptedPrivateKey),
  ]);

  const ivB64 = uint8ArrayToBase64(iv);
  const cipherTextB64 = uint8ArrayToBase64(cipherTextBlob);
  const encryptedPrivateKeyB64 = uint8ArrayToBase64(encryptedData);

  // execute migration
  const result = await executeMigration({
    client: args.client,
    storage: args.storage,
    address,
    kmsCiphertextB64: cipherTextB64,
    encryptedPrivateKeyB64: encryptedPrivateKeyB64,
    ivB64,
  });

  return result;
}

async function executeMigration(args: {
  client: ThirdwebClient;
  storage: ClientScopedStorage;
  address: string;
  kmsCiphertextB64: string;
  encryptedPrivateKeyB64: string;
  ivB64: string;
}): Promise<UserWallet> {
  const migrationResponse = await authFetchEmbeddedWalletUser({
    client: args.client,
    url: `${getThirdwebBaseUrl("inAppWallet")}/api/v1/enclave-wallet/migrate`,
    props: {
      method: "POST",
      body: stringify({
        address: args.address,
        kmsCiphertextB64: args.kmsCiphertextB64,
        encryptedPrivateKeyB64: args.encryptedPrivateKeyB64,
        ivB64: args.ivB64,
      }),
    },
    storage: args.storage,
  });
  if (!migrationResponse.ok) {
    throw new Error(
      `Failed to migrate to enclave wallet: ${stringify(
        await migrationResponse.json(),
      )}`,
    );
  }
  const migrationResult = (await migrationResponse.json()) as UserWallet;
  return migrationResult;
}
