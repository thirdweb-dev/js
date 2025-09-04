import type {
  ListUserWalletsData,
  ListUserWalletsResponses,
} from "@thirdweb-dev/api";
import { configure, listUserWallets } from "@thirdweb-dev/api";
import type { WalletUser } from "thirdweb/wallets";
import { THIRDWEB_API_HOST } from "@/constants/urls";
import type { SearchType } from "./types";

// Configure the API client to use the correct base URL
configure({
  override: {
    baseUrl: THIRDWEB_API_HOST,
  },
});

// Extract types from the generated API
type APIWallet = ListUserWalletsResponses[200]["result"]["wallets"][0];
type APIProfile = APIWallet["profiles"][0];

// Transform API response to match existing WalletUser format
function transformToWalletUser(apiWallet: APIWallet): WalletUser {
  return {
    id: getProfileId(apiWallet.profiles[0]) || "",
    linkedAccounts: apiWallet.profiles.map((profile) => {
      // Create details object based on the profile data
      let details:
        | { email: string; [key: string]: string }
        | { phone: string; [key: string]: string }
        | { address: string; [key: string]: string }
        | { id: string; [key: string]: string };

      const profileId = getProfileId(profile);

      if ("email" in profile && profile.email) {
        details = { email: profile.email, id: profileId };
      } else if ("phone" in profile && profile.phone) {
        details = { phone: profile.phone, id: profileId };
      } else if ("walletAddress" in profile && profile.walletAddress) {
        details = { address: profile.walletAddress, id: profileId };
      } else {
        details = { id: profileId };
      }

      return {
        type: profile.type,
        details,
      };
    }),
    wallets: apiWallet.address
      ? [
          {
            address: apiWallet.address,
            createdAt: apiWallet.createdAt || new Date().toISOString(),
            type: "enclave" as const,
          },
        ]
      : [],
  };
}

// Helper function to safely get ID from any profile type
function getProfileId(profile: APIProfile | undefined): string {
  if (!profile) return "";

  if ("id" in profile) {
    return profile.id;
  } else if ("credentialId" in profile) {
    return profile.credentialId;
  } else if ("identifier" in profile) {
    return profile.identifier;
  }

  return "";
}

export async function searchUsers(
  authToken: string,
  clientId: string | undefined,
  ecosystemSlug: string | undefined,
  teamId: string,
  searchType: SearchType,
  query: string,
): Promise<WalletUser[]> {
  try {
    // Prepare query parameters
    const queryParams: ListUserWalletsData["query"] = {
      limit: 50,
    };

    // Add search parameter based on search type
    switch (searchType) {
      case "email":
        queryParams.email = query;
        break;
      case "phone":
        queryParams.phone = query;
        break;
      case "id":
        queryParams.id = query;
        break;
      case "address":
        queryParams.address = query;
        break;
      case "externalWallet":
        queryParams.externalWalletAddress = query;
        break;
    }

    // Use the generated API function with Bearer authentication
    const response = await listUserWallets({
      query: queryParams,
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
        "x-thirdweb-team-id": teamId,
        ...(clientId && { "x-client-id": clientId }),
        ...(ecosystemSlug && {
          "x-ecosystem-id": `ecosystem.${ecosystemSlug}`,
        }),
      },
    });

    // Handle response
    if (response.error || !response.data) {
      console.error(
        "Error searching users:",
        response.error || "No data returned",
      );
      return [];
    }

    return response.data.result.wallets.map(transformToWalletUser);
  } catch (error) {
    console.error("Error searching users:", error);
    return [];
  }
}
