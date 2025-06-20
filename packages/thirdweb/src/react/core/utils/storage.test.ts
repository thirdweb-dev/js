import { beforeEach, describe, expect, it, vi } from "vitest";
import type { AsyncStorage } from "../../../utils/storage/AsyncStorage.js";
import type { AuthArgsType } from "../../../wallets/in-app/core/authentication/types.js";
import {
  getLastAuthProvider,
  LAST_AUTH_PROVIDER_STORAGE_KEY,
  setLastAuthProvider,
} from "./storage.js";

describe("Auth Provider Storage", () => {
  let mockStorage: AsyncStorage;

  beforeEach(() => {
    mockStorage = {
      getItem: vi.fn(),
      removeItem: vi.fn(),
      setItem: vi.fn(),
    };
  });

  describe("setLastAuthProvider", () => {
    it("should store the auth provider in storage", async () => {
      const authProvider: AuthArgsType["strategy"] = "email";
      await setLastAuthProvider(authProvider, mockStorage);

      expect(mockStorage.setItem).toHaveBeenCalledWith(
        LAST_AUTH_PROVIDER_STORAGE_KEY,
        authProvider,
      );
    });
  });

  describe("getLastAuthProvider", () => {
    it("should retrieve the last auth provider from storage", async () => {
      const mockAuthProvider: AuthArgsType["strategy"] = "google";
      vi.mocked(mockStorage.getItem).mockResolvedValue(mockAuthProvider);

      const result = await getLastAuthProvider(mockStorage);

      expect(mockStorage.getItem).toHaveBeenCalledWith(
        LAST_AUTH_PROVIDER_STORAGE_KEY,
      );
      expect(result).toBe(mockAuthProvider);
    });

    it("should return null if no auth provider is stored", async () => {
      vi.mocked(mockStorage.getItem).mockResolvedValue(null);

      const result = await getLastAuthProvider(mockStorage);

      expect(mockStorage.getItem).toHaveBeenCalledWith(
        LAST_AUTH_PROVIDER_STORAGE_KEY,
      );
      expect(result).toBeNull();
    });
  });
});
