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
    { type: "email", details: { email: "user@example.com" } },
    { type: "phone", details: { phone: "1234567890" } },
    { type: "wallet", details: { address: "0x123456789" } },
  ] satisfies Profile[];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getClientFetch).mockReturnValue(mockFetch);
    vi.mocked(mockStorage.getAuthCookie).mockResolvedValue("mock-token");
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ linkedAccounts: mockLinkedAccounts }),
    });
  });

  describe("linkAccount", () => {
    it("should successfully link an account", async () => {
      const result = await linkAccount({
        client: mockClient,
        tokenToLink: "token-to-link",
        storage: mockStorage,
      });

      expect(mockFetch).toHaveBeenCalledWith(
        "https://embedded-wallet.thirdweb.com/api/2024-05-05/account/connect",
        {
          method: "POST",
          headers: {
            Authorization: "Bearer iaw-auth-token:mock-token",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            accountAuthTokenToConnect: "token-to-link",
          }),
        },
      );
      expect(result).toEqual(mockLinkedAccounts);
    });

    it("should throw error when no user is logged in", async () => {
      vi.mocked(mockStorage.getAuthCookie).mockResolvedValue(null);

      await expect(
        linkAccount({
          client: mockClient,
          tokenToLink: "token-to-link",
          storage: mockStorage,
        }),
      ).rejects.toThrow("Failed to link account, no user logged in");
    });
  });

  describe("unlinkAccount", () => {
    const profileToUnlink = {
      type: "email",
      details: { email: "user@example.com" },
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
          method: "POST",
          headers: {
            Authorization: "Bearer iaw-auth-token:mock-token",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(profileToUnlink),
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
        ok: false,
        json: () => Promise.resolve({ message: "API Error" }),
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
          method: "GET",
          headers: {
            Authorization: "Bearer iaw-auth-token:mock-token",
            "Content-Type": "application/json",
          },
        },
      );
      expect(result).toEqual(mockLinkedAccounts);
    });

    it("should handle API errors", async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({ message: "API Error" }),
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
