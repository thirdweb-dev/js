import { SetUpWalletRpcReturnType } from "@paperxyz/embedded-wallet-service-sdk";
import { Wallet, utils } from "ethers";
import * as secrets from "secrets.js-34r7h";
import {
  initWalletWithoutRecoveryCode,
  storeUserShares,
} from "../api/fetchers";

import { logoutUser } from "../auth/logout";
import {
  AUTH_SHARE_INDEX,
  DEVICE_SHARE_INDEX,
  DEVICE_SHARE_MISSING_MESSAGE,
  RECOVERY_SHARE_INDEX,
} from "../constants";
import { setDeviceShare } from "../storage/local";
import { encryptShareWeb } from "./encryption";

export async function setUpNewUserWallet(
  recoveryCode: string,
  clientId: string,
) {
  try {
    // We are using a recovery code override, we mark the wallet as initialized so we don't generate another one the next time
    const { success } = await initWalletWithoutRecoveryCode({ clientId });
    if (!success) {
      throw new Error("Error initializing wallet without recovery code");
    }
    return await createEmbeddedWallet({
      clientId,
      recoveryCode: recoveryCode,
    });
  } catch (e) {
    // we log user out so they aren't in the weird state where they are logged in but the wallet is not initialized
    await logoutUser(clientId);
    throw new Error(
      `Error creating new ews account. Please try signing in again. Original Error: ${e}`,
    );
  }
}

// Wallet Creation
async function createEmbeddedWallet({
  clientId,
  recoveryCode,
}: {
  clientId: string;
  recoveryCode: string;
}): Promise<
  {
    recoveryCode: string;
  } & SetUpWalletRpcReturnType
> {
  const walletDetails = createWalletShares();
  const maybeDeviceShare = await storeShares({
    clientId,
    walletAddress: walletDetails.publicAddress,
    authShare: walletDetails.shares[AUTH_SHARE_INDEX],
    deviceShare: walletDetails.shares[DEVICE_SHARE_INDEX],
    recoveryShares: [
      {
        share: walletDetails.shares[RECOVERY_SHARE_INDEX],
        recoveryCode,
      },
    ],
  });

  if (!maybeDeviceShare?.deviceShareStored) {
    throw new Error(DEVICE_SHARE_MISSING_MESSAGE);
  }
  return {
    walletAddress: walletDetails.publicAddress,
    deviceShareStored: maybeDeviceShare?.deviceShareStored,
    isIframeStorageEnabled: false,
    recoveryCode,
  };
}

function createWalletShares(): {
  publicAddress: string;
  shares: [string, string, string];
} {
  // const wallet = ethers.Wallet.createRandom();
  const seed = utils.randomBytes(32);
  const wallet = new Wallet(seed);
  const privateKeyHex = Buffer.from(`thirdweb_${wallet.privateKey}`).toString(
    "hex",
  );
  // Potential source of share corruption through tampering
  // https://hackerone.com/reports/1884071
  const shares = secrets.share(privateKeyHex, 3, 2);

  return {
    publicAddress: wallet.address,
    shares: [shares[0], shares[1], shares[2]],
  };
}

/**
 * Store user's wallet shares. Encrypts authShare and recoveryShare as given clientSide as well.
 * @param {string} walletAddress the user's wallet address. Note that for each logged in user and clientId, we have a single walletAddress. This will error if we attempt to store shares for user's with an existing wallet different from the walletAddress
 * @param {string} authShare the *unencrypted* authShare for the user
 * @param {string} recoveryShare the *unencrypted* recovery share for the user
 * @throws if another walletAddress already exists
 */
export async function storeShares<R extends string | undefined>({
  clientId,
  walletAddress,
  authShare,
  deviceShare,
  recoveryShares,
}: {
  clientId: string;
  walletAddress: string;
  authShare?: string;
  deviceShare?: string;
  recoveryShares?: R extends string
    ? { share: R; recoveryCode: string }[]
    : never;
}): Promise<{ deviceShareStored: string } | undefined> {
  let maybeEncryptedRecoveryShares:
    | { share: string; isClientEncrypted: boolean }[]
    | undefined;
  if (recoveryShares && recoveryShares.length) {
    maybeEncryptedRecoveryShares = await Promise.all(
      recoveryShares.map(async (recoveryShare) => {
        return {
          share: await encryptShareWeb(
            recoveryShare.share,
            recoveryShare.recoveryCode,
          ),
          isClientEncrypted: true,
        };
      }),
    );
  }

  await storeUserShares({
    authShare,
    clientId,
    maybeEncryptedRecoveryShares,
    walletAddress,
  });

  try {
    if (deviceShare) {
      const deviceShareStored = await setDeviceShare({
        deviceShare,
        clientId,
      });
      return { deviceShareStored };
    }
  } catch (e) {
    throw new Error(
      `Malformed response from the ews store user share API: ${JSON.stringify(
        e,
      )}`,
    );
  }
}
