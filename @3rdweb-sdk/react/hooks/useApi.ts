import { useEffect, useState } from "react";
import { THIRDWEB_API_HOST } from "../../../constants/urls";
import { apiKeys, accountKeys, authorizedWallets } from "../cache-keys";
import { useMutationWithInvalidate } from "./query/useQueryWithNetwork";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import invariant from "tiny-invariant";
import { useLoggedInUser } from "./useLoggedInUser";

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
  status: string;
  plan: string;
  name?: string;
  email?: string;
  currentBillingPeriodStartsAt: string;
  currentBillingPeriodEndsAt: string;
  onboardedAt?: string;
  emailConfirmedAt?: string;
  unconfirmedEmail?: string;
  onboardSkipped?: boolean;
  notificationPreferences?: {
    billing: "email" | "none";
    updates: "email" | "none";
  };
};

export interface UpdateAccountInput {
  name?: string;
  email?: string;
  subscribeToUpdates?: boolean;
  onboardSkipped?: boolean;
}

export interface UpdateAccountNotificationsInput {
  billing: "email" | "none";
  updates: "email" | "none";
}

export interface ConfirmEmailInput {
  confirmationToken: string;
}

export type ApiKeyService = {
  id: string;
  name: string;
  targetAddresses: string[];
  actions: string[];
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

export interface UpdateKeyServiceInput {
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
}

// FIXME: We keep repeating types, API server should provide them
export interface UsageBundler {
  chainId: number;
  sumTransactionFee: number;
}

export interface UsageStorage {
  sumFileSizeBytes: number;
}

export interface UsageEmbeddedWallets {
  countWalletAddresses: number;
}

export interface UsageBillableByService {
  usage: {
    bundler: UsageBundler[];
    storage: UsageStorage;
    embeddedWallets: UsageEmbeddedWallets;
  };
  billableUsd: {
    bundler: number;
    storage: number;
    embeddedWallets: number;
  };
  limits: {
    storage: number;
    embeddedWallets: number;
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

export interface WalletStats {
  timeSeries: {
    dayTime: string;
    clientId: string;
    walletType: string;
    totalWallets: number;
    uniqueWallets: number;
  }[];
}

export function useAccount() {
  const { user, isLoggedIn } = useLoggedInUser();

  return useQuery(
    accountKeys.me(user?.address as string),
    async () => {
      const res = await fetch(`${THIRDWEB_API_HOST}/v1/account/me`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const json = await res.json();

      if (json.error) {
        throw new Error(json.message);
      }

      return json.data as Account;
    },
    { enabled: !!user?.address && isLoggedIn },
  );
}

export function useAccountUsage() {
  const { user, isLoggedIn } = useLoggedInUser();

  return useQuery(
    accountKeys.usage(user?.address as string),
    async () => {
      const res = await fetch(`${THIRDWEB_API_HOST}/v1/account/usage`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const json = await res.json();

      if (json.error) {
        throw new Error(json.message);
      }

      return json.data as UsageBillableByService;
    },
    { enabled: !!user?.address && isLoggedIn },
  );
}

export function useWalletStats(clientId: string | undefined) {
  const { user, isLoggedIn } = useLoggedInUser();

  return useQuery(
    accountKeys.walletStats(user?.address as string, clientId as string),
    async () => {
      const res = await fetch(
        `${THIRDWEB_API_HOST}/v1/account/wallets?clientId=${clientId}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      const json = await res.json();

      if (json.error) {
        throw new Error(json.message);
      }

      return json.data as WalletStats;
    },
    { enabled: !!clientId && !!user?.address && isLoggedIn },
  );
}

export function useUpdateAccount() {
  const { user } = useLoggedInUser();
  const queryClient = useQueryClient();

  return useMutationWithInvalidate(
    async (input: UpdateAccountInput) => {
      invariant(user?.address, "walletAddress is required");

      const res = await fetch(`${THIRDWEB_API_HOST}/v1/account`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });
      const json = await res.json();

      if (json.error) {
        throw new Error(json.message);
      }

      return json.data;
    },
    {
      onSuccess: () => {
        return queryClient.invalidateQueries(
          accountKeys.me(user?.address as string),
        );
      },
    },
  );
}

export function useUpdateNotifications() {
  const { user } = useLoggedInUser();
  const queryClient = useQueryClient();

  return useMutationWithInvalidate(
    async (input: UpdateAccountNotificationsInput) => {
      invariant(user?.address, "walletAddress is required");

      const res = await fetch(`${THIRDWEB_API_HOST}/v1/account/notifications`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ preferences: input }),
      });
      const json = await res.json();

      if (json.error) {
        throw new Error(json.message);
      }

      return json.data;
    },
    {
      onSuccess: () => {
        return queryClient.invalidateQueries(
          accountKeys.me(user?.address as string),
        );
      },
    },
  );
}

export function useCreateBillingSession() {
  const { user } = useLoggedInUser();

  return useMutationWithInvalidate(async () => {
    invariant(user?.address, "walletAddress is required");

    const res = await fetch(`${THIRDWEB_API_HOST}/v1/account/billingSession`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const json = await res.json();

    if (json.error) {
      throw new Error(json.message);
    }

    return json.data;
  });
}

export function useConfirmEmail() {
  const { user } = useLoggedInUser();
  const queryClient = useQueryClient();

  return useMutationWithInvalidate(
    async (input: ConfirmEmailInput) => {
      invariant(user?.address, "walletAddress is required");

      const res = await fetch(`${THIRDWEB_API_HOST}/v1/account/confirmEmail`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });
      const json = await res.json();

      if (json.error) {
        throw new Error(json.message);
      }

      return json.data;
    },
    {
      onSuccess: () => {
        return queryClient.invalidateQueries(
          accountKeys.me(user?.address as string),
        );
      },
    },
  );
}

export function useCreatePaymentMethod() {
  const { user } = useLoggedInUser();
  const queryClient = useQueryClient();

  return useMutationWithInvalidate(
    async (paymentMethodId: string) => {
      invariant(user?.address, "walletAddress is required");

      const res = await fetch(`${THIRDWEB_API_HOST}/v1/account/paymentMethod`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentMethodId,
        }),
      });
      const json = await res.json();

      if (json.error) {
        throw new Error(json.message);
      }

      return json.data;
    },
    {
      onSuccess: () => {
        return queryClient.invalidateQueries(
          accountKeys.me(user?.address as string),
        );
      },
    },
  );
}

export function useApiKeys() {
  const { user, isLoggedIn } = useLoggedInUser();

  return useQuery(
    apiKeys.keys(user?.address as string),
    async () => {
      const res = await fetch(`${THIRDWEB_API_HOST}/v1/keys`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const json = await res.json();

      if (json.error) {
        throw new Error(json.message);
      }

      return json.data as ApiKey[];
    },
    { enabled: !!user?.address && isLoggedIn },
  );
}

export function useCreateApiKey() {
  const { user } = useLoggedInUser();
  const queryClient = useQueryClient();

  return useMutation(
    async (input: CreateKeyInput) => {
      invariant(user?.address, "walletAddress is required");

      const res = await fetch(`${THIRDWEB_API_HOST}/v1/keys`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });
      const json = await res.json();

      if (json.error) {
        throw new Error(json.message);
      }

      return json.data as ApiKey;
    },
    {
      onSuccess: () => {
        return queryClient.invalidateQueries(
          apiKeys.keys(user?.address as string),
        );
      },
    },
  );
}

export function useUpdateApiKey() {
  const { user } = useLoggedInUser();
  const queryClient = useQueryClient();

  return useMutationWithInvalidate(
    async (input: UpdateKeyInput) => {
      invariant(user?.address, "walletAddress is required");

      const res = await fetch(`${THIRDWEB_API_HOST}/v1/keys/${input.id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });
      const json = await res.json();

      if (json.error) {
        throw new Error(json.message);
      }

      return json.data;
    },
    {
      onSuccess: () => {
        return queryClient.invalidateQueries(
          apiKeys.keys(user?.address as string),
        );
      },
    },
  );
}

export function useRevokeApiKey() {
  const { user } = useLoggedInUser();
  const queryClient = useQueryClient();

  return useMutationWithInvalidate(
    async (id: string) => {
      invariant(user?.address, "walletAddress is required");

      const res = await fetch(`${THIRDWEB_API_HOST}/v1/keys/${id}/revoke`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });
      const json = await res.json();

      if (json.error) {
        throw new Error(json.message);
      }

      return json.data;
    },
    {
      onSuccess: () => {
        return queryClient.invalidateQueries(
          apiKeys.keys(user?.address as string),
        );
      },
    },
  );
}

export function useGenerateApiKey() {
  const { user } = useLoggedInUser();
  const queryClient = useQueryClient();

  return useMutationWithInvalidate(
    async (id: string) => {
      invariant(user?.address, "walletAddress is required");

      const res = await fetch(`${THIRDWEB_API_HOST}/v1/keys/${id}/generate`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });
      const json = await res.json();

      if (json.error) {
        throw new Error(json.message);
      }

      return json.data;
    },
    {
      onSuccess: () => {
        return queryClient.invalidateQueries(
          apiKeys.keys(user?.address as string),
        );
      },
    },
  );
}

export function useAuthorizeWalletWithAccount() {
  const { user } = useLoggedInUser();

  return useMutationWithInvalidate(
    async (variables: { token: string; deviceName?: string }) => {
      invariant(user?.address, "walletAddress is required");

      const res = await fetch(`${THIRDWEB_API_HOST}/v1/jwt/authorize-wallet`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${variables.token}`,
        },
        body: JSON.stringify({
          deviceName: variables.deviceName,
        }),
      });
      const json = await res.json();

      if (json.error) {
        throw new Error(json.message);
      }

      return json.data;
    },
  );
}

export function useRevokeAuthorizedWallet() {
  const { user } = useLoggedInUser();
  const queryClient = useQueryClient();

  return useMutationWithInvalidate(
    async (variables: { authorizedWalletId: string }) => {
      invariant(user?.address, "walletAddress is required");

      const { authorizedWalletId } = variables;

      const res = await fetch(
        `${THIRDWEB_API_HOST}/v1/authorized-wallets/${authorizedWalletId}/revoke`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        },
      );
      const json = await res.json();

      if (json.error) {
        throw new Error(json.message);
      }

      return json.data;
    },
    {
      onSuccess: () => {
        return queryClient.invalidateQueries(
          authorizedWallets.authorizedWallets(user?.address as string),
        );
      },
    },
  );
}

export function useAuthorizedWallets() {
  const { user, isLoggedIn } = useLoggedInUser();

  return useQuery(
    authorizedWallets.authorizedWallets(user?.address as string),
    async () => {
      const res = await fetch(`${THIRDWEB_API_HOST}/v1/authorized-wallets`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const json = await res.json();

      if (json.error) {
        throw new Error(json.message);
      }

      return json.data as AuthorizedWallet[];
    },
    { enabled: !!user?.address && isLoggedIn, cacheTime: 0 },
  );
}

const TOKEN_PROMISE_MAP = new Map<string, Promise<string>>();

async function fetchAuthToken(
  address: string,
  abortController?: AbortController,
): Promise<string> {
  if (!address) {
    throw new Error("address is required");
  }
  if (TOKEN_PROMISE_MAP.has(address)) {
    return TOKEN_PROMISE_MAP.get(address) as Promise<string>;
  }
  const promise = new Promise<string>((resolve, reject) => {
    return fetch(`${THIRDWEB_API_HOST}/v1/auth/token`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      signal: abortController?.signal,
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.error) {
          throw new Error(json.message);
        }
        return json.data.jwt as string;
      })
      .then(resolve)
      .catch(reject);
  });
  TOKEN_PROMISE_MAP.set(address, promise);
  return promise;
}

// keep the promise around so we don't fetch it multiple times even if the hook gets called from different places
let inflightPromise: Promise<string> | null = null;
export function useApiAuthToken() {
  const { user } = useLoggedInUser();
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  // not using a query because we don't want to store this in any cache

  useEffect(() => {
    let mounted = true;
    setError(null);
    setIsLoading(false);
    if (!user?.address) {
      return;
    }
    setIsLoading(true);

    const abortController = new AbortController();

    if (!inflightPromise) {
      inflightPromise = fetchAuthToken(user.address, abortController);
    }

    inflightPromise
      .then((t) => {
        if (mounted) {
          setToken(t);
        }
      })
      .catch((err) => {
        if (mounted) {
          setError(err);
        }
      })
      .finally(() => {
        if (mounted) {
          inflightPromise = null;
          setIsLoading(false);
        }
      });

    return () => {
      mounted = false;
      // cancel the fetch if it's still in flight
      abortController.abort();
      inflightPromise = null;
      setToken(null);
    };
  }, [user?.address]);

  return { error, isLoading, token };
}

/**
 * @deprecated
 */
export async function fetchApiKeyAvailability(name: string) {
  const res = await fetch(
    `${THIRDWEB_API_HOST}/v1/keys/availability?name=${name}`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  const json = await res.json();

  if (json.error) {
    throw new Error(json.message);
  }

  return !!json.data.available;
}
