import { analyticsServerProxy, apiServerProxy } from "@/actions/proxies";
import type { Project } from "@/api/projects";
import type { Team } from "@/api/team";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAllChainsData } from "hooks/chains/allChains";
import { useActiveAccount } from "thirdweb/react";
import type { UserOpStats } from "types/analytics";
import { accountKeys, authorizedWallets } from "../cache-keys";

// FIXME: We keep repeating types, API server should provide them

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
  image?: string | null;
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

export async function createProjectClient(
  teamId: string,
  body: Partial<Project>,
) {
  type Response = {
    result: {
      project: Project;
      secret: string;
    };
  };

  const res = await apiServerProxy<Response>({
    pathname: `/v1/teams/${teamId}/projects`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(res.error);
  }

  return res.data.result;
}

export async function updateProjectClient(
  params: {
    projectId: string;
    teamId: string;
  },
  body: Partial<Project>,
) {
  type Response = {
    result: Project;
  };

  const res = await apiServerProxy<Response>({
    pathname: `/v1/teams/${params.teamId}/projects/${params.projectId}`,
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(res.error);
  }

  return res.data.result;
}

export async function deleteProjectClient(params: {
  projectId: string;
  teamId: string;
}) {
  type Response = {
    result: true;
  };

  const res = await apiServerProxy<Response>({
    pathname: `/v1/teams/${params.teamId}/projects/${params.projectId}`,
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error(res.error);
  }

  return res.data.result;
}

export type RotateSecretKeyAPIReturnType = {
  data: {
    secret: string;
    secretMasked: string;
    secretHash: string;
  };
};

export async function rotateSecretKeyClient(projectId: string) {
  const res = await apiServerProxy<RotateSecretKeyAPIReturnType>({
    pathname: "/v2/keys/rotate-secret-key",
    method: "POST",
    body: JSON.stringify({
      projectId,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(res.error);
  }

  return res.data;
}

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
