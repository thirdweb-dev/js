import type { WalletConnectionOptions } from "../interfaces/wallet.js";

export type WalletStorage = {
  get: (key: string) => Promise<string | null>;
  set: (key: string, value: string) => Promise<void>;
  remove: (key: string) => Promise<void>;
};

export const walletStorage: WalletStorage = {
  async get(key: string) {
    return localStorage.getItem(key);
  },
  async set(key: string, value: string) {
    localStorage.setItem(key, value);
  },
  async remove(key: string) {
    localStorage.removeItem(key);
  },
};

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
  walletId: string,
  params: T,
) {
  // params must be stringifiable
  if (!isStringifiable(params)) {
    console.debug("params", params);
    throw new Error("given params are not stringifiable");
  }

  const currentValueStr = await walletStorage.get(CONNECT_PARAMS_MAP_KEY);

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

  walletStorage.set(CONNECT_PARAMS_MAP_KEY, JSON.stringify(value));
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
export async function deleteConnectParamsFromStorage(walletId: string) {
  const currentValueStr = await walletStorage.get(CONNECT_PARAMS_MAP_KEY);

  let value: Record<string, WalletConnectionOptions>;

  if (currentValueStr) {
    try {
      value = JSON.parse(currentValueStr);
    } catch {
      value = {};
    }

    delete value[walletId];
    walletStorage.set(CONNECT_PARAMS_MAP_KEY, JSON.stringify(value));
  }
}

/**
 * Get the saved connection params from storage for given wallet id
 * @internal
 */
export async function getSavedConnectParamsFromStorage<T extends object>(
  walletId: string,
): Promise<T | null> {
  const valueStr = await walletStorage.get(CONNECT_PARAMS_MAP_KEY);

  if (!valueStr) {
    return null;
  }

  try {
    const value = JSON.parse(valueStr);

    if (value && value[walletId]) {
      return value[walletId];
    }

    return null;
  } catch {
    return null;
  }
}

function isStringifiable(value: any): boolean {
  try {
    JSON.stringify(value);
    return true;
  } catch {
    return false;
  }
}
