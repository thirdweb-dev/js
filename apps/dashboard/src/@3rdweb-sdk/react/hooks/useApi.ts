import {
  type Query,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type { Chain } from "@thirdweb-dev/chains";
import { useEffect, useState } from "react";
import invariant from "tiny-invariant";
import { THIRDWEB_API_HOST } from "../../../constants/urls";
import { accountKeys, apiKeys, authorizedWallets } from "../cache-keys";
import { useMutationWithInvalidate } from "./query/useQueryWithNetwork";
import { useLoggedInUser } from "./useLoggedInUser";

// FIXME: We keep repeating types, API server should provide them

export enum AccountStatus {
  NoCustomer = "noCustomer",
  NoPayment = "noPayment",
  PaymentVerification = "paymentVerification",
  ValidPayment = "validPayment",
  InvalidPayment = "invalidPayment",
  InvalidPaymentMethod = "invalidPaymentMethod",
}

export enum AccountPlan {
  Free = "free",
  Growth = "growth",
  Pro = "pro",
  Enterprise = "enterprise",
}

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
  status: AccountStatus;
  plan: AccountPlan;
  name?: string;
  email?: string;
  advancedEnabled: boolean;
  currentBillingPeriodStartsAt: string;
  currentBillingPeriodEndsAt: string;
  emailConfirmedAt?: string;
  unconfirmedEmail?: string;
  trialPeriodEndedAt?: string;
  emailConfirmationWalletAddress?: string;
  stripePaymentActionUrl?: string;
  onboardSkipped?: boolean;
  paymentAttemptCount?: number;
  notificationPreferences?: {
    billing: "email" | "none";
    updates: "email" | "none";
  };
  recurringPaymentFailures: {
    subscriptionId: string;
    subscriptionDescription: string;
    paymentFailureCode: string;
    serviceCutoffDate: string;
  }[];
};

interface UpdateAccountInput {
  name?: string;
  email?: string;
  plan?: AccountPlan;
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

interface CreateKeyInput {
  name?: string;
  domains?: string[];
  bundleIds?: string[];
  walletAddresses?: string[];
  services?: UpdateKeyServiceInput[];
}

interface UpdateKeyInput {
  id: string;
  name: string;
  domains: string[];
  bundleIds: string[];
  walletAddresses?: string[];
  services?: UpdateKeyServiceInput[];
}

interface UsageBundler {
  chainId: number;
  sumTransactionFee: string;
}

interface UsageStorage {
  sumFileSizeBytes: number;
}

interface UsageEmbeddedWallets {
  countWalletAddresses: number;
}

interface UsageCheckout {
  sumTransactionFeeUsd: number;
}

export interface UsageBillableByService {
  usage: {
    bundler: UsageBundler[];
    storage: UsageStorage;
    embeddedWallets: UsageEmbeddedWallets;
    checkout: UsageCheckout;
  };
  billableUsd: {
    bundler: number;
    storage: number;
    embeddedWallets: number;
    checkout: number;
  };
  limits: {
    storage: number;
    embeddedWallets: number;
    checkout: number;
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

interface WalletStats {
  timeSeries: {
    dayTime: string;
    clientId: string;
    walletType: string;
    totalWallets: number;
    uniqueWallets: number;
  }[];
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
    | ((
        data: Account | undefined,
        query: Query<
          Account,
          unknown,
          Account,
          readonly ["account", string, "me"]
        >,
      ) => number | false);
}

export function useAccount({ refetchInterval }: UseAccountInput = {}) {
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
        throw new Error(json.error.message);
      }

      return json.data as Account;
    },
    {
      enabled: !!user?.address && isLoggedIn,
      refetchInterval: refetchInterval ?? false,
    },
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
        throw new Error(json.error.message);
      }

      return json.data as UsageBillableByService;
    },
    { enabled: !!user?.address && isLoggedIn },
  );
}

export function useAccountCredits() {
  const { user, isLoggedIn } = useLoggedInUser();

  return useQuery(
    accountKeys.credits(user?.address as string),
    async () => {
      const res = await fetch(`${THIRDWEB_API_HOST}/v1/account/credits`, {
        method: "GET",
        credentials: "include",
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
          credit.expiresAt > new Date().toISOString() &&
          credit.isActive,
      );

      return credits;
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
        throw new Error(json.error.message);
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
        throw new Error(json.error.message);
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

export function useUpdateAccountPlan(waitForWebhook?: boolean) {
  const { user } = useLoggedInUser();
  const queryClient = useQueryClient();

  return useMutationWithInvalidate(
    async (input: { plan: string; feedback?: string; useTrial?: boolean }) => {
      invariant(user?.address, "walletAddress is required");

      const res = await fetch(`${THIRDWEB_API_HOST}/v1/account/plan`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });

      const json = await res.json();

      if (json.error) {
        throw new Error(json.error.message);
      }

      // Wait for account plan to update via stripe webhook
      // TODO: find a better way to notify the client that the plan has been updated
      if (waitForWebhook) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * 10));
      }

      return json.data;
    },
    {
      onSuccess: () => {
        // invalidate usage data as limits are different
        queryClient.invalidateQueries(accountKeys.me(user?.address as string));

        return queryClient.invalidateQueries(
          accountKeys.usage(user?.address as string),
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
        throw new Error(json.error.message);
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

export function useCreateBillingSession(enabled = false) {
  const { user } = useLoggedInUser();

  return useQuery(
    accountKeys.billingSession(user?.address as string),
    async () => {
      invariant(user?.address, "walletAddress is required");

      const res = await fetch(
        `${THIRDWEB_API_HOST}/v1/account/billingSession`,
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
        throw new Error(json.error.message);
      }

      return json.data;
    },
    { enabled },
  );
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
        throw new Error(json.error.message);
      }

      return json.data;
    },
    {
      onSuccess: () => {
        // invalidate related cache, since could be relinking account
        queryClient.invalidateQueries(apiKeys.keys(user?.address as string));
        queryClient.invalidateQueries(
          accountKeys.usage(user?.address as string),
        );

        return queryClient.invalidateQueries(
          accountKeys.me(user?.address as string),
        );
      },
    },
  );
}

export type CreateTicketInput = {
  markdown: string;
  product: string;
  files?: File[];
} & Record<string, string>;

export function useCreateTicket() {
  const { user } = useLoggedInUser();
  const account = useAccount();
  return useMutationWithInvalidate(async (input: CreateTicketInput) => {
    invariant(user?.address, "walletAddress is required");
    invariant(account?.data, "Account not found");
    const { name, email, plan } = account.data;
    const formData = new FormData();
    const planToCustomerId: Record<string, string> = {
      free: process.env.NEXT_PUBLIC_UNTHREAD_FREE_TIER_ID as string,
      growth: process.env.NEXT_PUBLIC_UNTHREAD_GROWTH_TIER_ID as string,
      pro: process.env.NEXT_PUBLIC_UNTHREAD_PRO_TIER_ID as string,
    };
    const customerId = planToCustomerId[plan] || undefined;
    if (input.files?.length) {
      // biome-ignore lint/complexity/noForEach: FIXME
      input.files.forEach((file) => formData.append("attachments", file));
    }
    const title =
      input.product && input.extraInfo_Problem_Area
        ? `${input.product}: ${input.extraInfo_Problem_Area} (${email})`
        : `New ticket from ${name} (${email})`;

    // Update `markdown` to include the infos from the form
    const extraInfo = Object.keys(input)
      .filter((key) => key.startsWith("extraInfo_"))
      .map((key) => {
        const prettifiedKey = `# ${key.replace("extraInfo_", "").replaceAll("_", " ")}`;
        return `${prettifiedKey}: ${input[key] ?? "N/A"}\n`;
      })
      .join("");
    const markdown = `# Email: ${email}
# Address: ${user.address}
# Product: ${input.product}
${extraInfo}
# Message:
${input.markdown}
`;
    const content = {
      type: "email",
      title,
      markdown,
      status: "open",
      onBehalfOf: {
        email,
        name,
      },
      customerId,
      emailInboxId: process.env.NEXT_PUBLIC_UNTHREAD_EMAIL_INBOX_ID,
      triageChannelId: process.env.NEXT_PUBLIC_UNTHREAD_TRIAGE_CHANNEL_ID,
    };
    formData.append("json", JSON.stringify(content));

    const res = await fetch(
      `${THIRDWEB_API_HOST}/v1/account/create-unthread-ticket`,
      {
        method: "POST",
        credentials: "include",
        body: formData,
      },
    );
    const json = await res.json();
    if (json.error) {
      throw new Error(json.error.message);
    }
    return json.data;
  });
}

export function useConfirmEmbeddedWallet() {
  const { user } = useLoggedInUser();
  const queryClient = useQueryClient();

  return useMutationWithInvalidate(
    async ({ ewsJwt }: { ewsJwt: string }) => {
      invariant(user?.address, "walletAddress is required");

      const res = await fetch(
        `${THIRDWEB_API_HOST}/v1/account/confirmEmbeddedWallet`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ paperJwt: ewsJwt }),
        },
      );
      const json = await res.json();

      if (json.error) {
        throw new Error(json.error.message);
      }

      return json.data;
    },
    {
      onSuccess: () => {
        // invalidate related cache, since could be relinking account
        queryClient.invalidateQueries(apiKeys.keys(user?.address as string));
        queryClient.invalidateQueries(
          accountKeys.usage(user?.address as string),
        );

        return queryClient.invalidateQueries(
          accountKeys.me(user?.address as string),
        );
      },
    },
  );
}

export function useResendEmailConfirmation() {
  const { user } = useLoggedInUser();
  const queryClient = useQueryClient();

  return useMutationWithInvalidate(
    async () => {
      invariant(user?.address, "walletAddress is required");

      const res = await fetch(
        `${THIRDWEB_API_HOST}/v1/account/resendEmailConfirmation`,
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
        throw new Error(json.error.message);
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
        throw new Error(json.error.message);
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
        throw new Error(json.error.message);
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
        throw new Error(json.error.message);
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
        throw new Error(json.error.message);
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
        throw new Error(json.error.message);
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

export const usePolicies = (serviceId?: string) => {
  return useQuery({
    queryKey: ["policies", serviceId],
    queryFn: async () => {
      const res = await fetch(
        `${THIRDWEB_API_HOST}/v1/policies?serviceId=${serviceId}`,
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
        throw new Error(json.error.message);
      }
      return json.data as ApiKeyServicePolicy;
    },
    enabled: !!serviceId,
  });
};

export const useUpdatePolicies = () => {
  const queryClient = useQueryClient();
  return useMutationWithInvalidate(
    async (input: { serviceId: string; data: ApiKeyServicePolicy }) => {
      const res = await fetch(`${THIRDWEB_API_HOST}/v1/policies`, {
        method: "POST",
        credentials: "include",
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
    {
      onSuccess: (_, variables) => {
        return queryClient.invalidateQueries(["policies", variables.serviceId]);
      },
    },
  );
};

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
        throw new Error(json.error.message);
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
        throw new Error(json.error.message);
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
        throw new Error(json.error.message);
      }

      return json.data as AuthorizedWallet[];
    },
    { enabled: !!user?.address && isLoggedIn, cacheTime: 0 },
  );
}

type FetchAuthTokenResponse = {
  jwt: string;
  paymentsSellerId?: string;
};

const TOKEN_PROMISE_MAP = new Map<string, Promise<FetchAuthTokenResponse>>();

async function fetchAuthToken(
  address: string,
  abortController?: AbortController,
): Promise<FetchAuthTokenResponse> {
  if (!address) {
    throw new Error("address is required");
  }
  if (TOKEN_PROMISE_MAP.has(address)) {
    return TOKEN_PROMISE_MAP.get(address) as Promise<FetchAuthTokenResponse>;
  }
  const promise = new Promise<FetchAuthTokenResponse>((resolve, reject) => {
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
          throw new Error(json.error.message);
        }
        return {
          jwt: json.data.jwt as string,
          paymentsSellerId: json.data.paymentsSellerId,
        };
      })
      .then(resolve)
      .catch(reject);
  });
  TOKEN_PROMISE_MAP.set(address, promise);
  return promise;
}

// keep the promise around so we don't fetch it multiple times even if the hook gets called from different places
let inflightPromise: Promise<FetchAuthTokenResponse> | null = null;
export function useApiAuthToken() {
  const { user } = useLoggedInUser();
  const [token, setToken] = useState<string | null>(null);
  const [paymentsSellerId, setPaymentsSellerId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // not using a query because we don't want to store this in any cache
  // eslint-disable-next-line no-restricted-syntax
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

    // eslint-disable-next-line promise/catch-or-return
    inflightPromise
      .then((t) => {
        // eslint-disable-next-line promise/always-return
        if (mounted) {
          setToken(t.jwt);
          if (t.paymentsSellerId) {
            setPaymentsSellerId(t.paymentsSellerId);
          }
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

  return { error, isLoading, token, paymentsSellerId };
}

/**
 *
 */
export async function fetchChainsFromApi() {
  // always fetch from prod for chains for now
  // TODO: re-visit this
  const res = await fetch("https://api.thirdweb.com/v1/chains", {
    method: "GET",
    // do not inclue credentials for chains endpoint
    // credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const json = await res.json();

  if (json.error) {
    throw new Error(json.error.message);
  }

  return json.data as Chain[];
}

export function useApiChains() {
  return useQuery(["all-chains"], async () => {
    return fetchChainsFromApi();
  });
}
