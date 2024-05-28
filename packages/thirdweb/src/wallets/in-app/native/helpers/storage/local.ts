import AsyncStorage from "@react-native-async-storage/async-storage";
import type { AuthArgsType } from "../../../core/authentication/type.js";
import {
  AUTH_TOKEN_LOCAL_STORAGE_NAME,
  DEVICE_SHARE_LOCAL_STORAGE_NAME,
  WALLET_USER_DETAILS_LOCAL_STORAGE_NAME,
  WALLET_USER_ID_LOCAL_STORAGE_NAME,
} from "../../../core/constants/settings.js";
import { DEVICE_SHARE_MISSING_MESSAGE } from "../constants.js";

const CONNECTED_EMAIL_LOCAL_STORAGE_NAME = "embedded-wallet-connected-email";
const CONNECTED_AUTH_STRATEGY_LOCAL_STORAGE_NAME =
  "embedded-wallet-connected-auth-params";

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

export async function getConnectedEmail() {
  return getItemFromAsyncStorage(CONNECTED_EMAIL_LOCAL_STORAGE_NAME);
}

export async function saveConnectedEmail(email: string) {
  await setItemInAsyncStorage(CONNECTED_EMAIL_LOCAL_STORAGE_NAME, email);
}

export async function clearConnectedEmail() {
  await removeItemInAsyncStorage(CONNECTED_EMAIL_LOCAL_STORAGE_NAME);
}

export async function getConnectedAuthStrategy(): Promise<
  AuthArgsType["strategy"] | undefined
> {
  return (await getItemFromAsyncStorage(
    CONNECTED_AUTH_STRATEGY_LOCAL_STORAGE_NAME,
  )) as AuthArgsType["strategy"] | undefined;
}

export async function saveConnectedAuthStrategy(authStrategy: string) {
  await setItemInAsyncStorage(
    CONNECTED_AUTH_STRATEGY_LOCAL_STORAGE_NAME,
    authStrategy,
  );
}

export async function clearConnectedAuthStrategy() {
  await removeItemInAsyncStorage(CONNECTED_AUTH_STRATEGY_LOCAL_STORAGE_NAME);
}

export async function isDeviceSharePresentForUser(
  clientId: string,
  walletUserId?: string,
): Promise<boolean> {
  if (!walletUserId) {
    return false;
  }
  const storedDeviceShare = await getItemFromAsyncStorage(
    DEVICE_SHARE_LOCAL_STORAGE_NAME(clientId, walletUserId),
  );
  return !!storedDeviceShare;
}

export async function getAuthTokenClient(clientId: string) {
  return getItemFromAsyncStorage(AUTH_TOKEN_LOCAL_STORAGE_NAME(clientId));
}

export async function setAuthTokenClient(
  cookieString: string,
  clientId: string,
): Promise<void> {
  const authToken = AUTH_TOKEN_LOCAL_STORAGE_NAME(clientId);
  await setItemInAsyncStorage(authToken, cookieString);
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

  await setItemInAsyncStorage(
    // ! Keep this in sync with getWalletUserDetails function below
    name,
    JSON.stringify({ userId, email: newEmail }),
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
  } catch (e) {
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
  await setWallerUserDetails({ userId: userDetails.userId, clientId });
  await setItemInAsyncStorage(name, deviceShare);
  return deviceShare;
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
