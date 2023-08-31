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
  console.log("get item from local storage", key, result);
  return result;
};
const setItemInAsyncStorage = async (key: string, value: string) => {
  storage.set(key, value);
  console.log("set item in local storage", key, value);
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

export async function getAuthTokenClient(clientId: string) {
  console.log(
    "getAuthShareClient: clientId",
    AUTH_TOKEN_LOCAL_STORAGE_NAME(clientId),
  );
  return getItemFromAsyncStorage(AUTH_TOKEN_LOCAL_STORAGE_NAME(clientId));
}
export async function setAuthTokenClient(
  cookieString: string,
  clientId: string,
): Promise<void> {
  const authToken = AUTH_TOKEN_LOCAL_STORAGE_NAME(clientId);
  console.log("setAuthShareClient: authToken", authToken, !!cookieString);
  setItemInAsyncStorage(authToken, cookieString);
}
export async function removeAuthTokenInClient(
  clientId: string,
): Promise<boolean> {
  const verifiedTokenString = await getAuthTokenClient(clientId);
  if (verifiedTokenString) {
    await removeItemInAsyncStorage(AUTH_TOKEN_LOCAL_STORAGE_NAME(clientId));
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

  const name = WALLET_USER_DETAILS_LOCAL_STORAGE_NAME(clientId);
  // console.log("setWallerUserDetails: name", name);

  await setItemInAsyncStorage(
    // ! Keep this in sync with getWalletUserDetails function below
    name,
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
  // console.log("setDeviceShare");
  const userDetails = await getWalletUserDetails(clientId);

  // console.log("setDeviceShare: userDetails");
  if (!userDetails) {
    throw new Error("Missing wallet user ID");
  }

  const name = DEVICE_SHARE_LOCAL_STORAGE_NAME(clientId, userDetails.userId);
  // console.log("setDeviceShare: name, deviceShare", name, deviceShare);
  await setWallerUserDetails({ userId: userDetails.userId, clientId });
  await setItemInAsyncStorage(name, deviceShare);
  return deviceShare;
}

export async function getDeviceShare(clientId: string) {
  const cachedWalletUserId = await getWalletUserDetails(clientId);
  // console.log("getDeviceShare: cachedWalletUserId", cachedWalletUserId);
  if (!cachedWalletUserId) {
    throw new Error("Missing wallet user ID");
  }
  const name = DEVICE_SHARE_LOCAL_STORAGE_NAME(
    clientId,
    cachedWalletUserId.userId,
  );
  // console.log("getDeviceShare: name", name);
  const deviceShareString = getItemFromAsyncStorage(name);
  // console.log("getDeviceShare: deviceShareString", deviceShareString);
  if (!deviceShareString) {
    throw new Error(DEVICE_SHARE_MISSING_MESSAGE);
  }

  const deviceShare = deviceShareString;
  return { deviceShare };
}
