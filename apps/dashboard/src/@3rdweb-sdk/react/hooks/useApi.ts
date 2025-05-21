import { apiServerProxy } from "@/actions/proxies";
import type { Project } from "@/api/projects";
import type { Team } from "@/api/team";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useActiveAccount } from "thirdweb/react";
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
  emailConfirmedAt?: string;
  unconfirmedEmail?: string;
  emailConfirmationWalletAddress?: string;
  onboardSkipped?: boolean;
  notificationPreferences?: {
    billing: "email" | "none";
    updates: "email" | "none";
  };
};

interface UpdateAccountNotificationsInput {
  billing: "email" | "none";
  updates: "email" | "none";
}

interface ConfirmEmailInput {
  confirmationToken: string;
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

type UpdateAccountParams = {
  name?: string;
  email?: string;
  linkWallet?: boolean;
  subscribeToUpdates?: boolean;
  onboardSkipped?: boolean;
};

export async function updateAccountClient(input: UpdateAccountParams) {
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

export const verifyEmailClient = async (input: ConfirmEmailInput) => {
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
};

export const resendEmailClient = async () => {
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
};

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
