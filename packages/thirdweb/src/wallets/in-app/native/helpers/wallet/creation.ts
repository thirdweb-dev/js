import { secp256k1 } from "@noble/curves/secp256k1";
import { publicKeyToAddress } from "viem/utils";
import type { ThirdwebClient } from "../../../../../client/client.js";
import { stringToHex, toHex } from "../../../../../utils/encoding/hex.js";
import type { ClientScopedStorage } from "../../../core/authentication/client-scoped-storage.js";
import type { SetUpWalletRpcReturnType } from "../../../core/authentication/types.js";
import { storeUserShares } from "../api/fetchers.js";
import { logoutUser } from "../auth/logout.js";
import {
  AUTH_SHARE_INDEX,
  DEVICE_SHARE_INDEX,
  DEVICE_SHARE_MISSING_MESSAGE,
  RECOVERY_SHARE_INDEX,
} from "../constants.js";
import { createErrorMessage } from "../errors.js";
import { setDeviceShare } from "../storage/local.js";
import { encryptShareWeb } from "./encryption.js";

export async function setUpNewUserWallet(args: {
  recoveryCode: string;
  client: ThirdwebClient;
  storage: ClientScopedStorage;
}) {
  const { client, recoveryCode, storage } = args;
  try {
    return await generateWallet({
      client,
      recoveryCode: recoveryCode,
      storage,
    });
  } catch (e) {
    // we log user out so they aren't in the weird state where they are logged in but the wallet is not initialized
    await logoutUser({ client, storage });
    throw new Error(
      `Error creating new ews account. Please try signing in again. Original Error: ${e}`,
    );
  }
}

// Wallet Creation
async function generateWallet({
  client,
  recoveryCode,
  storage,
}: {
  client: ThirdwebClient;
  recoveryCode: string;
  storage: ClientScopedStorage;
}): Promise<
  {
    recoveryCode: string;
  } & SetUpWalletRpcReturnType
> {
  const walletDetails = await createWalletShares();

  const maybeDeviceShare = await storeShares({
    authShare: walletDetails.shares[AUTH_SHARE_INDEX],
    client,
    deviceShare: walletDetails.shares[DEVICE_SHARE_INDEX],
    recoveryShares: [
      {
        recoveryCode,
        // biome-ignore lint/style/noNonNullAssertion: its there
        share: walletDetails.shares[RECOVERY_SHARE_INDEX]!,
      },
    ],
    storage,
    walletAddress: walletDetails.publicAddress,
  });

  if (!maybeDeviceShare?.deviceShareStored) {
    throw new Error(DEVICE_SHARE_MISSING_MESSAGE);
  }
  return {
    deviceShareStored: maybeDeviceShare?.deviceShareStored,
    isIframeStorageEnabled: false,
    recoveryCode,
    walletAddress: walletDetails.publicAddress,
  };
}

async function createWalletShares(): Promise<{
  publicAddress: string;
  shares: [string, string, string];
}> {
  const privateKey = toHex(secp256k1.utils.randomPrivateKey());
  const privateKeyHex = stringToHex(`thirdweb_${privateKey}`).slice(2);
  const publicKey = toHex(secp256k1.getPublicKey(privateKey.slice(2), false));
  const address = publicKeyToAddress(publicKey);

  const sss = await import("./sss.js");
  const [share1, share2, share3] = sss.secrets.share(
    privateKeyHex,
    3,
    2,
    undefined, // default pad length
  );

  if (!share1 || !share2 || !share3) {
    throw new Error("Error splitting private key into shares");
  }

  return {
    publicAddress: address,
    shares: [share1, share2, share3],
  };
}

/**
 * Store user's wallet shares. Encrypts authShare and recoveryShare as given clientSide as well.
 * @param walletAddress - the user's wallet address. Note that for each logged in user and clientId, we have a single walletAddress. This will error if we attempt to store shares for user's with an existing wallet different from the walletAddress
 * @param authShare - the *unencrypted* authShare for the user
 * @param recoveryShare - the *unencrypted* recovery share for the user
 * @throws if another walletAddress already exists
 */
export async function storeShares<R extends string | undefined>({
  client,
  walletAddress,
  authShare,
  deviceShare,
  recoveryShares,
  storage,
}: {
  client: ThirdwebClient;
  walletAddress: string;
  authShare?: string;
  deviceShare?: string;
  recoveryShares?: R extends string
    ? { share: R; recoveryCode: string }[]
    : never;
  storage: ClientScopedStorage;
}): Promise<{ deviceShareStored: string } | undefined> {
  let maybeEncryptedRecoveryShares:
    | { share: string; isClientEncrypted: boolean }[]
    | undefined;

  if (recoveryShares?.length) {
    maybeEncryptedRecoveryShares = await Promise.all(
      recoveryShares.map(async (recoveryShare) => {
        return {
          isClientEncrypted: true,
          share: await encryptShareWeb(
            recoveryShare.share,
            recoveryShare.recoveryCode,
          ),
        };
      }),
    );
  }

  await storeUserShares({
    authShare,
    client,
    maybeEncryptedRecoveryShares,
    storage,
    walletAddress,
  });

  try {
    if (deviceShare) {
      const deviceShareStored = await setDeviceShare({
        clientId: client.clientId,
        deviceShare,
      });
      return { deviceShareStored };
    }
    return undefined;
  } catch (e) {
    throw new Error(
      createErrorMessage(
        "Malformed response from the ews store user share API",
        e,
      ),
    );
  }
}
