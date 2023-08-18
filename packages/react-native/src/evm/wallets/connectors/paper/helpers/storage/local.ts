import {
  AUTH_TOKEN_LOCAL_STORAGE_NAME,
  DEVICE_SHARE_LOCAL_STORAGE_NAME,
} from "@paperxyz/embedded-wallet-service-sdk";
import { MMKV } from "react-native-mmkv";

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
  verifiedTokenJwtString: string,
  clientId: string,
): Promise<void> {
  setItemInAsyncStorage(
    AUTH_TOKEN_LOCAL_STORAGE_NAME(clientId),
    verifiedTokenJwtString,
  );
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
