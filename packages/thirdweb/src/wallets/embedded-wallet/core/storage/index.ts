import type { ThirdwebClient } from "../../../../client/client.js";
import type { AuthUserType } from "../authentication/type.js";
import type { AccountDetailType } from "../wallet/type.js";
import type {
  EncryptionType,
  LoadKeyType,
  LoadKeyValueType,
  SaveKeyType,
  SaveKeyValueType,
  StorageType,
  WalletStorageFormatType,
} from "./type.js";

/**
 * Gets the auth token from the user
 * @param authUser - The authenticated user
 * @example
 * ```ts
 * const token = await getUserAuthToken(authUser);
 * ```
 * @throws if an authenticated user is not provided
 * @returns The auth token
 */
const getUserAuthToken = async (authUser?: AuthUserType) => {
  const { StorageError } = await import("./error.js");

  const token = authUser?.authToken;
  if (!token) {
    throw new StorageError(
      "An authenticated user is required to save the key material with thirdweb",
    );
  }
  return token;
};

/**
 * Sends an encrypted share / key to thirdweb for storage
 * @param arg - The arguments for saving an encrypted key material to thirdweb
 * @param arg.encryptValue - The function to be called to encrypt the value before sending it to thirdweb.
 * @throws if developer is not on thirdweb managed storage
 * @example
 * ```ts
 * import { saveEncryptedInThirdweb } from "thirdweb/wallets/embedded-wallet/core/storage";
 *
 * const saveEncryptedInThirdweb = saveEncryptedInThirdweb({
 *  encryptValue: async ({ value }) => {
 *   return superStrongEncryption(value);
 *  }
 * });
 * ```
 * @returns A function that saves an encrypted key material to thirdweb
 */
export const saveEncryptedInThirdweb = (arg: {
  encryptValue: EncryptionType;
}): SaveKeyType => {
  return async ({ accountDetail, uniqueId, keyMaterial, authUser }) => {
    const { ROUTE_STORAGE } = await import("../routes.js");
    const { StorageError } = await import("./error.js");

    const secretKey = accountDetail.client.secretKey;
    if (!secretKey && !authUser) {
      throw new StorageError(
        "Either a client with secret key or and authenticated user is required to save the key material with thirdweb",
      );
    }

    const encrypted = await arg.encryptValue({ value: keyMaterial });
    if (encrypted === keyMaterial) {
      throw new StorageError(
        "Invalid encryption. The encrypted value must not be the same as the original value",
      );
    }
    const token = await getUserAuthToken(authUser);

    const saveResp = await fetch(
      ROUTE_STORAGE({
        uniqueId,
        type: "encrypted",
        accountId: accountDetail.accountId,
      }),
      {
        method: "POST",
        headers: {
          "x-secret-key": secretKey ?? "",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accountDetail,
          uniqueId,
          value: encrypted,
        }),
      },
    );
    if (!saveResp.ok) {
      throw new StorageError(
        "Failed to save encrypted key material to thirdweb.",
      );
    }
  };
};

/**
 * Sends a share to thirdweb unedited
 * @throws if used with format === "privateKey"
 * @throws if developer is not on thirdweb managed storage
 * @example
 * ```ts
 * import { saveInThirdweb } from "thirdweb/wallets/embedded-wallet/core/storage";
 *
 * const saveInThirdweb = saveInThirdweb();
 * ```
 * @returns A function that saves the key material to thirdweb
 */
export const saveInThirdweb = (): SaveKeyType => {
  return async ({ accountDetail, uniqueId, keyMaterial, authUser }) => {
    const { ROUTE_STORAGE } = await import("../routes.js");
    const { StorageError } = await import("./error.js");

    const secretKey = accountDetail.client.secretKey;
    if (!secretKey && !authUser) {
      throw new StorageError(
        "Either a client with secret key or and authenticated user is required to save the key material with thirdweb",
      );
    }

    if (accountDetail.format === "privateKey") {
      throw new StorageError(
        "Invalid storage format. format must be 'sharded' to use saveInThirdweb",
      );
    }

    const token = await getUserAuthToken(authUser);

    const saveResp = await fetch(
      ROUTE_STORAGE({
        uniqueId,
        type: "basic",
        accountId: accountDetail.accountId,
      }),
      {
        method: "POST",
        headers: {
          "x-secret-key": secretKey ?? "",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          accountDetail,
          uniqueId,
          value: keyMaterial,
        }),
      },
    );
    if (!saveResp.ok) {
      throw new StorageError(
        "Failed to save encrypted key material to thirdweb.",
      );
    }
  };
};

/**
 * Sends a key material to a key value store
 * @param arg - The arguments for saving the key material to a key value store
 * @param arg.preSave - Optional. A function to be called before the key is saved. This is useful performing any checks before the storage happens. Throw to abort the storage.
 * @param arg.saveItem - a function to be called to save the key, value pair.
 * @example
 * ```ts
 * import { saveInKeyValueStore } from "thirdweb/wallets/embedded-wallet/core/storage";
 *
 * const saveToLocalStorage = saveInKeyValueStore({
 *    saveItem: async ({ key, value }) => {
 *      localStorage.setItem(key, value);
 *    }
 * });
 * ```
 * @returns A function that saves the key material to a key value store
 */
export const saveInKeyValueStore = (arg: {
  preSave?: (args: {
    accountDetail: AccountDetailType;
    authUser: AuthUserType | undefined;
  }) => Promise<void> | void;
  saveItem: SaveKeyValueType;
}): SaveKeyType => {
  return async ({ uniqueId, keyMaterial, accountDetail, authUser }) => {
    await arg.preSave?.({ accountDetail, authUser });
    await arg.saveItem({
      key: uniqueId,
      value: keyMaterial,
    });
  };
};

/**
 * Gets an encrypted key material from thirdweb to be decrypted
 * @param arg - The arguments for loading an encrypted key material from thirdweb
 * @param arg.decryptValue - The function to be called to decrypt the value
 * @throws if dev is not on managed storage
 * @example
 * ```ts
 * import { loadEncryptedFromThirdweb } from "thirdweb/wallets/embedded-wallet/core/storage";
 *
 * const loadEncryptedFromThirdweb = loadEncryptedFromThirdweb({
 *   decryptValue: async ({ value }) => {
 *    return superStrongDecryption(value);
 *   }
 * });
 * ```
 * @returns A function that loads an encrypted key material from thirdweb
 */
export const loadEncryptedFromThirdweb = (arg: {
  decryptValue: EncryptionType;
}): LoadKeyType => {
  return async ({ accountDetail, authUser, uniqueId }) => {
    const { ROUTE_STORAGE } = await import("../routes.js");
    const { StorageError } = await import("./error.js");

    const secretKey = accountDetail.client.secretKey;
    if (!secretKey && !authUser) {
      throw new StorageError(
        "Either a client with secret key or and authenticated user is required to load the key material from thirdweb",
      );
    }

    const token = await getUserAuthToken(authUser);

    const encryptedKeyMaterialResp = await fetch(
      ROUTE_STORAGE({
        uniqueId,
        type: "encrypted",
        accountId: accountDetail.accountId,
      }),
      {
        method: "GET",
        headers: {
          "x-secret-key": secretKey ?? "",
          Authorization: `Bearer ${token}`,
        },
      },
    );
    if (!encryptedKeyMaterialResp.ok) {
      throw new StorageError(
        "Failed to get encrypted key material from thirdweb.",
      );
    }
    const { value }: { value: string } = await encryptedKeyMaterialResp.json();
    return await arg.decryptValue({ value });
  };
};

/**
 * Grabs a key material to thirdweb
 * @throws if used with getPrivateKey
 * @throws if dev is not on managed storage
 * @example
 * ```ts
 * import { loadFromThirdweb } from "thirdweb/wallets/embedded-wallet/core/storage";
 *
 * const loadFromThirdweb = loadFromThirdweb();
 * ```
 * @returns A function that loads the key material from thirdweb
 */
export const loadFromThirdweb = (): LoadKeyType => {
  return async ({ accountDetail, authUser, uniqueId }) => {
    const { ROUTE_STORAGE } = await import("../routes.js");
    const { StorageError } = await import("./error.js");

    const secretKey = accountDetail.client.secretKey;
    if (!secretKey && !authUser) {
      throw new StorageError(
        "Either a client with secret key or and authenticated user is required to load the key material from thirdweb",
      );
    }

    if (accountDetail.format === "privateKey") {
      throw new StorageError(
        "Invalid storage format. format must be 'sharded' to use loadFromThirdweb",
      );
    }

    const token = await getUserAuthToken(authUser);

    const keyMaterialResp = await fetch(
      ROUTE_STORAGE({
        uniqueId,
        type: "basic",
        accountId: accountDetail.accountId,
      }),
      {
        method: "GET",
        headers: {
          "x-secret-key": secretKey ?? "",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!keyMaterialResp.ok) {
      throw new StorageError("Failed to get key material from thirdweb.");
    }
    const { value }: { value: string } = await keyMaterialResp.json();
    return value;
  };
};

/**
 * Load the key material from a key value store
 * @param arg - The arguments for loading the key material from a key value store
 * @param arg.preLoad - Optional. A function to be called before the key is loaded. This is useful performing any checks before the load happens. Throw to abort the load.
 * @param arg.loadItem - a function to be called to load the key, value pair.
 * @example
 * ```ts
 * import { loadFromKeyValueStore } from "thirdweb/wallets/embedded-wallet/core/storage";
 *
 * const loadFromLocalStorage = loadFromKeyValueStore({
 *  loadItem: async ({ key }) => {
 *   return localStorage.getItem(key);
 *  }
 * });
 * ```
 * @returns A function that loads the key material from a key value store
 */
export const loadFromKeyValueStore = (arg: {
  preLoad?: (args: {
    accountDetail: AccountDetailType;
    authUser: AuthUserType | undefined;
  }) => Promise<void> | void;
  loadItem: LoadKeyValueType;
}): LoadKeyType => {
  return async ({ uniqueId, accountDetail, authUser }) => {
    await arg.preLoad?.({ accountDetail, authUser });
    return await arg.loadItem({
      key: uniqueId,
    });
  };
};

/**
 * Create a thirdweb managed storage for the wallet
 * @param arg - The arguments for creating a thirdweb managed storage
 * @param arg.client - The thirdweb client
 * @param arg.authUser - The authenticated user
 * @param arg.defaultFormat - The default format of how wallets will be stored.
 * @param arg.encryptValue - The function to be called to encrypt the value before sending it to thirdweb.
 * @param arg.decryptValue - The function to be called to decrypt the value when loading an encrypted wallet
 * @param arg.saveKeyValue - a function to be called to save the key, value pair.
 * @param arg.loadKeyValue - a function to be called to load the key, value pair.
 * @example
 * ```ts
 * import { createManagedStorage } from "thirdweb/wallets/embedded-wallet/core/storage";
 *
 * const storage = createManagedStorage({
 *    client,
 *    authUser,
 *    format: "sharded",
 *    encryptValue: async ({ value }) => {
 *      return superStrongEncryption(value);
 *    },
 *    decryptValue: async ({ value }) => {
 *      return superStrongDecryption(value);
 *    },
 *    saveKeyValue: async ({ key, value }) => {
 *      localStorage.setItem(key, value);
 *    },
 *    loadKeyValue: async ({ key }) => {
 *      return localStorage.getItem(key);
 *    }
 * });
 * ```
 * @returns A storage object for the wallet that can be used to save and load the wallet
 */
export const createManagedStorage = ({
  client,
  decryptValue,
  defaultFormat,
  encryptValue,
  loadKeyValue,
  saveKeyValue,
  authUser,
}: {
  client: ThirdwebClient;
  authUser?: AuthUserType;
  defaultFormat: WalletStorageFormatType;
  encryptValue: EncryptionType;
  decryptValue: EncryptionType;
  saveKeyValue: SaveKeyValueType;
  loadKeyValue: LoadKeyValueType;
}): StorageType => {
  return {
    client,
    defaultFormat,
    authUser,
    privateKey: {
      save: saveEncryptedInThirdweb({
        encryptValue: encryptValue,
      }),
      load: loadEncryptedFromThirdweb({
        decryptValue: decryptValue,
      }),
    },
    sharded: {
      shareA: {
        save: saveInKeyValueStore({
          saveItem: saveKeyValue,
        }),
        load: loadFromKeyValueStore({
          loadItem: loadKeyValue,
        }),
      },
      shareB: {
        save: saveEncryptedInThirdweb({
          encryptValue: encryptValue,
        }),
        load: loadEncryptedFromThirdweb({
          decryptValue: decryptValue,
        }),
      },
      shareC: {
        save: saveInThirdweb(),
        load: loadFromThirdweb(),
      },
    },
  };
};
