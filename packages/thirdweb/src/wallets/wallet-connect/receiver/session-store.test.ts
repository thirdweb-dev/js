import { beforeEach, describe, expect, it, vi } from "vitest";
import { LocalStorage } from "../../in-app/web/utils/Storage/LocalStorage.js";
import * as SessionStore from "./session-store.js";

vi.mock("../../in-app/web/utils/Storage/LocalStorage.js");

const mockLocalStorage = {
  getWalletConnectSessions: vi.fn(),
  saveWalletConnectSessions: vi.fn(),
};

describe("SessionStore", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    SessionStore.setWalletConnectSessions(undefined);
  });

  describe("initializeSessionStore", () => {
    it("initializes the session store with a new LocalStorage instance if not already initialized", () => {
      expect(SessionStore.walletConnectSessions).toBeUndefined();
      SessionStore.initializeSessionStore({ clientId: "test-client-id" });
      expect(SessionStore.walletConnectSessions).toBeInstanceOf(LocalStorage);
    });

    it("does not reinitialize the session store if it is already initialized", () => {
      SessionStore.setWalletConnectSessions(
        mockLocalStorage as unknown as LocalStorage,
      );
      SessionStore.initializeSessionStore({ clientId: "test-client-id" });
      expect(SessionStore.walletConnectSessions).toBe(mockLocalStorage);
    });
  });

  describe("getSessions", () => {
    it("returns an empty array if walletConnectSessions is not initialized", async () => {
      const sessions = await SessionStore.getSessions();
      expect(sessions).toEqual([]);
    });

    it("returns parsed sessions from storage", async () => {
      SessionStore.setWalletConnectSessions(
        mockLocalStorage as unknown as LocalStorage,
      );
      mockLocalStorage.getWalletConnectSessions.mockResolvedValue(
        JSON.stringify([{ topic: "123" }]),
      );
      const sessions = await SessionStore.getSessions();
      expect(sessions).toEqual([{ topic: "123" }]);
    });
  });

  describe("saveSession", () => {
    it("does nothing if walletConnectSessions is not initialized", async () => {
      await SessionStore.saveSession({ topic: "123" });
      expect(mockLocalStorage.saveWalletConnectSessions).not.toHaveBeenCalled();
    });

    it("saves a new session to the existing sessions", async () => {
      SessionStore.setWalletConnectSessions(
        mockLocalStorage as unknown as LocalStorage,
      );
      mockLocalStorage.getWalletConnectSessions.mockResolvedValue(
        JSON.stringify([{ topic: "123" }]),
      );
      await SessionStore.saveSession({ topic: "456" });
      expect(mockLocalStorage.saveWalletConnectSessions).toHaveBeenCalledWith(
        JSON.stringify([{ topic: "123" }, { topic: "456" }]),
      );
    });
  });

  describe("removeSession", () => {
    it("does nothing if walletConnectSessions is not initialized", async () => {
      await SessionStore.removeSession({ topic: "123" });
      expect(mockLocalStorage.saveWalletConnectSessions).not.toHaveBeenCalled();
    });

    it("removes a session from the existing sessions", async () => {
      SessionStore.setWalletConnectSessions(
        mockLocalStorage as unknown as LocalStorage,
      );
      mockLocalStorage.getWalletConnectSessions.mockResolvedValue(
        JSON.stringify([{ topic: "123" }, { topic: "456" }]),
      );
      await SessionStore.removeSession({ topic: "123" });
      expect(mockLocalStorage.saveWalletConnectSessions).toHaveBeenCalledWith(
        JSON.stringify([{ topic: "456" }]),
      );
    });
  });
});
