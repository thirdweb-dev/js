import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  ListUserWalletsData,
  ListUserWalletsResponses,
} from "@thirdweb-dev/api";
import { configure, listUserWallets } from "@thirdweb-dev/api";
import { useActiveAccount } from "thirdweb/react";
import type { WalletUser } from "thirdweb/wallets";
import { THIRDWEB_API_HOST } from "@/constants/urls";
import { embeddedWalletsKeys } from "../query-keys/cache-keys";

// Configure the API client to use the correct base URL
configure({
  override: {
    baseUrl: THIRDWEB_API_HOST,
  },
});

// Extract types from the generated API
type APIWallet = ListUserWalletsResponses[200]["result"]["wallets"][0];
type APIProfile = APIWallet["profiles"][0];

const fetchAccountList = ({
  jwt,
  clientId,
  ecosystemSlug,
  teamId,
  pageNumber,
}: {
  jwt: string;
  clientId?: string;
  ecosystemSlug?: string;
  teamId: string;
  pageNumber: number;
}) => {
  return async () => {
    try {
      // Prepare query parameters for the new API
      const queryParams: ListUserWalletsData["query"] = {
        page: pageNumber,
        limit: 50, // Keep the same page size
      };

      // Use the generated API function with Bearer authentication
      const response = await listUserWallets({
        query: queryParams,
        headers: {
          Authorization: `Bearer ${jwt}`,
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
        const errorMessage =
          typeof response.error === "string"
            ? response.error
            : "No data returned";
        throw new Error(errorMessage);
      }

      // Transform the response to match the expected format
      return {
        users: response.data.result.wallets.map(transformToWalletUser),
        hasMore: response.data.result.pagination.hasMore ?? false,
      };
    } catch (error) {
      console.error("Failed to fetch wallets:", error);
      throw error;
    }
  };
};

// Transform API response to match the wallet user format
function transformToWalletUser(apiWallet: APIWallet): WalletUser {
  return {
    id: apiWallet.userId || getProfileId(apiWallet.profiles[0]) || "",
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

export function useEmbeddedWallets(params: {
  clientId?: string;
  ecosystemSlug?: string;
  teamId: string;
  page: number;
  authToken: string;
}) {
  const { clientId, ecosystemSlug, teamId, page, authToken } = params;
  const address = useActiveAccount()?.address;

  return useQuery({
    enabled: !!address && !!(clientId || ecosystemSlug),
    queryFn: fetchAccountList({
      clientId,
      ecosystemSlug,
      teamId,
      jwt: authToken,
      pageNumber: page,
    }),
    queryKey: embeddedWalletsKeys.embeddedWallets(
      address || "",
      clientId || ecosystemSlug || "",
      page,
    ),
  });
}

// TODO: fetching list of all users needs to be improved
export function useAllEmbeddedWallets(params: { authToken: string }) {
  const { authToken } = params;
  const queryClient = useQueryClient();
  const address = useActiveAccount()?.address;

  return useMutation({
    mutationFn: async ({
      clientId,
      ecosystemSlug,
      teamId,
    }: {
      clientId?: string;
      ecosystemSlug?: string;
      teamId: string;
    }) => {
      const responses: WalletUser[] = [];
      let page = 1;
      let consecutiveFailures = 0;
      const maxConsecutiveFailures = 3;

      while (consecutiveFailures < maxConsecutiveFailures) {
        try {
          const res = await queryClient.fetchQuery<{
            users: WalletUser[];
            hasMore: boolean;
          }>({
            queryFn: fetchAccountList({
              clientId,
              ecosystemSlug,
              teamId,
              jwt: authToken,
              pageNumber: page,
            }),
            queryKey: embeddedWalletsKeys.embeddedWallets(
              address || "",
              clientId || ecosystemSlug || "",
              page,
            ),
            retry: 3,
            retryDelay: (attemptIndex) =>
              Math.min(1000 * 2 ** attemptIndex, 10000),
          });

          responses.push(...res.users);
          consecutiveFailures = 0; // Reset on success

          if (!res.hasMore) {
            break;
          }

          page++;
        } catch (error) {
          consecutiveFailures++;
          console.warn(
            `Failed to fetch page ${page}, attempt ${consecutiveFailures}/${maxConsecutiveFailures}:`,
            error,
          );

          if (consecutiveFailures >= maxConsecutiveFailures) {
            // If we have some data, return it instead of throwing
            if (responses.length > 0) {
              console.warn(
                `Returning partial results (${responses.length} users) after ${maxConsecutiveFailures} consecutive failures`,
              );
              break;
            }
            throw error;
          }

          // Wait before retrying the same page
          await new Promise((resolve) =>
            setTimeout(resolve, 1000 * consecutiveFailures),
          );
        }
      }

      return responses;
    },
  });
}
