import { beforeEach, describe, expect, it, vi } from "vitest";
import { createThirdwebClient } from "../../../../client/client.js";
import { getClientFetch } from "../../../../utils/fetch.js";
import type { ClientScopedStorage } from "./client-scoped-storage.js";
import {
  getLinkedProfilesInternal,
  linkAccount,
  unlinkAccount,
} from "./linkAccount.js";
import type { Profile } from "./types.js";

vi.mock("../../../../utils/fetch.js");

describe("Account linking functions", () => {
  const mockClient = createThirdwebClient({ clientId: "mock-client-id" });
  const mockStorage = {
    getAuthCookie: vi.fn(),
  } as unknown as ClientScopedStorage;
  const mockFetch = vi.fn();
  const mockLinkedAccounts = [
    { details: { email: "user@example.com" }, type: "email" },
    { details: { phone: "1234567890" }, type: "phone" },
    { details: { address: "0x123456789" }, type: "wallet" },
  ] satisfies Profile[];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getClientFetch).mockReturnValue(mockFetch);
    vi.mocked(mockStorage.getAuthCookie).mockResolvedValue("mock-token");
    mockFetch.mockResolvedValue({
      json: () => Promise.resolve({ linkedAccounts: mockLinkedAccounts }),
      ok: true,
    });
  });

  describe("linkAccount", () => {
    it("should successfully link an account", async () => {
      const result = await linkAccount({
        client: mockClient,
        storage: mockStorage,
        tokenToLink: "token-to-link",
      });

      expect(mockFetch).toHaveBeenCalledWith(
        "https://embedded-wallet.thirdweb.com/api/2024-05-05/account/connect",
        {
          body: JSON.stringify({
            accountAuthTokenToConnect: "token-to-link",
          }),
          headers: {
            Authorization: "Bearer iaw-auth-token:mock-token",
            "Content-Type": "application/json",
          },
          method: "POST",
        },
      );
      expect(result).toEqual(mockLinkedAccounts);
    });

    it("should throw error when no user is logged in", async () => {
      vi.mocked(mockStorage.getAuthCookie).mockResolvedValue(null);

      await expect(
        linkAccount({
          client: mockClient,
          storage: mockStorage,
          tokenToLink: "token-to-link",
        }),
      ).rejects.toThrow("Failed to link account, no user logged in");
    });
  });

  describe("unlinkAccount", () => {
    const profileToUnlink = {
      details: { email: "user@example.com" },
      type: "email",
    } satisfies Profile;
    it("should successfully unlink an account", async () => {
      const result = await unlinkAccount({
        client: mockClient,
        profileToUnlink,
        storage: mockStorage,
      });

      expect(mockFetch).toHaveBeenCalledWith(
        "https://embedded-wallet.thirdweb.com/api/2024-05-05/account/disconnect",
        {
          body: JSON.stringify({
            allowAccountDeletion: false,
            details: profileToUnlink.details,
            type: profileToUnlink.type,
          }),
          headers: {
            Authorization: "Bearer iaw-auth-token:mock-token",
            "Content-Type": "application/json",
          },
          method: "POST",
        },
      );
      expect(result).toEqual(mockLinkedAccounts);
    });

    it("should successfully unlink an account with allowAccountDeletion", async () => {
      const result = await unlinkAccount({
        allowAccountDeletion: true,
        client: mockClient,
        profileToUnlink,
        storage: mockStorage,
      });

      expect(mockFetch).toHaveBeenCalledWith(
        "https://embedded-wallet.thirdweb.com/api/2024-05-05/account/disconnect",
        {
          body: JSON.stringify({
            allowAccountDeletion: true,
            details: profileToUnlink.details,
            type: profileToUnlink.type,
          }),
          headers: {
            Authorization: "Bearer iaw-auth-token:mock-token",
            "Content-Type": "application/json",
          },
          method: "POST",
        },
      );
      expect(result).toEqual(mockLinkedAccounts);
    });

    it("should throw error when no user is logged in", async () => {
      vi.mocked(mockStorage.getAuthCookie).mockResolvedValue(null);

      await expect(
        unlinkAccount({
          client: mockClient,
          profileToUnlink,
          storage: mockStorage,
        }),
      ).rejects.toThrow("Failed to unlink account, no user logged in");
    });
    it("should handle API errors", async () => {
      mockFetch.mockResolvedValue({
        json: () => Promise.resolve({ message: "API Error" }),
        ok: false,
      });

      await expect(
        unlinkAccount({
          client: mockClient,
          profileToUnlink,
          storage: mockStorage,
        }),
      ).rejects.toThrow("API Error");
    });
  });

  describe("getLinkedProfilesInternal", () => {
    it("should successfully get linked profiles", async () => {
      const result = await getLinkedProfilesInternal({
        client: mockClient,
        storage: mockStorage,
      });

      expect(mockFetch).toHaveBeenCalledWith(
        "https://embedded-wallet.thirdweb.com/api/2024-05-05/accounts",
        {
          headers: {
            Authorization: "Bearer iaw-auth-token:mock-token",
            "Content-Type": "application/json",
          },
          method: "GET",
        },
      );
      expect(result).toEqual(mockLinkedAccounts);
    });

    it("should handle API errors", async () => {
      mockFetch.mockResolvedValue({
        json: () => Promise.resolve({ message: "API Error" }),
        ok: false,
      });

      await expect(
        getLinkedProfilesInternal({
          client: mockClient,
          storage: mockStorage,
        }),
      ).rejects.toThrow("API Error");
    });
  });
});
