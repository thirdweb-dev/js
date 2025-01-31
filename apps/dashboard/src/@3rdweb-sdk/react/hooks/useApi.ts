import { analyticsServerProxy, apiServerProxy } from "@/actions/proxies";
import type { Team } from "@/api/team";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAllChainsData } from "hooks/chains/allChains";
import { useActiveAccount } from "thirdweb/react";
import type { UserOpStats } from "types/analytics";
import { accountKeys, apiKeys, authorizedWallets } from "../cache-keys";

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

// TODO - remove this hook, fetch on server
export function useAccountCredits() {
  const address = useActiveAccount()?.address;
  return useQuery({
    queryKey: accountKeys.credits(address || ""),
    queryFn: async () => {
      type Result = {
        data: BillingCredit[];
        error?: { message: string };
      };

      const res = await apiServerProxy<Result>({
        pathname: "/v1/account/credits",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error(res.error);
      }

      const json = res.data;

      if (json.error) {
        throw new Error(json.error.message);
      }

      const credits = json.data.filter(
        (credit) =>
          credit.remainingValueUsdCents > 0 &&
          (!credit.expiresAt || credit.expiresAt > new Date().toISOString()) &&
          credit.isActive,
      );

      return credits;
    },
    enabled: !!address,
  });
}

type UserOpUsageQueryResult = (UserOpStats & { chainId?: string })[];

async function getUserOpUsage(args: {
  clientId: string;
  from?: Date;
  to?: Date;
  period?: "day" | "week" | "month" | "year" | "all";
}) {
  const { clientId, from, to, period } = args;

  const searchParams: Record<string, string> = {
    clientId,
  };

  if (from) {
    searchParams.from = from.toISOString();
  }
  if (to) {
    searchParams.to = to.toISOString();
  }
  if (period) {
    searchParams.period = period;
  }

  const res = await analyticsServerProxy<{ data: UserOpUsageQueryResult }>({
    pathname: "/v1/user-ops",
    method: "GET",
    searchParams: searchParams,
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(res.error);
  }

  const json = res.data;

  return json.data;
}

// TODO - remove this hook, fetch this on server
export function useUserOpUsageAggregate(args: {
  clientId: string;
  from?: Date;
  to?: Date;
}) {
  const { clientId, from, to } = args;
  const address = useActiveAccount()?.address;
  const chainStore = useAllChainsData();

  return useQuery<UserOpStats>({
    queryKey: accountKeys.userOpStats(
      address || "",
      clientId,
      from?.toISOString() || "",
      to?.toISOString() || "",
      "all",
    ),
    queryFn: async () => {
      const userOpStats = await getUserOpUsage({
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
    enabled: !!clientId && !!address,
  });
}

// TODO - remove this hook, fetch this on server
export function useUserOpUsagePeriod(args: {
  clientId: string;
  from?: Date;
  to?: Date;
  period: "day" | "week" | "month" | "year";
}) {
  const { clientId, from, to, period } = args;
  const address = useActiveAccount()?.address;

  return useQuery({
    queryKey: accountKeys.userOpStats(
      address || "",
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
    enabled: !!clientId && !!address,
  });
}

export function useUpdateAccount() {
  const queryClient = useQueryClient();
  const address = useActiveAccount()?.address;

  return useMutation({
    mutationFn: async (input: UpdateAccountInput) => {
      type Result = {
        data: object;
        error?: { message: string };
      };

      const res = await apiServerProxy<Result>({
        pathname: "/v1/account",
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });

      if (!res.ok) {
        throw new Error(res.error);
      }

      const json = res.data;

      if (json.error) {
        throw new Error(json.error.message);
      }

      return json.data;
    },

    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: accountKeys.me(address || ""),
      });
    },
  });
}

export function useUpdateNotifications() {
  const address = useActiveAccount()?.address;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateAccountNotificationsInput) => {
      type Result = {
        data: object;
        error?: { message: string };
      };

      const res = await apiServerProxy<Result>({
        pathname: "/v1/account/notifications",
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ preferences: input }),
      });

      if (!res.ok) {
        throw new Error(res.error);
      }

      const json = res.data;

      if (json.error) {
        throw new Error(json.error.message);
      }

      return json.data;
    },
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: accountKeys.me(address || ""),
      });
    },
  });
}

export function useConfirmEmail() {
  const address = useActiveAccount()?.address;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: ConfirmEmailInput) => {
      type Result = {
        error?: { message: string };
        data: { team: Team; account: Account };
      };

      const res = await apiServerProxy<Result>({
        pathname: "/v1/account/confirmEmail",
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });

      if (!res.ok) {
        throw new Error(res.error);
      }

      const json = res.data;

      if (json.error) {
        throw new Error(json.error.message);
      }

      return json.data;
    },
    onSuccess: async () => {
      // invalidate related cache, since could be relinking account
      return Promise.all([
        queryClient.invalidateQueries({
          queryKey: apiKeys.keys(address || ""),
        }),
        queryClient.invalidateQueries({
          queryKey: accountKeys.usage(address || ""),
        }),
        queryClient.invalidateQueries({
          queryKey: accountKeys.me(address || ""),
        }),
      ]);
    },
  });
}

export function useResendEmailConfirmation() {
  const address = useActiveAccount()?.address;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      type Result = {
        error?: { message: string };
        data: object;
      };

      const res = await apiServerProxy<Result>({
        pathname: "/v1/account/resendEmailConfirmation",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      if (!res.ok) {
        throw new Error(res.error);
      }

      const json = res.data;

      if (json.error) {
        throw new Error(json.error.message);
      }

      return json.data;
    },
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: accountKeys.me(address || ""),
      });
    },
  });
}

export function useCreateApiKey() {
  const address = useActiveAccount()?.address;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateKeyInput) => {
      type Result = {
        data: ApiKey;
        error?: { message: string };
      };

      const res = await apiServerProxy<Result>({
        pathname: "/v1/keys",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });

      if (!res.ok) {
        throw new Error(res.error);
      }

      const json = res.data;

      if (json.error) {
        throw new Error(json.error.message);
      }

      return json.data;
    },
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: apiKeys.keys(address || ""),
      });
    },
  });
}

export function useUpdateApiKey() {
  const address = useActiveAccount()?.address;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateKeyInput) => {
      type Result = {
        data: ApiKey;
        error?: { message: string };
      };

      const res = await apiServerProxy<Result>({
        pathname: `/v1/keys/${input.id}`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });

      if (!res.ok) {
        throw new Error(res.error);
      }

      const json = res.data;

      if (json.error) {
        throw new Error(json.error.message);
      }

      return json.data;
    },
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: apiKeys.keys(address || ""),
      });
    },
  });
}

export function useRevokeApiKey() {
  const address = useActiveAccount()?.address;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      type Result = {
        data: ApiKey;
        error?: { message: string };
      };

      const res = await apiServerProxy<Result>({
        pathname: `/v1/keys/${id}/revoke`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      if (!res.ok) {
        throw new Error(res.error);
      }

      const json = res.data;

      if (json.error) {
        throw new Error(json.error.message);
      }

      return json.data;
    },
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: apiKeys.keys(address || ""),
      });
    },
  });
}

export const usePolicies = (serviceId?: string) => {
  return useQuery({
    queryKey: ["policies", serviceId],
    queryFn: async () => {
      if (!serviceId) {
        throw new Error();
      }

      type Result = {
        data: ApiKeyServicePolicy;
        error?: { message: string };
      };

      const res = await apiServerProxy<Result>({
        pathname: "/v1/policies",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        searchParams: {
          serviceId,
        },
      });

      if (!res.ok) {
        throw new Error(res.error);
      }

      const json = res.data;
      if (json.error) {
        throw new Error(json.error.message);
      }
      return json.data;
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
      type Result = {
        data: ApiKeyServicePolicy;
        error?: { message: string };
      };

      const res = await apiServerProxy<Result>({
        pathname: "/v1/policies",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          serviceId: input.serviceId,
          data: input.data,
        }),
      });

      if (!res.ok) {
        throw new Error(res.error);
      }

      const json = res.data;
      if (json.error) {
        throw new Error(json.error.message);
      }
      return json.data;
    },
    onSuccess: (_, variables) => {
      return queryClient.invalidateQueries({
        queryKey: ["policies", variables.serviceId],
      });
    },
  });
};

export function useRevokeAuthorizedWallet() {
  const address = useActiveAccount()?.address;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables: { authorizedWalletId: string }) => {
      const { authorizedWalletId } = variables;
      type Result = {
        data: object;
        error?: { message: string };
      };

      const res = await apiServerProxy<Result>({
        pathname: `/v1/authorized-wallets/${authorizedWalletId}/revoke`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      if (!res.ok) {
        throw new Error(res.error);
      }

      const json = res.data;

      if (json.error) {
        throw new Error(json.error.message);
      }

      return json.data;
    },
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: authorizedWallets.authorizedWallets(address || ""),
      });
    },
  });
}

export function useAuthorizedWallets() {
  const address = useActiveAccount()?.address;
  return useQuery({
    queryKey: authorizedWallets.authorizedWallets(address || ""),
    queryFn: async () => {
      type Result = {
        data: AuthorizedWallet[];
        error?: { message: string };
      };

      const res = await apiServerProxy<Result>({
        pathname: "/v1/authorized-wallets",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error(res.error);
      }

      const json = res.data;

      if (json.error) {
        throw new Error(json.error.message);
      }

      return json.data;
    },
    enabled: !!address,
    gcTime: 0,
  });
}
