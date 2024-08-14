import type { AsyncStorage } from "../../../../utils/storage/AsyncStorage.js";
import type { EcosystemWalletId } from "../../../wallet-types.js";
import {
  AUTH_TOKEN_LOCAL_STORAGE_NAME,
  DEVICE_SHARE_LOCAL_STORAGE_NAME,
  PASSKEY_CREDENTIAL_ID_LOCAL_STORAGE_NAME,
  WALLET_CONNECT_SESSIONS_LOCAL_STORAGE_NAME,
  WALLET_USER_ID_LOCAL_STORAGE_NAME,
} from "../constants/settings.js";

const data = new Map<string, string>();

/**
 * @internal
 */
export class ClientScopedStorage {
  protected key: string;
  protected storage: AsyncStorage | null;
  /**
   * @internal
   */
  constructor({
    storage,
    clientId,
    ecosystemId,
  }: {
    storage: AsyncStorage | null;
    clientId: string;
    ecosystemId?: EcosystemWalletId;
  }) {
    this.storage = storage;
    this.key = getLocalStorageKey(clientId, ecosystemId);
  }

  protected async getItem(key: string): Promise<string | null> {
    if (this.storage) {
      return this.storage.getItem(key);
    }
    return data.get(key) ?? null;
  }

  protected async setItem(key: string, value: string): Promise<void> {
    if (this.storage) {
      return this.storage.setItem(key, value);
    }
    data.set(key, value);
  }

  protected async removeItem(key: string): Promise<boolean> {
    const item = await this.getItem(key);
    if (this.storage && item) {
      this.storage.removeItem(key);
      return true;
    }
    return false;
  }

  /**
   * @internal
   */
  async getWalletConnectSessions(): Promise<string | null> {
    return this.getItem(WALLET_CONNECT_SESSIONS_LOCAL_STORAGE_NAME(this.key));
  }

  /**
   * @internal
   */
  async saveWalletConnectSessions(stringifiedSessions: string): Promise<void> {
    await this.setItem(
      WALLET_CONNECT_SESSIONS_LOCAL_STORAGE_NAME(this.key),
      stringifiedSessions,
    );
  }

  /**
   * @internal
   */
  async savePasskeyCredentialId(id: string): Promise<void> {
    await this.setItem(PASSKEY_CREDENTIAL_ID_LOCAL_STORAGE_NAME(this.key), id);
  }

  /**
   * @internal
   */
  async getPasskeyCredentialId(): Promise<string | null> {
    return this.getItem(PASSKEY_CREDENTIAL_ID_LOCAL_STORAGE_NAME(this.key));
  }

  /**
   * @internal
   */
  async saveAuthCookie(cookie: string): Promise<void> {
    await this.setItem(AUTH_TOKEN_LOCAL_STORAGE_NAME(this.key), cookie);
  }
  /**
   * @internal
   */
  async getAuthCookie(): Promise<string | null> {
    return this.getItem(AUTH_TOKEN_LOCAL_STORAGE_NAME(this.key));
  }
  /**
   * @internal
   */
  async removeAuthCookie(): Promise<boolean> {
    return this.removeItem(AUTH_TOKEN_LOCAL_STORAGE_NAME(this.key));
  }

  /**
   * @internal
   */
  async saveDeviceShare(share: string, userId: string): Promise<void> {
    await this.saveWalletUserId(userId);
    await this.setItem(
      DEVICE_SHARE_LOCAL_STORAGE_NAME(this.key, userId),
      share,
    );
  }
  /**
   * @internal
   */
  async getDeviceShare(): Promise<string | null> {
    const userId = await this.getWalletUserId();
    if (userId) {
      return this.getItem(DEVICE_SHARE_LOCAL_STORAGE_NAME(this.key, userId));
    }
    return null;
  }
  /**
   * @internal
   */
  async removeDeviceShare(): Promise<boolean> {
    const userId = await this.getWalletUserId();
    if (userId) {
      return this.removeItem(DEVICE_SHARE_LOCAL_STORAGE_NAME(this.key, userId));
    }
    return false;
  }

  /**
   * @internal
   */
  async getWalletUserId(): Promise<string | null> {
    return this.getItem(WALLET_USER_ID_LOCAL_STORAGE_NAME(this.key));
  }
  /**
   * @internal
   */
  async saveWalletUserId(userId: string): Promise<void> {
    await this.setItem(WALLET_USER_ID_LOCAL_STORAGE_NAME(this.key), userId);
  }
  /**
   * @internal
   */
  async removeWalletUserId(): Promise<boolean> {
    return this.removeItem(WALLET_USER_ID_LOCAL_STORAGE_NAME(this.key));
  }
}

const getLocalStorageKey = (clientId: string, ecosystemId?: string) => {
  return `${clientId}${ecosystemId ? `-${ecosystemId}` : ""}`;
};
