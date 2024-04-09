import type { AsyncStorage } from "./AsyncStorage.js";

const CONNECT_PARAMS_MAP_KEY = "tw:connected-wallet-params";

/**
 * Save the connection params to storage for given wallet id
 * It saves an object with wallet id as key and params as value to storage on CONNECT_PARAMS_MAP_KEY
 * CONNECT_PARAMS_MAP_KEY: { walletId1: walletId1Params, walletId2: walletId2Params, ... }
 *
 * @param walletId
 * @param params
 * @internal
 */
export async function saveConnectParamsToStorage<T extends object>(
  storage: AsyncStorage,
  walletId: string,
  params: T,
) {
  // params must be stringifiable
  if (!isStringifiable(params)) {
    throw new Error("given params are not stringifiable");
  }

  const currentValueStr = await storage.getItem(CONNECT_PARAMS_MAP_KEY);

  let value: Record<string, T>;

  if (currentValueStr) {
    try {
      value = JSON.parse(currentValueStr);
    } catch {
      value = {};
    }

    value[walletId] = params;
  } else {
    value = {
      [walletId]: params,
    };
  }

  storage.setItem(CONNECT_PARAMS_MAP_KEY, JSON.stringify(value));
}

/**
 * Save the connection params to storage for given wallet id
 * It saves an object with wallet id as key and params as value to storage on CONNECT_PARAMS_MAP_KEY
 * CONNECT_PARAMS_MAP_KEY: { walletId1: walletId1Params, walletId2: walletId2Params, ... }
 *
 * @param walletId
 * @param params
 * @internal
 */
export async function deleteConnectParamsFromStorage(
  storage: AsyncStorage,
  walletId: string,
) {
  const currentValueStr = await storage.getItem(CONNECT_PARAMS_MAP_KEY);

  let value: Record<string, object>;

  if (currentValueStr) {
    try {
      value = JSON.parse(currentValueStr);
    } catch {
      value = {};
    }

    delete value[walletId];
    storage.setItem(CONNECT_PARAMS_MAP_KEY, JSON.stringify(value));
  }
}

/**
 * Get the saved connection params from storage for given wallet id
 * @internal
 */
export async function getSavedConnectParamsFromStorage<T extends object>(
  storage: AsyncStorage,
  walletId: string,
): Promise<T | null> {
  const valueStr = await storage.getItem(CONNECT_PARAMS_MAP_KEY);

  if (!valueStr) {
    return null;
  }

  try {
    const value = JSON.parse(valueStr);

    if (value?.[walletId]) {
      return value[walletId];
    }

    return null;
  } catch {
    return null;
  }
}

function isStringifiable(value: unknown): boolean {
  try {
    JSON.stringify(value);
    return true;
  } catch {
    return false;
  }
}

/**
 * Wallet that uses a personal wallet must save the connection params to storage of this type
 */
export type WithPersonalWalletConnectionOptions = {
  // last connected personal wallet's id
  personalWalletId: string;
};
