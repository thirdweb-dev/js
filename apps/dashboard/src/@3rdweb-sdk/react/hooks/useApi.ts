import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useActiveAccount } from "thirdweb/react";
import { apiServerProxy } from "@/actions/proxies";
import type { Project } from "@/api/projects";
import { accountKeys, authorizedWallets } from "../cache-keys";

// FIXME: We keep repeating types, API server should provide them

export const accountPlan = {
  enterprise: "enterprise",
  free: "free",
  growth: "growth",
  pro: "pro",
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
    enabled: !!address,
    queryFn: async () => {
      type Result = {
        data: BillingCredit[];
        error?: { message: string };
      };

      const res = await apiServerProxy<Result>({
        headers: {
          "Content-Type": "application/json",
        },
        method: "GET",
        pathname: "/v1/account/credits",
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
    queryKey: accountKeys.credits(address || ""),
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
    body: JSON.stringify(input),
    headers: {
      "Content-Type": "application/json",
    },
    method: "PUT",
    pathname: "/v1/account",
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
        body: JSON.stringify({ preferences: input }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "PUT",
        pathname: "/v1/account/notifications",
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
    data: { account: Account };
  };

  const res = await apiServerProxy<Result>({
    body: JSON.stringify(input),
    headers: {
      "Content-Type": "application/json",
    },
    method: "PUT",
    pathname: "/v1/account/confirmEmail",
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
    body: JSON.stringify({}),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    pathname: "/v1/account/resendEmailConfirmation",
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
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    pathname: `/v1/teams/${teamId}/projects`,
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
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
    method: "PUT",
    pathname: `/v1/teams/${params.teamId}/projects/${params.projectId}`,
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
    method: "DELETE",
    pathname: `/v1/teams/${params.teamId}/projects/${params.projectId}`,
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

export async function rotateSecretKeyClient(params: {
  teamId: string;
  projectId: string;
}) {
  const res = await apiServerProxy<RotateSecretKeyAPIReturnType>({
    body: JSON.stringify({}),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    pathname: `/v1/teams/${params.teamId}/projects/${params.projectId}/rotate-secret-key`,
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
        body: JSON.stringify({}),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        pathname: `/v1/authorized-wallets/${authorizedWalletId}/revoke`,
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
    enabled: !!address,
    gcTime: 0,
    queryFn: async () => {
      type Result = {
        data: AuthorizedWallet[];
        error?: { message: string };
      };

      const res = await apiServerProxy<Result>({
        headers: {
          "Content-Type": "application/json",
        },
        method: "GET",
        pathname: "/v1/authorized-wallets",
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
    queryKey: authorizedWallets.authorizedWallets(address || ""),
  });
}
