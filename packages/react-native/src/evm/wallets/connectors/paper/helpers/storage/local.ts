import {
  AUTH_TOKEN_LOCAL_STORAGE_NAME,
  DEVICE_SHARE_LOCAL_STORAGE_NAME,
  WALLET_USER_DETAILS_LOCAL_STORAGE_NAME,
} from "@paperxyz/embedded-wallet-service-sdk";
import { MMKV } from "react-native-mmkv";
import { DEVICE_SHARE_MISSING_MESSAGE } from "../constants";

const storage = new MMKV();

const getItemFromAsyncStorage = (key: string) => {
  const result = storage.getString(key);
  return result;
};
const setItemInAsyncStorage = async (key: string, value: string) => {
  storage.set(key, value);
};

const removeItemInAsyncStorage = async (key: string) => {
  storage.delete(key);
};

export async function isDeviceSharePresentForUser(
  clientId: string,
  walletUserId?: string,
): Promise<boolean> {
  if (!walletUserId) {
    return false;
  }
  const storedDeviceShare = getItemFromAsyncStorage(
    DEVICE_SHARE_LOCAL_STORAGE_NAME(clientId, walletUserId),
  );
  return !!storedDeviceShare;
}

export async function getAuthShareClient(clientId: string) {
  return getItemFromAsyncStorage(AUTH_TOKEN_LOCAL_STORAGE_NAME(clientId));
}
export async function setAuthShareClient(
  cookieString: string,
  clientId: string,
): Promise<void> {
  setItemInAsyncStorage(AUTH_TOKEN_LOCAL_STORAGE_NAME(clientId), cookieString);
}
export async function removeAuthShareInClient(
  clientId: string,
): Promise<boolean> {
  const verifiedTokenString = await getAuthShareClient(clientId);
  if (verifiedTokenString) {
    removeItemInAsyncStorage(AUTH_TOKEN_LOCAL_STORAGE_NAME(clientId));
    return true;
  }
  return false;
}

export async function setWallerUserDetails({
  clientId,
  userId,
  email,
}: {
  clientId: string;
  userId: string;
  email?: string;
}) {
  const userDetails = await getWalletUserDetails(clientId);
  let newEmail = email;
  if (userDetails && userDetails.userId === userId && !newEmail) {
    newEmail = userDetails.email;
  }

  await setItemInAsyncStorage(
    // ! Keep this in sync with getWalletUserDetails function below
    WALLET_USER_DETAILS_LOCAL_STORAGE_NAME(clientId),
    JSON.stringify({ userId, email: newEmail }),
  );
}

export async function getWalletUserDetails(
  clientId: string,
): Promise<{ userId: string; email?: string } | undefined> {
  const result = getItemFromAsyncStorage(
    WALLET_USER_DETAILS_LOCAL_STORAGE_NAME(clientId),
  );
  if (!result) {
    return undefined;
  }
  try {
    const parsed = JSON.parse(result);
    return parsed;
  } catch (e) {
    return undefined;
  }
}

export async function removeLoggedInWalletUserId(clientId: string) {
  await removeItemInAsyncStorage(
    WALLET_USER_DETAILS_LOCAL_STORAGE_NAME(clientId),
  );
}

export async function setDeviceShare({
  clientId,
  deviceShare,
}: {
  clientId: string;
  deviceShare: string;
}): Promise<string> {
  const userDetails = await getWalletUserDetails(clientId);
  if (!userDetails) {
    throw new Error("Missing wallet user ID");
  }

  await setWallerUserDetails({ userId: userDetails.userId, clientId });
  await setItemInAsyncStorage(
    DEVICE_SHARE_LOCAL_STORAGE_NAME(clientId, userDetails.userId),
    deviceShare,
  );
  return deviceShare;
}

export async function getDeviceShare(clientId: string) {
  const cachedWalletUserId = await getWalletUserDetails(clientId);
  if (!cachedWalletUserId) {
    throw new Error("Missing wallet user ID");
  }
  const deviceShareString = getItemFromAsyncStorage(
    DEVICE_SHARE_LOCAL_STORAGE_NAME(clientId, cachedWalletUserId.userId),
  );
  if (!deviceShareString) {
    throw new Error(DEVICE_SHARE_MISSING_MESSAGE);
  }

  const deviceShare = deviceShareString;
  return { deviceShare };
}
