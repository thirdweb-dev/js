import AsyncStorage from "@react-native-async-storage/async-storage";
import { stringify } from "../../../../../utils/json.js";
import {
  DEVICE_SHARE_LOCAL_STORAGE_NAME,
  WALLET_USER_DETAILS_LOCAL_STORAGE_NAME,
  WALLET_USER_ID_LOCAL_STORAGE_NAME,
} from "../../../core/constants/settings.js";
import { DEVICE_SHARE_MISSING_MESSAGE } from "../constants.js";

const getItemFromAsyncStorage = async (key: string) => {
  // @ts-ignore - default import buils but ts doesn't like it
  return AsyncStorage.getItem(key);
};

const setItemInAsyncStorage = async (key: string, value: string) => {
  // @ts-ignore - default import buils but ts doesn't like it
  await AsyncStorage.setItem(key, value);
};

const removeItemInAsyncStorage = async (key: string) => {
  // @ts-ignore - default import buils but ts doesn't like it
  await AsyncStorage.removeItem(key);
};

// export async function getAuthTokenClient(clientId: string) {
//   return getItemFromAsyncStorage(AUTH_TOKEN_LOCAL_STORAGE_NAME(clientId));
// }

// export async function setAuthTokenClient(
//   cookieString: string,
//   clientId: string,
// ): Promise<void> {
//   const authToken = AUTH_TOKEN_LOCAL_STORAGE_NAME(clientId);
//   await setItemInAsyncStorage(authToken, cookieString);
// }

// export async function removeAuthTokenInClient(
//   clientId: string,
// ): Promise<boolean> {
//   const verifiedTokenString = await getAuthTokenClient(clientId);
//   if (verifiedTokenString) {
//     await removeItemInAsyncStorage(AUTH_TOKEN_LOCAL_STORAGE_NAME(clientId));
//     return true;
//   }
//   return false;
// }

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

  await setItemInAsyncStorage(
    // ! Keep this in sync with getWalletUserDetails function below
    name,
    stringify({ email: newEmail, userId }),
  );
}

export async function getWalletUserDetails(
  clientId: string,
): Promise<{ userId: string; email?: string } | undefined> {
  const result = await getItemFromAsyncStorage(
    WALLET_USER_DETAILS_LOCAL_STORAGE_NAME(clientId),
  );
  if (!result) {
    return undefined;
  }
  try {
    const parsed = JSON.parse(result);
    return parsed;
  } catch {
    return undefined;
  }
}

export async function removeLoggedInWalletUserId(clientId: string) {
  await removeItemInAsyncStorage(
    WALLET_USER_DETAILS_LOCAL_STORAGE_NAME(clientId),
  );
  await removeItemInAsyncStorage(WALLET_USER_ID_LOCAL_STORAGE_NAME(clientId));
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

  const name = DEVICE_SHARE_LOCAL_STORAGE_NAME(clientId, userDetails.userId);
  await setWallerUserDetails({ clientId, userId: userDetails.userId });
  await setItemInAsyncStorage(name, deviceShare);
  return deviceShare;
}

export async function removeDeviceShare({
  clientId,
}: {
  clientId: string;
}): Promise<void> {
  const userDetails = await getWalletUserDetails(clientId);

  if (!userDetails) {
    throw new Error("Missing wallet user ID");
  }

  const name = DEVICE_SHARE_LOCAL_STORAGE_NAME(clientId, userDetails.userId);
  await removeItemInAsyncStorage(name);
  return;
}

export async function getDeviceShare(clientId: string) {
  const cachedWalletUserId = await getWalletUserDetails(clientId);
  if (!cachedWalletUserId) {
    throw new Error("Missing wallet user ID");
  }
  const name = DEVICE_SHARE_LOCAL_STORAGE_NAME(
    clientId,
    cachedWalletUserId.userId,
  );
  const deviceShareString = await getItemFromAsyncStorage(name);
  if (!deviceShareString) {
    throw new Error(DEVICE_SHARE_MISSING_MESSAGE);
  }

  const deviceShare = deviceShareString;
  return { deviceShare };
}
