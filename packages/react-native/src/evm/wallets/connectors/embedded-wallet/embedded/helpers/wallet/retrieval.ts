import { SetUpWalletRpcReturnType } from "@paperxyz/embedded-wallet-service-sdk";
import { ethers } from "ethers";
import * as secrets from "secrets.js-34r7h";
import { hexToUint8Array, uint8ArrayToString } from "uint8array-extras";
import { getUserShares } from "../api/fetchers";
import {
  DEVICE_SHARE_ID,
  DEVICE_SHARE_MISSING_MESSAGE,
  ROUTE_GET_USER_SHARES,
} from "../constants";
import { getDeviceShare } from "../storage/local";
import { storeShares } from "./creation";
import { decryptShareWeb } from "./encryption";

function getWalletPrivateKeyFromShares(shares: string[]) {
  const privateKeyHex = secrets.combine(shares);
  const prefixPrivateKey = uint8ArrayToString(hexToUint8Array(privateKeyHex));
  if (!prefixPrivateKey.startsWith("thirdweb_")) {
    throw new Error("Invalid private key reconstructed from shares");
  }
  const privateKey = prefixPrivateKey.replace("thirdweb_", "");
  return privateKey;
}

export function getUserEtherJsWalletFromShares(args: {
  shares: string[];
}): ethers.Wallet {
  const { shares } = args;
  return new ethers.Wallet(getWalletPrivateKeyFromShares(shares));
}

/**
 * For users on a known device and logged in.
 * Will throw if called on a new device // user not logged in
 */
export async function getExistingUserEtherJsWallet(clientId: string) {
  const { authShare, deviceShare } = await getShares({
    clientId,
    authShare: { toRetrieve: true },
    deviceShare: { toRetrieve: true },
    recoveryShare: { toRetrieve: false },
  });
  return getUserEtherJsWalletFromShares({
    shares: [authShare, deviceShare],
  });
}

/**
 *
 * @param deviceShare retrieves the current share associated with the user's device.
 * @returns the requested shares
 * @throws if attempting to get {@param deviceShare} when it's not present
 */
export async function getShares<
  A extends boolean,
  D extends boolean,
  R extends boolean,
>({
  clientId,
  authShare,
  deviceShare,
  recoveryShare,
}: {
  clientId: string;
  authShare: { toRetrieve: A };
  recoveryShare: R extends true
    ? {
        toRetrieve: R;
        recoveryCode: string;
      }
    : {
        toRetrieve: R;
      };
  deviceShare: { toRetrieve: D };
}): Promise<{
  authShare: A extends true ? string : undefined;
  recoveryShare: R extends true ? string : undefined;
  deviceShare: D extends true ? string : undefined;
}> {
  const queryParams: Record<string, boolean> = {};
  if (authShare.toRetrieve) {
    queryParams.getEncryptedAuthShare = true;
  } else {
    queryParams.getEncryptedAuthShare = false;
  }
  if (recoveryShare.toRetrieve) {
    queryParams.getEncryptedRecoveryShare = true;
    if (!recoveryShare.recoveryCode) {
      // purposely using a vague name to prevent people from inspecting url from figuring out what it does
      // so as to not cause huge debates on the technicality of the custodial // non-custodial
      queryParams.useSealedSecret = true;
    } else {
      queryParams.useSealedSecret = false;
    }
  } else {
    queryParams.getEncryptedRecoveryShare = false;
    queryParams.useSealedSecret = false;
  }

  const getShareUrl = new URL(ROUTE_GET_USER_SHARES);
  for (const queryKey of Object.keys(queryParams)) {
    getShareUrl.searchParams.append(queryKey, queryParams[queryKey].toString());
  }

  const userShares = await getUserShares(clientId, getShareUrl);
  const { authShare: _authShare, maybeEncryptedRecoveryShares } = userShares;

  let recoverShareToReturn: string | undefined;
  if (recoveryShare.toRetrieve) {
    if (!maybeEncryptedRecoveryShares?.length) {
      throw new Error("Missing recovery share.");
    }
    for (const maybeEncryptedRecoveryShare of maybeEncryptedRecoveryShares) {
      try {
        if (recoveryShare.recoveryCode) {
          // for client encrypted share, we attempt to decrypt them
          recoverShareToReturn = await decryptShareWeb(
            maybeEncryptedRecoveryShare || "",
            recoveryShare.recoveryCode || "",
          );
        } else {
          recoverShareToReturn = maybeEncryptedRecoveryShare;
        }
        // if we get here, decryption was successful, so we stop trying
        break;
      } catch {}
    }
    if (!recoverShareToReturn) {
      throw new Error("Invalid recovery code.");
    }
  }

  let deviceShareToReturn: string | undefined;
  try {
    deviceShareToReturn = deviceShare.toRetrieve
      ? (await getDeviceShare(clientId)).deviceShare
      : undefined;
  } catch (e) {
    throw new Error(DEVICE_SHARE_MISSING_MESSAGE);
  }

  // The any typecast here to overcome typescript limitation
  // see: https://github.com/microsoft/TypeScript/issues/22735
  // see: https://github.com/microsoft/TypeScript/issues/22735
  return {
    authShare: authShare.toRetrieve ? ((_authShare || "") as any) : undefined,
    deviceShare: deviceShareToReturn as any,
    recoveryShare: recoverShareToReturn as any,
  };
}

export function getWalletShareById(
  shares: string[],
  id: number = DEVICE_SHARE_ID,
) {
  return secrets.newShare(id, shares);
}

export function getWalletAddressFromShares(shares: string[]) {
  const wallet = getUserEtherJsWalletFromShares({
    shares,
  });
  return wallet.address;
}

export async function setUpShareForNewDevice({
  recoveryCode,
  clientId,
}: {
  recoveryCode: string;
  clientId: string;
}): Promise<SetUpWalletRpcReturnType> {
  const { recoveryShare, authShare } = await getShares({
    clientId,
    authShare: { toRetrieve: true },
    recoveryShare: { toRetrieve: true, recoveryCode },
    deviceShare: { toRetrieve: false },
  });
  const shares = [recoveryShare, authShare];
  const deviceShare = getWalletShareById(shares, DEVICE_SHARE_ID);
  const walletAddress = getWalletAddressFromShares([recoveryShare, authShare]);

  const maybeDeviceShare = await storeShares({
    clientId,
    walletAddress,
    deviceShare,
  });

  if (!maybeDeviceShare?.deviceShareStored) {
    throw new Error(DEVICE_SHARE_MISSING_MESSAGE);
  }
  return {
    walletAddress,
    deviceShareStored: maybeDeviceShare?.deviceShareStored,
    isIframeStorageEnabled: false,
  };
}
