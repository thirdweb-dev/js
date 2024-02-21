import {
  AUTH_TOKEN_LOCAL_STORAGE_NAME,
  DEVICE_SHARE_LOCAL_STORAGE_NAME,
  WALLET_USER_ID_LOCAL_STORAGE_NAME,
} from "../../constants/settings.js";

const data = new Map<string, string>();

/**
 * @internal
 */
export class LocalStorage {
  protected isSupported: boolean;
  protected clientId: string;
  /**
   * @internal
   */
  constructor({ clientId }: { clientId: string }) {
    this.isSupported = typeof window !== "undefined" && !!window.localStorage;
    this.clientId = clientId;
  }

  protected async getItem(key: string): Promise<string | null> {
    if (this.isSupported) {
      return window.localStorage.getItem(key);
    } else {
      return data.get(key) ?? null;
    }
  }

  protected async setItem(key: string, value: string): Promise<void> {
    if (this.isSupported) {
      return window.localStorage.setItem(key, value);
    } else {
      data.set(key, value);
    }
  }

  protected async removeItem(key: string): Promise<boolean> {
    const item = await this.getItem(key);
    if (this.isSupported && item) {
      window.localStorage.removeItem(key);
      return true;
    }
    return false;
  }

  /**
   * @internal
   */
  async saveAuthCookie(cookie: string): Promise<void> {
    await this.setItem(AUTH_TOKEN_LOCAL_STORAGE_NAME(this.clientId), cookie);
  }
  /**
   * @internal
   */
  async getAuthCookie(): Promise<string | null> {
    return this.getItem(AUTH_TOKEN_LOCAL_STORAGE_NAME(this.clientId));
  }
  /**
   * @internal
   */
  async removeAuthCookie(): Promise<boolean> {
    return this.removeItem(AUTH_TOKEN_LOCAL_STORAGE_NAME(this.clientId));
  }

  /**
   * @internal
   */
  async saveDeviceShare(share: string, userId: string): Promise<void> {
    await this.saveWalletUserId(userId);
    await this.setItem(
      DEVICE_SHARE_LOCAL_STORAGE_NAME(this.clientId, userId),
      share,
    );
  }
  /**
   * @internal
   */
  async getDeviceShare(): Promise<string | null> {
    const userId = await this.getWalletUserId();
    if (userId) {
      return this.getItem(
        DEVICE_SHARE_LOCAL_STORAGE_NAME(this.clientId, userId),
      );
    }
    return null;
  }
  /**
   * @internal
   */
  async removeDeviceShare(): Promise<boolean> {
    const userId = await this.getWalletUserId();
    if (userId) {
      return this.removeItem(
        DEVICE_SHARE_LOCAL_STORAGE_NAME(this.clientId, userId),
      );
    }
    return false;
  }

  /**
   * @internal
   */
  async getWalletUserId(): Promise<string | null> {
    return this.getItem(WALLET_USER_ID_LOCAL_STORAGE_NAME(this.clientId));
  }
  /**
   * @internal
   */
  async saveWalletUserId(userId: string): Promise<void> {
    await this.setItem(
      WALLET_USER_ID_LOCAL_STORAGE_NAME(this.clientId),
      userId,
    );
  }
  /**
   * @internal
   */
  async removeWalletUserId(): Promise<boolean> {
    return this.removeItem(WALLET_USER_ID_LOCAL_STORAGE_NAME(this.clientId));
  }
}
