import type { Team } from "@/api/team";
import {
  type Query,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { THIRDWEB_ANALYTICS_API_HOST, THIRDWEB_API_HOST } from "constants/urls";
import { useAllChainsData } from "hooks/chains/allChains";
import invariant from "tiny-invariant";
import type { UserOpStats } from "types/analytics";
import { accountKeys, apiKeys, authorizedWallets } from "../cache-keys";
import { useLoggedInUser } from "./useLoggedInUser";

// FIXME: We keep repeating types, API server should provide them

export const accountStatus = {
  noCustomer: "noCustomer",
  noPayment: "noPayment",
  paymentVerification: "paymentVerification",
  validPayment: "validPayment",
  invalidPayment: "invalidPayment",
  invalidPaymentMethod: "invalidPaymentMethod",
} as const;

export const accountPlan = {
  free: "free",
  growth: "growth",
  pro: "pro",
  enterprise: "enterprise",
} as const;

export type AuthorizedWallet = {
  id: string;
  accountId: string;
  walletAddress: string;
  revoked: boolean;
  createdAt: string;
  updatedAt: string;
  deviceName: string;
};

// Account
export type Account = {
  id: string;
  isStaff: boolean;
  creatorWalletAddress: string;
  name?: string;
  email?: string;
  advancedEnabled: boolean;
  emailConfirmedAt?: string;
  unconfirmedEmail?: string;
  emailConfirmationWalletAddress?: string;
  onboardSkipped?: boolean;
  notificationPreferences?: {
    billing: "email" | "none";
    updates: "email" | "none";
  };
  // TODO - add image URL
};

interface UpdateAccountInput {
  name?: string;
  email?: string;
  linkWallet?: boolean;
  subscribeToUpdates?: boolean;
  onboardSkipped?: boolean;
}

interface UpdateAccountNotificationsInput {
  billing: "email" | "none";
  updates: "email" | "none";
}

interface ConfirmEmailInput {
  confirmationToken: string;
}

type ApiKeyRecoverShareManagement = "AWS_MANAGED" | "USER_MANAGED";
type ApiKeyCustomAuthentication = {
  jwksUri: string;
  aud: string;
};
type ApiKeyCustomAuthEndpoint = {
  authEndpoint: string;
  customHeaders: { key: string; value: string }[];
};

// MAP to api-server types in PolicyService.ts
export type ApiKeyServicePolicy = {
  allowedChainIds?: number[] | null;
  allowedContractAddresses?: string[] | null;
  allowedWallets?: string[] | null;
  blockedWallets?: string[] | null;
  bypassWallets?: string[] | null;
  serverVerifier?: {
    url: string;
    headers: { key: string; value: string }[] | null;
  } | null;
  limits?: ApiKeyServicePolicyLimits | null;
};

export type ApiKeyServicePolicyLimits = {
  global?: {
    // in dollars or ETH
    maxSpend: string;
    maxSpendUnit: "usd" | "native";
  } | null;
  // ----------------------
  // TODO implement perUser limits
  perUserSpend?: {
    // in dollars or ETH
    maxSpend: string | null;
    maxSpendUnit: "usd" | "native";
    maxSpendPeriod: "day" | "week" | "month";
  } | null;
  perUserTransactions?: {
    maxTransactions: number;
    maxTransactionsPeriod: "day" | "week" | "month";
  } | null;
};

export type ApiKeyService = {
  id: string;
  name: string;
  targetAddresses: string[];
  actions: string[];
  // If updating here, need to update validation logic in `validation.ts` as well for recoveryShareManagement
  // EMBEDDED WALLET
  recoveryShareManagement?: ApiKeyRecoverShareManagement;
  customAuthentication?: ApiKeyCustomAuthentication;
  customAuthEndpoint?: ApiKeyCustomAuthEndpoint;
  applicationName?: string;
  applicationImageUrl?: string;
  // PAY
  payoutAddress?: string;
};

export type ApiKey = {
  id: string;
  name: string;
  key: string;
  secret?: string;
  secretMasked: string;
  accountId: string;
  creatorWalletAddress: string;
  walletAddresses: string[];
  domains: string[];
  bundleIds: string[];
  redirectUrls: string[];
  revokedAt: string;
  lastAccessedAt: string;
  createdAt: string;
  updatedAt: string;
  services?: ApiKeyService[];
};

interface UpdateKeyServiceInput {
  name: string;
  targetAddresses: string[];
  actions?: string[];
}

export interface CreateKeyInput {
  name?: string;
  domains?: string[];
  bundleIds?: string[];
  walletAddresses?: string[];
  services?: UpdateKeyServiceInput[];
}

export interface UpdateKeyInput {
  id: string;
  name: string;
  domains: string[];
  bundleIds: string[];
  walletAddresses?: string[];
  services?: UpdateKeyServiceInput[];
  redirectUrls: string[];
}

interface UsageStorage {
  sumFileSizeBytes: number;
}

export interface UsageBillableByService {
  usage: {
    storage: UsageStorage;
  };
  limits: {
    storage: number;
  };
  rateLimits: {
    storage: number;
    rpc: number;
  };
  rateLimitedAt: {
    storage?: string;
    rpc?: string;
  };
}

interface BillingProduct {
  name: string;
  id: string;
}

export interface BillingCredit {
  originalGrantUsdCents: number;
  remainingValueUsdCents: number;
  name: string;
  couponId: string;
  products: BillingProduct[];
  expiresAt: string;
  redeemedAt: string;
  isActive: boolean;
}

interface UseAccountInput {
  refetchInterval?:
    | number
    | false
    | ((
        query: Query<
          Account,
          Error,
          Account,
          readonly ["account", string, "me"]
        >,
      ) => number | false | undefined)
    | undefined;
}

export function useAccount({ refetchInterval }: UseAccountInput = {}) {
  const { user, isLoggedIn } = useLoggedInUser();

  return useQuery({
    queryKey: accountKeys.me(user?.address as string),
    queryFn: async () => {
      const res = await fetch(`${THIRDWEB_API_HOST}/v1/account/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const json = await res.json();

      if (json.error) {
        throw new Error(json.error.message);
      }

      return json.data as Account;
    },
    enabled: !!user?.address && isLoggedIn,
    refetchInterval,
  });
}

export function useAccountCredits() {
  const { user, isLoggedIn } = useLoggedInUser();

  return useQuery({
    queryKey: accountKeys.credits(user?.address as string),
    queryFn: async () => {
      const res = await fetch(`${THIRDWEB_API_HOST}/v1/account/credits`, {
        method: "GET",

        headers: {
          "Content-Type": "application/json",
        },
      });
      const json = await res.json();

      if (json.error) {
        throw new Error(json.error.message);
      }

      const credits = (json.data as BillingCredit[]).filter(
        (credit) =>
          credit.remainingValueUsdCents > 0 &&
          (!credit.expiresAt || credit.expiresAt > new Date().toISOString()) &&
          credit.isActive,
      );

      return credits;
    },
    enabled: !!user?.address && isLoggedIn,
  });
}

async function getUserOpUsage(args: {
  clientId: string;
  from?: Date;
  to?: Date;
  period?: "day" | "week" | "month" | "year" | "all";
}) {
  const { clientId, from, to, period } = args;

  const searchParams = new URLSearchParams();
  searchParams.append("clientId", clientId);
  if (from) {
    searchParams.append("from", from.toISOString());
  }
  if (to) {
    searchParams.append("to", to.toISOString());
  }
  if (period) {
    searchParams.append("period", period);
  }
  const res = await fetch(
    `${THIRDWEB_ANALYTICS_API_HOST}/v1/user-ops?${searchParams.toString()}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  const json = await res.json();

  if (res.status !== 200) {
    throw new Error(json.message);
  }

  return json.data;
}

export function useUserOpUsageAggregate(args: {
  clientId: string;
  from?: Date;
  to?: Date;
}) {
  const { clientId, from, to } = args;
  const { user, isLoggedIn } = useLoggedInUser();
  const chainStore = useAllChainsData();

  return useQuery<UserOpStats>({
    queryKey: accountKeys.userOpStats(
      user?.address as string,
      clientId as string,
      from?.toISOString() || "",
      to?.toISOString() || "",
      "all",
    ),
    queryFn: async () => {
      const userOpStats: (UserOpStats & { chainId?: string })[] =
        await getUserOpUsage({
          clientId,
          from,
          to,
          period: "all",
        });

      // Aggregate stats across wallet types
      return userOpStats.reduce(
        (acc, curr) => {
          // Skip testnets from the aggregated stats
          if (curr.chainId) {
            const chain = chainStore.idToChain.get(Number(curr.chainId));
            if (chain?.testnet) {
              return acc;
            }
          }

          acc.successful += curr.successful;
          acc.failed += curr.failed;
          acc.sponsoredUsd += curr.sponsoredUsd;
          return acc;
        },
        {
          date: (from || new Date()).toISOString(),
          successful: 0,
          failed: 0,
          sponsoredUsd: 0,
        },
      );
    },
    enabled: !!clientId && !!user?.address && isLoggedIn,
  });
}

export function useUserOpUsagePeriod(args: {
  clientId: string;
  from?: Date;
  to?: Date;
  period: "day" | "week" | "month" | "year";
}) {
  const { clientId, from, to, period } = args;
  const { user, isLoggedIn } = useLoggedInUser();

  return useQuery({
    queryKey: accountKeys.userOpStats(
      user?.address as string,
      clientId as string,
      from?.toISOString() || "",
      to?.toISOString() || "",
      period,
    ),
    queryFn: async () => {
      return getUserOpUsage({
        clientId,
        from,
        to,
        period,
      });
    },
    enabled: !!clientId && !!user?.address && isLoggedIn,
  });
}

export function useUpdateAccount() {
  const { user } = useLoggedInUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateAccountInput) => {
      invariant(user?.address, "walletAddress is required");

      const res = await fetch(`${THIRDWEB_API_HOST}/v1/account`, {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });

      const json = await res.json();

      if (json.error) {
        throw new Error(json.error.message);
      }

      return json.data;
    },

    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: accountKeys.me(user?.address as string),
      });
    },
  });
}

export function useUpdateNotifications() {
  const { user } = useLoggedInUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateAccountNotificationsInput) => {
      invariant(user?.address, "walletAddress is required");

      const res = await fetch(`${THIRDWEB_API_HOST}/v1/account/notifications`, {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ preferences: input }),
      });
      const json = await res.json();

      if (json.error) {
        throw new Error(json.error.message);
      }

      return json.data;
    },
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: accountKeys.me(user?.address as string),
      });
    },
  });
}

export function useConfirmEmail() {
  const { user } = useLoggedInUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: ConfirmEmailInput) => {
      invariant(user?.address, "walletAddress is required");

      const res = await fetch(`${THIRDWEB_API_HOST}/v1/account/confirmEmail`, {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });
      const json = await res.json();

      if (json.error) {
        throw new Error(json.error.message);
      }

      return json.data as { team: Team; account: Account };
    },
    onSuccess: async () => {
      // invalidate related cache, since could be relinking account
      return Promise.all([
        queryClient.invalidateQueries({
          queryKey: apiKeys.keys(user?.address as string),
        }),
        queryClient.invalidateQueries({
          queryKey: accountKeys.usage(user?.address as string),
        }),
        queryClient.invalidateQueries({
          queryKey: accountKeys.me(user?.address as string),
        }),
      ]);
    },
  });
}

export function useResendEmailConfirmation() {
  const { user } = useLoggedInUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      invariant(user?.address, "walletAddress is required");

      const res = await fetch(
        `${THIRDWEB_API_HOST}/v1/account/resendEmailConfirmation`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        },
      );
      const json = await res.json();

      if (json.error) {
        throw new Error(json.error.message);
      }

      return json.data;
    },
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: accountKeys.me(user?.address as string),
      });
    },
  });
}

export function useApiKeys() {
  const { user, isLoggedIn } = useLoggedInUser();
  return useQuery({
    queryKey: apiKeys.keys(user?.address as string),
    queryFn: async () => {
      const res = await fetch(`${THIRDWEB_API_HOST}/v1/keys`, {
        method: "GET",

        headers: {
          "Content-Type": "application/json",
        },
      });
      const json = await res.json();

      if (json.error) {
        throw new Error(json.error.message);
      }
      return json.data as ApiKey[];
    },
    enabled: !!user?.address && isLoggedIn,
  });
}

export function useCreateApiKey() {
  const { user } = useLoggedInUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateKeyInput) => {
      invariant(user?.address, "walletAddress is required");

      const res = await fetch(`${THIRDWEB_API_HOST}/v1/keys`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });
      const json = await res.json();

      if (json.error) {
        throw new Error(json.error.message);
      }

      return json.data as ApiKey;
    },

    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: apiKeys.keys(user?.address as string),
      });
    },
  });
}

export function useUpdateApiKey() {
  const { user } = useLoggedInUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateKeyInput) => {
      invariant(user?.address, "walletAddress is required");

      const res = await fetch(`${THIRDWEB_API_HOST}/v1/keys/${input.id}`, {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });

      const json = await res.json();

      if (json.error) {
        throw new Error(json.error.message);
      }

      return json.data;
    },
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: apiKeys.keys(user?.address as string),
      });
    },
  });
}

export function useRevokeApiKey() {
  const { user } = useLoggedInUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      invariant(user?.address, "walletAddress is required");

      const res = await fetch(`${THIRDWEB_API_HOST}/v1/keys/${id}/revoke`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });
      const json = await res.json();

      if (json.error) {
        throw new Error(json.error.message);
      }

      return json.data;
    },
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: apiKeys.keys(user?.address as string),
      });
    },
  });
}

export const usePolicies = (serviceId?: string) => {
  return useQuery({
    queryKey: ["policies", serviceId],
    queryFn: async () => {
      const res = await fetch(
        `${THIRDWEB_API_HOST}/v1/policies?serviceId=${serviceId}`,
        {
          method: "GET",

          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      const json = await res.json();
      if (json.error) {
        throw new Error(json.error.message);
      }
      return json.data as ApiKeyServicePolicy;
    },
    enabled: !!serviceId,
  });
};

export const useUpdatePolicies = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      serviceId: string;
      data: ApiKeyServicePolicy;
    }) => {
      const res = await fetch(`${THIRDWEB_API_HOST}/v1/policies`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          serviceId: input.serviceId,
          data: input.data,
        }),
      });
      const json = await res.json();
      if (json.error) {
        throw new Error(json.error.message);
      }
      return json.data as ApiKeyServicePolicy;
    },
    onSuccess: (_, variables) => {
      return queryClient.invalidateQueries({
        queryKey: ["policies", variables.serviceId],
      });
    },
  });
};

export function useRevokeAuthorizedWallet() {
  const { user } = useLoggedInUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables: { authorizedWalletId: string }) => {
      invariant(user?.address, "walletAddress is required");

      const { authorizedWalletId } = variables;

      const res = await fetch(
        `${THIRDWEB_API_HOST}/v1/authorized-wallets/${authorizedWalletId}/revoke`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        },
      );
      const json = await res.json();

      if (json.error) {
        throw new Error(json.error.message);
      }

      return json.data;
    },
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: authorizedWallets.authorizedWallets(user?.address as string),
      });
    },
  });
}

export function useAuthorizedWallets() {
  const { user, isLoggedIn } = useLoggedInUser();

  return useQuery({
    queryKey: authorizedWallets.authorizedWallets(user?.address as string),
    queryFn: async () => {
      const res = await fetch(`${THIRDWEB_API_HOST}/v1/authorized-wallets`, {
        method: "GET",

        headers: {
          "Content-Type": "application/json",
        },
      });
      const json = await res.json();

      if (json.error) {
        throw new Error(json.error.message);
      }

      return json.data as AuthorizedWallet[];
    },
    enabled: !!user?.address && isLoggedIn,
    gcTime: 0,
  });
}
