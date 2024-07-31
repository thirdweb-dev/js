import type { ThirdwebClient } from "../../../../../client/client.js";
import {
  type Hex,
  hexToString,
  isHex,
} from "../../../../../utils/encoding/hex.js";
import type { Account } from "../../../../interfaces/wallet.js";
import { privateKeyToAccount } from "../../../../private-key.js";
import type { SetUpWalletRpcReturnType } from "../../../core/authentication/type.js";
import { getUserShares } from "../api/fetchers.js";
import {
  DEVICE_SHARE_MISSING_MESSAGE,
  ROUTE_GET_USER_SHARES,
} from "../constants.js";
import { getDeviceShare } from "../storage/local.js";
import { storeShares } from "./creation.js";
import { decryptShareWeb } from "./encryption.js";

/**
 * For users on a known device and logged in.
 * Will throw if called on a new device // user not logged in
 */
export async function getExistingUserAccount(args: { client: ThirdwebClient }) {
  const { client } = args;
  const { authShare, deviceShare } = await getShares({
    client,
    authShare: { toRetrieve: true },
    deviceShare: { toRetrieve: true },
    recoveryShare: { toRetrieve: false },
  });
  return getAccountFromShares({
    client,
    shares: [authShare, deviceShare],
  });
}

async function getWalletPrivateKeyFromShares(shares: string[]) {
  const sss = await import("./sss.js");
  let privateKeyHex = sss.secrets.combine(shares, 0);
  if (!isHex(privateKeyHex)) {
    privateKeyHex = `0x${privateKeyHex}`;
  }
  const prefixPrivateKey = hexToString(privateKeyHex as Hex);
  if (!prefixPrivateKey.startsWith("thirdweb_")) {
    throw new Error("Invalid private key reconstructed from shares");
  }
  const privateKey = prefixPrivateKey.replace("thirdweb_", "");
  return privateKey;
}

async function getAccountFromShares(args: {
  client: ThirdwebClient;
  shares: string[];
}): Promise<Account> {
  const { client, shares } = args;
  return privateKeyToAccount({
    client,
    privateKey: await getWalletPrivateKeyFromShares(shares),
  });
}

/**
 *
 * @param deviceShare - retrieves the current share associated with the user's device.
 * @returns The requested shares
 * @throws if attempting to get deviceShare when it's not present
 */
async function getShares<
  A extends boolean,
  D extends boolean,
  R extends boolean,
>({
  client,
  authShare,
  deviceShare,
  recoveryShare,
}: {
  client: ThirdwebClient;
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
    getShareUrl.searchParams.append(
      queryKey,
      queryParams[queryKey]?.toString() || "",
    );
  }

  const userShares = await getUserShares(client, getShareUrl);
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
      ? (await getDeviceShare(client.clientId)).deviceShare
      : undefined;
  } catch (e) {
    throw new Error(DEVICE_SHARE_MISSING_MESSAGE);
  }

  // The any typecast here to overcome typescript limitation
  // see: https://github.com/microsoft/TypeScript/issues/22735
  // see: https://github.com/microsoft/TypeScript/issues/22735
  return {
    // biome-ignore lint/suspicious/noExplicitAny: TODO check the links above
    authShare: authShare.toRetrieve ? ((_authShare || "") as any) : undefined,
    // biome-ignore lint/suspicious/noExplicitAny: TODO check the links above
    deviceShare: deviceShareToReturn as any,
    // biome-ignore lint/suspicious/noExplicitAny: TODO check the links above
    recoveryShare: recoverShareToReturn as any,
  };
}

export async function getAccountAddressFromShares(args: {
  client: ThirdwebClient;
  shares: string[];
}) {
  const wallet = await getAccountFromShares(args);
  return wallet.address;
}

export async function setUpShareForNewDevice({
  recoveryCode,
  client,
}: {
  recoveryCode: string;
  client: ThirdwebClient;
}): Promise<SetUpWalletRpcReturnType> {
  const { recoveryShare, authShare } = await getShares({
    client,
    authShare: { toRetrieve: true },
    recoveryShare: { toRetrieve: true, recoveryCode },
    deviceShare: { toRetrieve: false },
  });
  // instead of recreating a new share, just save the recovery one as the new device share
  const deviceShare = recoveryShare;
  const walletAddress = await getAccountAddressFromShares({
    client,
    shares: [recoveryShare, authShare],
  });

  const maybeDeviceShare = await storeShares({
    client,
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
