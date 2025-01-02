import { beforeEach, describe, expect, it, vi } from "vitest";
import { createThirdwebClient } from "../../../../client/client.js";
import { getClientFetch } from "../../../../utils/fetch.js";
import { getUser } from "./getUser.js";

vi.mock("../../../../utils/fetch.js", () => ({
  getClientFetch: vi.fn(),
}));

describe("getUser", () => {
  const mockClient = createThirdwebClient({
    secretKey: "secret",
  });

  const mockFetch = vi.fn();
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getClientFetch).mockReturnValue(mockFetch);
  });

  it("should throw an error if no secret key is provided", async () => {
    await expect(
      getUser({
        client: { ...mockClient, secretKey: undefined },
        walletAddress: "0x123",
      }),
    ).rejects.toThrow(
      "A secret key is required to query for users. If you're making this request from the server, please add a secret key to your client.",
    );
  });

  it("should throw an error if no query parameter is provided", async () => {
    await expect(
      getUser({
        client: mockClient,
      }),
    ).rejects.toThrow(
      "Please provide a walletAddress, email, phone, id, or externalWalletAddress to query for users.",
    );
  });

  it("should call the correct URL with email", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        {
          userId: "user1",
          walletAddress: "0x123",
          email: "test@test.com",
          createdAt: "2023-01-01T00:00:00Z",
          linkedAccounts: [],
        },
      ],
    });

    const result = await getUser({
      client: mockClient,
      email: "test@test.com",
    });

    expect(mockFetch).toHaveBeenCalledWith(
      "https://embedded-wallet.thirdweb.com/api/2023-11-30/embedded-wallet/user-details?queryBy=email&email=test%40test.com",
    );
    expect(result).toEqual({
      userId: "user1",
      walletAddress: "0x123",
      email: "test@test.com",
      createdAt: "2023-01-01T00:00:00Z",
      profiles: [],
    });
  });

  it("should call the correct URL with phone", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        {
          userId: "user1",
          walletAddress: "0x123",
          phone: "+1234567890",
          createdAt: "2023-01-01T00:00:00Z",
          linkedAccounts: [],
        },
      ],
    });

    const result = await getUser({
      client: mockClient,
      phone: "+1234567890",
    });

    expect(mockFetch).toHaveBeenCalledWith(
      "https://embedded-wallet.thirdweb.com/api/2023-11-30/embedded-wallet/user-details?queryBy=phone&phone=%2B1234567890",
    );
    expect(result).toEqual({
      userId: "user1",
      walletAddress: "0x123",
      phone: "+1234567890",
      createdAt: "2023-01-01T00:00:00Z",
      profiles: [],
    });
  });

  it("should call the correct URL with id", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        {
          userId: "user1",
          walletAddress: "0x123",
          createdAt: "2023-01-01T00:00:00Z",
          linkedAccounts: [
            {
              type: "id",
              details: {
                id: "0x456",
              },
            },
          ],
        },
      ],
    });

    const result = await getUser({
      client: mockClient,
      id: "user1",
    });

    expect(mockFetch).toHaveBeenCalledWith(
      "https://embedded-wallet.thirdweb.com/api/2023-11-30/embedded-wallet/user-details?queryBy=id&id=user1",
    );
    expect(result).toEqual({
      userId: "user1",
      walletAddress: "0x123",
      createdAt: "2023-01-01T00:00:00Z",
      profiles: [
        {
          type: "id",
          details: {
            id: "0x456",
          },
        },
      ],
    });
  });

  it("should call the correct URL with externalWalletAddress", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        {
          userId: "user1",
          walletAddress: "0x123",
          createdAt: "2023-01-01T00:00:00Z",
          linkedAccounts: [
            {
              type: "siwe",
              details: {
                address: "0x456",
              },
            },
          ],
        },
      ],
    });

    const result = await getUser({
      client: mockClient,
      externalWalletAddress: "0x456",
    });

    expect(mockFetch).toHaveBeenCalledWith(
      "https://embedded-wallet.thirdweb.com/api/2023-11-30/embedded-wallet/user-details?queryBy=externalWalletAddress&externalWalletAddress=0x456",
    );
    expect(result).toEqual({
      userId: "user1",
      walletAddress: "0x123",
      createdAt: "2023-01-01T00:00:00Z",
      profiles: [
        {
          type: "wallet",
          details: {
            address: "0x456",
          },
        },
      ],
    });
  });

  it("should handle fetch errors", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
    });

    await expect(
      getUser({
        client: mockClient,
        walletAddress: "0x123",
      }),
    ).rejects.toThrow("Failed to get profiles");
  });

  it("should return null if no user is found", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    const result = await getUser({
      client: mockClient,
      walletAddress: "0x123",
    });

    expect(result).toBeNull();
  });
});
