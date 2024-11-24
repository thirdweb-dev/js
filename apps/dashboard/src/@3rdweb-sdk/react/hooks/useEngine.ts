"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ResultItem } from "app/team/[team_slug]/(team)/~/engine/(instance)/[engineId]/metrics/components/StatusCodes";
import { THIRDWEB_API_HOST } from "constants/urls";
import type { EngineBackendWalletType } from "lib/engine";
import { useState } from "react";
import { useActiveAccount, useActiveWalletChain } from "thirdweb/react";
import invariant from "tiny-invariant";
import { engineKeys } from "../cache-keys";
import { useLoggedInUser } from "./useLoggedInUser";

export type EngineTier = "STARTER" | "PREMIUM" | "ENTERPRISE";

// Engine instances
export type EngineInstance = {
  id: string;
  accountId: string;
  name: string;
  url: string;
  lastAccessedAt: string;
  status:
    | "active"
    | "pending"
    | "requested"
    | "deploying"
    | "paymentFailed"
    | "deploymentFailed";
  deploymentId?: string;
};

// Not checking for null token because the token is required the tanstack useQuery hook
const getEngineRequestHeaders = (token: string | null): HeadersInit => {
  const basicHeaders = {
    "Content-Type": "application/json",
    // This is required to skip the browser warning when using ngrok
    // else, Engine -> Explorer doesn't work
    // more info: https://ngrok.com/abuse
    "ngrok-skip-browser-warning": "true",
  };
  if (!token) {
    return basicHeaders;
  }

  return {
    ...basicHeaders,
    Authorization: `Bearer ${token}`,
  };
};

export function useEngineInstances() {
  const { user, isLoggedIn } = useLoggedInUser();

  return useQuery({
    queryKey: engineKeys.instances(user?.address as string),
    queryFn: async (): Promise<EngineInstance[]> => {
      const res = await fetch(`${THIRDWEB_API_HOST}/v1/engine`, {
        method: "GET",
      });
      if (!res.ok) {
        throw new Error(`Unexpected status ${res.status}: ${await res.text()}`);
      }

      const json = await res.json();
      const instances = (json.data?.instances as EngineInstance[]) || [];

      return instances.map((instance) => {
        // Sanitize: Add trailing slash if not present.
        const url = instance.url.endsWith("/")
          ? instance.url
          : `${instance.url}/`;
        return {
          ...instance,
          url,
        };
      });
    },
    enabled: !!user?.address && isLoggedIn,
  });
}

// GET Requests
export type BackendWallet = {
  address: string;
  label?: string;
  type: string;
  awsKmsKeyId?: string | null;
  awsKmsArn?: string | null;
  gcpKmsKeyId?: string | null;
  gcpKmsKeyRingId?: string | null;
  gcpKmsLocationId?: string | null;
  gcpKmsKeyVersionId?: string | null;
  gcpKmsResourcePath?: string | null;
};

export function useEngineBackendWallets(instance: string) {
  const token = useLoggedInUser().user?.jwt ?? null;

  return useQuery({
    queryKey: [engineKeys.backendWallets(instance)],
    queryFn: async () => {
      const res = await fetch(`${instance}backend-wallet/get-all?limit=50`, {
        method: "GET",
        headers: getEngineRequestHeaders(token),
      });

      const json = await res.json();

      return (json.result as BackendWallet[]) || [];
    },
    enabled: !!instance && !!token,
  });
}

type EngineFeature =
  | "KEYPAIR_AUTH"
  | "CONTRACT_SUBSCRIPTIONS"
  | "IP_ALLOWLIST"
  | "HETEROGENEOUS_WALLET_TYPES"
  | "SMART_BACKEND_WALLETS";

interface EngineSystemHealth {
  status: string;
  engineVersion?: string;
  features?: EngineFeature[];
}

export function useEngineSystemHealth(
  instanceUrl: string,
  pollInterval: number | false = false,
) {
  return useQuery({
    queryKey: engineKeys.health(instanceUrl),
    queryFn: async () => {
      const res = await fetch(`${instanceUrl}system/health`, {
        headers: getEngineRequestHeaders(null),
      });
      if (!res.ok) {
        throw new Error(`Unexpected status ${res.status}: ${await res.text()}`);
      }
      const json = (await res.json()) as EngineSystemHealth;
      return json;
    },
    enabled: !!instanceUrl,
    refetchInterval: pollInterval,
  });
}

// Helper function to check if a feature is supported.
export function useHasEngineFeature(
  instanceUrl: string,
  feature: EngineFeature,
) {
  const query = useEngineSystemHealth(instanceUrl);
  return {
    query,
    isSupported: !!query.data?.features?.includes(feature),
  };
}

interface EngineSystemQueueMetrics {
  result: {
    queued: number;
    pending: number;
    latency?: {
      msToSend: { p50: number; p90: number };
      msToMine: { p50: number; p90: number };
    };
  };
}

export function useEngineQueueMetrics(
  instanceUrl: string,
  pollInterval: number | false = false,
) {
  const token = useLoggedInUser().user?.jwt ?? null;

  return useQuery({
    queryKey: engineKeys.queueMetrics(instanceUrl),
    queryFn: async () => {
      const res = await fetch(`${instanceUrl}system/queue`, {
        headers: getEngineRequestHeaders(token),
      });
      if (!res.ok) {
        throw new Error(`Unexpected status ${res.status}: ${await res.text()}`);
      }
      return (await res.json()) as EngineSystemQueueMetrics;
    },
    enabled: !!instanceUrl && !!token,
    refetchInterval: pollInterval,
  });
}

interface GetDeploymentPublicConfigurationInput {
  teamSlug: string;
}

interface DeploymentPublicConfigurationResponse {
  serverVersions: {
    name: string;
    createdAt: string;
  }[];
}

export function useEngineGetDeploymentPublicConfiguration(
  input: GetDeploymentPublicConfigurationInput,
) {
  return useQuery<DeploymentPublicConfigurationResponse>({
    queryKey: engineKeys.deploymentPublicConfiguration(),
    queryFn: async () => {
      const res = await fetch(
        `${THIRDWEB_API_HOST}/v1/teams/${input.teamSlug}/engine/deployments/public-configuration`,
        { method: "GET" },
      );
      if (!res.ok) {
        throw new Error(`Unexpected status ${res.status}: ${await res.text()}`);
      }

      const json = await res.json();
      return json.data as DeploymentPublicConfigurationResponse;
    },
  });
}

interface UpdateDeploymentInput {
  teamSlug: string;
  deploymentId: string;
  serverVersion: string;
}

export function useEngineUpdateDeployment() {
  return useMutation({
    mutationFn: async (input: UpdateDeploymentInput) => {
      const res = await fetch(
        `${THIRDWEB_API_HOST}/v1/teams/${input.teamSlug}/engine/deployments/${input.deploymentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            serverVersion: input.serverVersion,
          }),
        },
      );
      // we never use the response body
      res.body?.cancel();
      if (!res.ok) {
        throw new Error(`Unexpected status ${res.status}: ${await res.text()}`);
      }
    },
  });
}

export function useEngineRemoveFromDashboard() {
  const { user } = useLoggedInUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (instanceId: string) => {
      invariant(instanceId, "instance is required");

      const res = await fetch(`${THIRDWEB_API_HOST}/v1/engine/${instanceId}`, {
        method: "DELETE",
      });
      // we never use the response body
      res.body?.cancel();
      if (!res.ok) {
        throw new Error(`Unexpected status ${res.status}: ${await res.text()}`);
      }
    },

    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: engineKeys.instances(user?.address as string),
      });
    },
  });
}

export interface DeleteCloudHostedInput {
  deploymentId: string;
  reason: "USING_SELF_HOSTED" | "TOO_EXPENSIVE" | "MISSING_FEATURES" | "OTHER";
  feedback: string;
}

export function useEngineDeleteCloudHosted() {
  const { user } = useLoggedInUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      deploymentId,
      reason,
      feedback,
    }: DeleteCloudHostedInput) => {
      const res = await fetch(
        `${THIRDWEB_API_HOST}/v2/engine/deployments/${deploymentId}/infrastructure/delete`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ reason, feedback }),
        },
      );
      // we never use the response body
      res.body?.cancel();
      if (!res.ok) {
        throw new Error(`Unexpected status ${res.status}: ${await res.text()}`);
      }
    },

    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: engineKeys.instances(user?.address as string),
      });
    },
  });
}

export interface EditEngineInstanceInput {
  instanceId: string;
  name: string;
  url: string;
}

export function useEngineEditInstance() {
  const { user } = useLoggedInUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ instanceId, name, url }: EditEngineInstanceInput) => {
      const res = await fetch(`${THIRDWEB_API_HOST}/v1/engine/${instanceId}`, {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, url }),
      });
      // we never use the response body
      res.body?.cancel();
      if (!res.ok) {
        throw new Error(`Unexpected status ${res.status}: ${await res.text()}`);
      }
    },

    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: engineKeys.instances(user?.address as string),
      });
    },
  });
}

export type Transaction = {
  queueId?: string | null;
  chainId?: string | null;
  fromAddress?: string | null;
  toAddress?: string | null;
  data?: string | null;
  extension?: string | null;
  value?: string | null;
  nonce?: number | null;
  gasLimit?: string | null;
  gasPrice?: string | null;
  maxFeePerGas?: string | null;
  maxPriorityFeePerGas?: string | null;
  effectiveGasPrice?: string | null;
  transactionType?: number | null;
  transactionHash?: string | null;
  queuedAt?: string | null;
  processedAt?: string | null;
  sentAt?: string | null;
  minedAt?: string | null;
  cancelledAt?: string | null;
  deployedContractAddress?: string | null;
  deployedContractType?: string | null;
  errorMessage?: string | null;
  sentAtBlockNumber?: number | null;
  blockNumber?: number | null;
  status?: string | null;
  retryCount: number;
  retryGasValues?: boolean | null;
  retryMaxFeePerGas?: string | null;
  retryMaxPriorityFeePerGas?: string | null;
  signerAddress?: string | null;
  accountAddress?: string | null;
  target?: string | null;
  sender?: string | null;
  initCode?: string | null;
  callData?: string | null;
  callGasLimit?: string | null;
  verificationGasLimit?: string | null;
  preVerificationGas?: string | null;

  paymasterAndData?: string | null;
  userOpHash?: string | null;
  functionName?: string | null;
  functionArgs?: string | null;
};

type TransactionResponse = {
  transactions: Transaction[];
  totalCount: number;
};

/**
 * Gets transactions for an Engine instance.
 *
 * @param instance
 * @param autoUpdate - If true, refetches every 4 seconds.
 * @returns
 */
export function useEngineTransactions(instance: string, autoUpdate: boolean) {
  const token = useLoggedInUser().user?.jwt ?? null;

  return useQuery({
    queryKey: engineKeys.transactions(instance),
    queryFn: async () => {
      const res = await fetch(`${instance}transaction/get-all`, {
        method: "GET",
        headers: getEngineRequestHeaders(token),
      });

      const json = await res.json();

      return (json.result as TransactionResponse) || {};
    },

    enabled: !!instance && !!token,
    refetchInterval: autoUpdate ? 4_000 : false,
  });
}

export interface WalletConfigResponse {
  type: EngineBackendWalletType;

  awsAccessKeyId?: string | null;
  awsRegion?: string | null;

  gcpApplicationProjectId?: string | null;
  gcpKmsLocationId?: string | null;
  gcpKmsKeyRingId?: string | null;
  gcpApplicationCredentialEmail?: string | null;
}

export function useEngineWalletConfig(instance: string) {
  const token = useLoggedInUser().user?.jwt ?? null;

  return useQuery<WalletConfigResponse>({
    queryKey: engineKeys.walletConfig(instance),
    queryFn: async () => {
      const res = await fetch(`${instance}configuration/wallets`, {
        method: "GET",
        headers: getEngineRequestHeaders(token),
      });

      const json = await res.json();
      return json.result;
    },
    enabled: !!instance && !!token,
  });
}

type CurrencyValue = {
  name: string;
  symbol: string;
  decimals: number;
  value: string;
  displayValue: string;
};

export function useEngineBackendWalletBalance(
  instance: string,
  address: string,
) {
  const token = useLoggedInUser().user?.jwt ?? null;
  const chainId = useActiveWalletChain()?.id;

  invariant(chainId, "chainId is required");

  return useQuery({
    queryKey: engineKeys.backendWalletBalance(address, chainId),
    queryFn: async () => {
      const res = await fetch(
        `${instance}backend-wallet/${chainId}/${address}/get-balance`,
        {
          method: "GET",
          headers: getEngineRequestHeaders(token),
        },
      );

      const json = await res.json();

      return (json.result as CurrencyValue) || {};
    },
    enabled: !!instance && !!address && !!chainId && !!token,
  });
}

export type EngineAdmin = {
  walletAddress: string;
  label?: string;
  permissions: "OWNER" | "ADMIN";
};

export function useEnginePermissions(instance: string) {
  const token = useLoggedInUser().user?.jwt ?? null;
  const address = useActiveAccount()?.address;

  return useQuery({
    queryKey: engineKeys.permissions(instance),
    queryFn: async () => {
      const res = await fetch(`${instance}auth/permissions/get-all`, {
        method: "GET",
        headers: getEngineRequestHeaders(token),
      });

      if (res.status !== 200) {
        throw new Error(`${res.status}`);
      }

      const json = await res.json();

      return (json.result as EngineAdmin[]) || [];
    },

    enabled: !!instance && !!token && !!address,
  });
}

export type AccessToken = {
  id: string;
  tokenMask: string;
  walletAddress: string;
  createdAt: string;
  expiresAt: string;
  label?: string;
};

export function useEngineAccessTokens(instance: string) {
  const token = useLoggedInUser().user?.jwt ?? null;

  return useQuery({
    queryKey: engineKeys.accessTokens(instance),
    queryFn: async () => {
      const res = await fetch(`${instance}auth/access-tokens/get-all`, {
        method: "GET",
        headers: getEngineRequestHeaders(token),
      });

      const json = await res.json();

      return (json.result as AccessToken[]) || [];
    },
    enabled: !!instance && !!token,
  });
}

export type KeypairAlgorithm = "ES256" | "RS256" | "PS256";

export type Keypair = {
  hash: string;
  label?: string;
  publicKey: string;
  algorithm: KeypairAlgorithm;
  createdAt: string;
  updatedAt: string;
};

export function useEngineKeypairs(instance: string) {
  const token = useLoggedInUser().user?.jwt ?? null;

  return useQuery({
    queryKey: engineKeys.keypairs(instance),
    queryFn: async () => {
      const res = await fetch(`${instance}auth/keypair/get-all`, {
        method: "GET",
        headers: getEngineRequestHeaders(token),
      });

      const json = await res.json();

      return (json.result as Keypair[]) || [];
    },
    enabled: !!instance && !!token,
  });
}

type AddKeypairInput = {
  label?: string;
  publicKey: string;
  algorithm: string;
};

export function useEngineAddKeypair(instance: string) {
  const token = useLoggedInUser().user?.jwt ?? null;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: AddKeypairInput) => {
      invariant(instance, "instance is required");

      const res = await fetch(`${instance}auth/keypair/add`, {
        method: "POST",
        headers: getEngineRequestHeaders(token),
        body: JSON.stringify(input),
      });
      const json = await res.json();

      if (json.error) {
        throw new Error(json.error.message);
      }

      return json.result;
    },
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: engineKeys.keypairs(instance),
      });
    },
  });
}

type RemoveKeypairInput = {
  hash: string;
};

export function useEngineRemoveKeypair(instance: string) {
  const token = useLoggedInUser().user?.jwt ?? null;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: RemoveKeypairInput) => {
      invariant(instance, "instance is required");

      const res = await fetch(`${instance}auth/keypair/remove`, {
        method: "POST",
        headers: getEngineRequestHeaders(token),
        body: JSON.stringify(input),
      });
      const json = await res.json();

      if (json.error) {
        throw new Error(json.error.message);
      }

      return json.result;
    },
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: engineKeys.keypairs(instance),
      });
    },
  });
}

export type EngineRelayer = {
  id: string;
  name?: string;
  chainId: string;
  backendWalletAddress: string;
  allowedContracts?: string[];
  allowedForwarders?: string[];
};

export function useEngineRelayer(instance: string) {
  const token = useLoggedInUser().user?.jwt ?? null;

  return useQuery({
    queryKey: engineKeys.relayers(instance),
    queryFn: async () => {
      const res = await fetch(`${instance}relayer/get-all`, {
        method: "GET",
        headers: getEngineRequestHeaders(token),
      });

      const json = await res.json();

      return (json.result as EngineRelayer[]) || [];
    },
    enabled: !!instance && !!token,
  });
}

export type CreateRelayerInput = {
  name?: string;
  chain: string;
  backendWalletAddress: string;
  allowedContracts?: string[];
  allowedForwarders?: string[];
};

export function useEngineCreateRelayer(instance: string) {
  const token = useLoggedInUser().user?.jwt ?? null;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateRelayerInput) => {
      invariant(instance, "instance is required");

      const res = await fetch(`${instance}relayer/create`, {
        method: "POST",
        headers: getEngineRequestHeaders(token),
        body: JSON.stringify(input),
      });
      const json = await res.json();

      if (json.error) {
        throw new Error(json.error.message);
      }

      return json.result;
    },
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: engineKeys.relayers(instance),
      });
    },
  });
}

type RevokeRelayerInput = {
  id: string;
};

export function useEngineRevokeRelayer(instance: string) {
  const token = useLoggedInUser().user?.jwt ?? null;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: RevokeRelayerInput) => {
      invariant(instance, "instance is required");

      const res = await fetch(`${instance}relayer/revoke`, {
        method: "POST",
        headers: getEngineRequestHeaders(token),
        body: JSON.stringify(input),
      });
      const json = await res.json();

      if (json.error) {
        throw new Error(json.error.message);
      }

      return json.result;
    },
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: engineKeys.relayers(instance),
      });
    },
  });
}

export type UpdateRelayerInput = {
  id: string;
  name?: string;
  chain: string;
  backendWalletAddress: string;
  allowedContracts?: string[];
  allowedForwarders?: string[];
};

export function useEngineUpdateRelayer(instance: string) {
  const token = useLoggedInUser().user?.jwt ?? null;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateRelayerInput) => {
      invariant(instance, "instance is required");

      const res = await fetch(`${instance}relayer/update`, {
        method: "POST",
        headers: getEngineRequestHeaders(token),
        body: JSON.stringify(input),
      });
      const json = await res.json();

      if (json.error) {
        throw new Error(json.error.message);
      }

      return json.result;
    },
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: engineKeys.relayers(instance),
      });
    },
  });
}

export interface EngineWebhook {
  url: string;
  name: string;
  secret?: string | null;
  eventType: string;
  active: boolean;
  createdAt: string;
  id: number;
}

export function useEngineWebhooks(instance: string) {
  const token = useLoggedInUser().user?.jwt ?? null;

  return useQuery({
    queryKey: engineKeys.webhooks(instance),
    queryFn: async () => {
      const res = await fetch(`${instance}webhooks/get-all`, {
        method: "GET",
        headers: getEngineRequestHeaders(token),
      });

      const json = await res.json();

      return (json.result as EngineWebhook[]) || [];
    },
    enabled: !!instance && !!token,
  });
}

// POST REQUESTS
export type SetWalletConfigInput =
  | {
      type: "aws-kms";
      awsAccessKeyId: string;
      awsSecretAccessKey: string;
      awsRegion: string;
    }
  | {
      type: "gcp-kms";
      gcpApplicationProjectId: string;
      gcpKmsLocationId: string;
      gcpKmsKeyRingId: string;
      gcpApplicationCredentialEmail: string;
      gcpApplicationCredentialPrivateKey: string;
    };

export function useEngineSetWalletConfig(instance: string) {
  const token = useLoggedInUser().user?.jwt ?? null;
  const queryClient = useQueryClient();

  return useMutation<WalletConfigResponse, void, SetWalletConfigInput>({
    mutationFn: async (input) => {
      invariant(instance, "instance is required");

      const res = await fetch(`${instance}configuration/wallets`, {
        method: "POST",
        headers: getEngineRequestHeaders(token),
        body: JSON.stringify(input),
      });
      const json = await res.json();

      if (json.error) {
        throw new Error(json.error.message);
      }

      return json.result;
    },
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: engineKeys.walletConfig(instance),
      });
    },
  });
}

export type CreateBackendWalletInput = {
  type: EngineBackendWalletType;
  label?: string;
};

export function useEngineCreateBackendWallet(instance: string) {
  const token = useLoggedInUser().user?.jwt ?? null;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateBackendWalletInput) => {
      invariant(instance, "instance is required");

      const res = await fetch(`${instance}backend-wallet/create`, {
        method: "POST",
        headers: getEngineRequestHeaders(token),
        body: JSON.stringify(input),
      });
      const json = await res.json();

      if (json.error) {
        throw new Error(json.error.message);
      }

      return json.result;
    },
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: engineKeys.backendWallets(instance),
      });
    },
  });
}

interface UpdateBackendWalletInput {
  walletAddress: string;
  label?: string;
}

export function useEngineUpdateBackendWallet(instance: string) {
  const token = useLoggedInUser().user?.jwt ?? null;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateBackendWalletInput) => {
      invariant(instance, "instance is required");

      const res = await fetch(`${instance}backend-wallet/update`, {
        method: "POST",
        headers: getEngineRequestHeaders(token),
        body: JSON.stringify(input),
      });
      const json = await res.json();

      if (json.error) {
        throw new Error(json.error.message);
      }

      return json.result;
    },
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: engineKeys.backendWallets(instance),
      });
    },
  });
}

// The backend determines the wallet imported based on the provided fields.
export type ImportBackendWalletInput = {
  label?: string;

  awsKmsArn?: string;

  gcpKmsKeyId?: string;
  gcpKmsKeyVersionId?: string;

  privateKey?: string;
  mnemonic?: string;
  encryptedJson?: string;
  password?: string;
};

export function useEngineImportBackendWallet(instance: string) {
  const token = useLoggedInUser().user?.jwt ?? null;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: ImportBackendWalletInput) => {
      invariant(instance, "instance is required");

      const res = await fetch(`${instance}backend-wallet/import`, {
        method: "POST",
        headers: getEngineRequestHeaders(token),
        body: JSON.stringify(input),
      });
      const json = await res.json();

      if (json.error) {
        throw new Error(json.error.message);
      }

      return json.result;
    },
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: engineKeys.backendWallets(instance),
      });
    },
  });
}

export function useEngineGrantPermissions(instance: string) {
  const token = useLoggedInUser().user?.jwt ?? null;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: EngineAdmin) => {
      invariant(instance, "instance is required");

      const res = await fetch(`${instance}auth/permissions/grant`, {
        method: "POST",
        headers: getEngineRequestHeaders(token),
        body: JSON.stringify(input),
      });
      const json = await res.json();

      if (json.error) {
        throw new Error(json.error.message);
      }

      return json.result;
    },
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: engineKeys.permissions(instance),
      });
    },
  });
}

type RevokePermissionsInput = {
  walletAddress: string;
};

export function useEngineRevokePermissions(instance: string) {
  const token = useLoggedInUser().user?.jwt ?? null;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: RevokePermissionsInput) => {
      invariant(instance, "instance is required");

      const res = await fetch(`${instance}auth/permissions/revoke`, {
        method: "POST",
        headers: getEngineRequestHeaders(token),
        body: JSON.stringify(input),
      });
      const json = await res.json();

      if (json.error) {
        throw new Error(json.error.message);
      }

      return json.result;
    },
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: engineKeys.permissions(instance),
      });
    },
  });
}

type CreateAccessTokenResponse = AccessToken & {
  accessToken: string;
};

export function useEngineCreateAccessToken(instance: string) {
  const token = useLoggedInUser().user?.jwt ?? null;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      invariant(instance, "instance is required");

      const res = await fetch(`${instance}auth/access-tokens/create`, {
        method: "POST",
        headers: getEngineRequestHeaders(token),
        body: JSON.stringify({}),
      });
      const json = await res.json();

      if (json.error) {
        throw new Error(json.error.message);
      }

      return json.result as CreateAccessTokenResponse;
    },
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: engineKeys.accessTokens(instance),
      });
    },
  });
}

type RevokeAccessTokenInput = {
  id: string;
};

export function useEngineRevokeAccessToken(instance: string) {
  const token = useLoggedInUser().user?.jwt ?? null;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: RevokeAccessTokenInput) => {
      invariant(instance, "instance is required");

      const res = await fetch(`${instance}auth/access-tokens/revoke`, {
        method: "POST",
        headers: getEngineRequestHeaders(token),
        body: JSON.stringify(input),
      });
      const json = await res.json();

      if (json.error) {
        throw new Error(json.error.message);
      }

      return json.result;
    },
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: engineKeys.accessTokens(instance),
      });
    },
  });
}

type UpdateAccessTokenInput = {
  id: string;
  label?: string;
};

export function useEngineUpdateAccessToken(instance: string) {
  const token = useLoggedInUser().user?.jwt ?? null;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateAccessTokenInput) => {
      invariant(instance, "instance is required");

      const res = await fetch(`${instance}auth/access-tokens/update`, {
        method: "POST",
        headers: getEngineRequestHeaders(token),
        body: JSON.stringify(input),
      });
      const json = await res.json();

      if (json.error) {
        throw new Error(json.error.message);
      }

      return json.result;
    },
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: engineKeys.accessTokens(instance),
      });
    },
  });
}

export type CreateWebhookInput = {
  url: string;
  name: string;
  eventType: string;
};

export function useEngineCreateWebhook(instance: string) {
  const token = useLoggedInUser().user?.jwt ?? null;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateWebhookInput) => {
      invariant(instance, "instance is required");

      const res = await fetch(`${instance}webhooks/create`, {
        method: "POST",
        headers: getEngineRequestHeaders(token),
        body: JSON.stringify(input),
      });
      const json = await res.json();

      if (json.error) {
        throw new Error(json.error.message);
      }

      return json.result;
    },
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: engineKeys.webhooks(instance),
      });
    },
  });
}

type RevokeWebhookInput = {
  id: number;
};

export function useEngineRevokeWebhook(instance: string) {
  const token = useLoggedInUser().user?.jwt ?? null;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: RevokeWebhookInput) => {
      invariant(instance, "instance is required");

      const res = await fetch(`${instance}webhooks/revoke`, {
        method: "POST",
        headers: getEngineRequestHeaders(token),
        body: JSON.stringify(input),
      });
      const json = await res.json();

      if (json.error) {
        throw new Error(json.error.message);
      }

      return json.result;
    },
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: engineKeys.webhooks(instance),
      });
    },
  });
}

type SendTokensInput = {
  chainId: number;
  fromAddress: string;
  toAddress: string;
  amount: number;
  currencyAddress?: string;
};

export function useEngineSendTokens(instance: string) {
  const token = useLoggedInUser().user?.jwt ?? null;

  return useMutation({
    mutationFn: async (input: SendTokensInput) => {
      invariant(instance, "instance is required");

      const res = await fetch(
        `${instance}backend-wallet/${input.chainId}/transfer`,
        {
          method: "POST",
          headers: {
            ...getEngineRequestHeaders(token),
            "x-backend-wallet-address": input.fromAddress,
          },
          body: JSON.stringify({
            to: input.toAddress,
            amount: input.amount.toString(),
            currencyAddress: input.currencyAddress,
          }),
        },
      );
      const json = await res.json();

      if (json.error) {
        throw new Error(json.error.message);
      }

      return json.result;
    },
  });
}

export function useEngineCorsConfiguration(instance: string) {
  const token = useLoggedInUser().user?.jwt ?? null;

  return useQuery({
    queryKey: engineKeys.corsUrls(instance),
    queryFn: async () => {
      const res = await fetch(`${instance}configuration/cors`, {
        method: "GET",
        headers: getEngineRequestHeaders(token),
      });

      const json = await res.json();

      return (json.result as string[]) || [];
    },
    enabled: !!instance && !!token,
  });
}

interface SetCorsUrlInput {
  urls: string[];
}

export function useEngineSetCorsConfiguration(instance: string) {
  const queryClient = useQueryClient();
  const token = useLoggedInUser().user?.jwt ?? null;

  return useMutation({
    mutationFn: async (input: SetCorsUrlInput) => {
      invariant(instance, "instance is required");

      const res = await fetch(`${instance}configuration/cors`, {
        method: "PUT",
        headers: getEngineRequestHeaders(token),
        body: JSON.stringify(input),
      });
      const json = await res.json();

      if (json.error) {
        throw new Error(json.error.message);
      }

      return json.result;
    },

    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: engineKeys.corsUrls(instance),
      });
    },
  });
}

export function useEngineIpAllowlistConfiguration(instance: string) {
  const token = useLoggedInUser().user?.jwt ?? null;

  // don't bother sending requests that bounce
  // if engine instance is not updated to have IP_ALLOWLIST
  const { data: health } = useEngineSystemHealth(instance);

  return useQuery({
    queryKey: engineKeys.ipAllowlist(instance),
    queryFn: async () => {
      const res = await fetch(`${instance}configuration/ip-allowlist`, {
        method: "GET",
        headers: getEngineRequestHeaders(token),
      });

      const json = await res.json();
      return (json.result as string[]) || [];
    },

    enabled:
      !!instance && !!token && health?.features?.includes("IP_ALLOWLIST"),
  });
}

interface SetIpAllowlistInput {
  ips: string[];
}

export function useEngineSetIpAllowlistConfiguration(instance: string) {
  const queryClient = useQueryClient();
  const token = useLoggedInUser().user?.jwt ?? null;

  return useMutation({
    mutationFn: async (input: SetIpAllowlistInput) => {
      invariant(instance, "instance is required");

      const res = await fetch(`${instance}configuration/ip-allowlist`, {
        method: "PUT",
        headers: getEngineRequestHeaders(token),
        body: JSON.stringify(input),
      });
      const json = await res.json();

      if (json.error) {
        throw new Error(json.error.message);
      }

      return json.result;
    },

    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: engineKeys.ipAllowlist(instance),
      });
    },
  });
}

export interface EngineContractSubscription {
  id: string;
  chainId: number;
  contractAddress: string;
  webhook?: EngineWebhook;
  createdAt: Date;
  processEventLogs: boolean;
  filterEvents: string[];
  processTransactionReceipts: boolean;
  filterFunctions: string[];

  // Dummy field for the table.
  lastIndexedBlock: string;
}

export function useEngineContractSubscription(instance: string) {
  const token = useLoggedInUser().user?.jwt ?? null;
  return useQuery({
    queryKey: engineKeys.contractSubscriptions(instance),
    queryFn: async () => {
      const res = await fetch(`${instance}contract-subscriptions/get-all`, {
        method: "GET",
        headers: getEngineRequestHeaders(token),
      });

      const json = await res.json();
      return json.result as EngineContractSubscription[];
    },

    enabled: !!instance && !!token,
  });
}

export interface AddContractSubscriptionInput {
  chain: string;
  contractAddress: string;
  webhookUrl: string;
  processEventLogs: boolean;
  filterEvents: string[];
  processTransactionReceipts: boolean;
  filterFunctions: string[];
}

export function useEngineAddContractSubscription(instance: string) {
  const queryClient = useQueryClient();
  const token = useLoggedInUser().user?.jwt ?? null;

  return useMutation({
    mutationFn: async (input: AddContractSubscriptionInput) => {
      invariant(instance, "instance is required");

      const res = await fetch(`${instance}contract-subscriptions/add`, {
        method: "POST",
        headers: getEngineRequestHeaders(token),
        body: JSON.stringify(input),
      });
      const json = await res.json();

      if (json.error) {
        throw new Error(json.error.message);
      }

      return json.result;
    },

    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: engineKeys.contractSubscriptions(instance),
      });
    },
  });
}

interface RemoveContractSubscriptionInput {
  contractSubscriptionId: string;
}

export function useEngineRemoveContractSubscription(instance: string) {
  const queryClient = useQueryClient();
  const token = useLoggedInUser().user?.jwt ?? null;

  return useMutation({
    mutationFn: async (input: RemoveContractSubscriptionInput) => {
      invariant(instance, "instance is required");

      const res = await fetch(`${instance}contract-subscriptions/remove`, {
        method: "POST",
        headers: getEngineRequestHeaders(token),
        body: JSON.stringify(input),
      });
      const json = await res.json();

      if (json.error) {
        throw new Error(json.error.message);
      }

      return json.result;
    },

    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: engineKeys.contractSubscriptions(instance),
      });
    },
  });
}

export function useEngineSubscriptionsLastBlock(
  instanceUrl: string,
  chainId: number,
  autoUpdate: boolean,
) {
  const token = useLoggedInUser().user?.jwt ?? null;

  return useQuery({
    queryKey: engineKeys.contractSubscriptionsLastBlock(instanceUrl, chainId),
    queryFn: async () => {
      const response = await fetch(
        `${instanceUrl}contract-subscriptions/last-block?chain=${chainId}`,
        {
          method: "GET",
          headers: getEngineRequestHeaders(token),
        },
      );

      const json = await response.json();
      return json.result.lastBlock as number;
    },

    enabled: !!instanceUrl && !!token,
    refetchInterval: autoUpdate ? 5_000 : false,
  });
}

interface EngineResourceMetrics {
  error: string;
  data: {
    cpu: number;
    memory: number;
    errorRate: ResultItem[];
    statusCodes: ResultItem[];
    requestVolume: ResultItem[];
  };
}

export function useEngineSystemMetrics(engineId: string) {
  const [enabled, setEnabled] = useState(true);

  return useQuery({
    queryKey: engineKeys.systemMetrics(engineId),
    queryFn: async () => {
      const res = await fetch(
        `${THIRDWEB_API_HOST}/v1/engine/${engineId}/metrics`,
      );
      if (!res.ok) {
        setEnabled(false);
        throw new Error(`Unexpected status ${res.status}: ${await res.text()}`);
      }
      const json = (await res.json()) as EngineResourceMetrics;
      return json;
    },

    // Poll every 5s unless disabled.
    enabled,
    refetchInterval: 5_000,
  });
}

export interface EngineAlertRule {
  id: string;
  title: string;
  // A unique string identifying the alert.
  // Note the "." which allows `subscriptionRoutes` to use wildcards in notificationChannel.
  // Example: "alert.sla-5xx-99"
  routingKey: string;
  description: string;
  createdAt: Date;
  pausedAt: Date | null;
}

export function useEngineAlertRules(engineId: string) {
  const { isLoggedIn } = useLoggedInUser();

  return useQuery({
    queryKey: engineKeys.alertRules(engineId),
    queryFn: async () => {
      const res = await fetch(
        `${THIRDWEB_API_HOST}/v1/engine/${engineId}/alert-rules`,
        { method: "GET" },
      );
      if (!res.ok) {
        throw new Error(`Unexpected status ${res.status}: ${await res.text()}`);
      }

      const json = await res.json();
      return json.data as EngineAlertRule[];
    },
    enabled: isLoggedIn,
  });
}

export interface EngineAlert {
  id: string;
  alertRuleId: string;
  status: "pending" | "firing" | "resolved";
  startsAt: Date;
  endsAt: Date | null;
}

export function useEngineAlerts(engineId: string, limit: number, offset = 0) {
  const { isLoggedIn } = useLoggedInUser();

  return useQuery({
    queryKey: engineKeys.alerts(engineId),
    queryFn: async () => {
      const res = await fetch(
        `${THIRDWEB_API_HOST}/v1/engine/${engineId}/alerts?limit=${limit}&offset=${offset}`,
        { method: "GET" },
      );
      if (!res.ok) {
        throw new Error(`Unexpected status ${res.status}: ${await res.text()}`);
      }

      const json = await res.json();
      return json.data as EngineAlert[];
    },
    enabled: isLoggedIn,
  });
}

export const EngineNotificationChannelTypeConfig = {
  slack: {
    display: "Slack",
    valueDisplay: "Slack Webhook URL",
  },
  email: {
    display: "Email",
    valueDisplay: "Email Address",
  },
} as const;

type EngineNotificationChannelType =
  keyof typeof EngineNotificationChannelTypeConfig;

export type EngineNotificationChannel = {
  id: string;
  type: EngineNotificationChannelType;
  value: string;
  createdAt: Date;
  pausedAt: Date | null;
  // A list of routingKeys to listen to. Supports wildcards.
  // Example: [ 'alert.sla-5xx-99' ] or [ 'alert.*' ] will both notify when
  // the alert with routingKey `alert.sla-5xx-99` triggers.
  subscriptionRoutes: string[];
};

export function useEngineNotificationChannels(engineId: string) {
  const { isLoggedIn } = useLoggedInUser();

  return useQuery({
    queryKey: engineKeys.notificationChannels(engineId),
    queryFn: async () => {
      const res = await fetch(
        `${THIRDWEB_API_HOST}/v1/engine/${engineId}/notification-channels`,
        { method: "GET" },
      );
      if (!res.ok) {
        throw new Error(`Unexpected status ${res.status}: ${await res.text()}`);
      }

      const json = await res.json();
      return json.data as EngineNotificationChannel[];
    },
    enabled: isLoggedIn,
  });
}

export interface CreateNotificationChannelInput {
  subscriptionRoutes: string[];
  type: "slack" | "email"; // TODO: Add others when implemented.
  value: string;
}

export function useEngineCreateNotificationChannel(engineId: string) {
  const { isLoggedIn } = useLoggedInUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateNotificationChannelInput) => {
      invariant(isLoggedIn, "Must be logged in.");

      const res = await fetch(
        `${THIRDWEB_API_HOST}/v1/engine/${engineId}/notification-channels`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(input),
        },
      );
      if (!res.ok) {
        throw new Error(`Unexpected status ${res.status}: ${await res.text()}`);
      }

      const json = await res.json();
      return json.data as EngineNotificationChannel;
    },
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: engineKeys.notificationChannels(engineId),
      });
    },
  });
}

export function useEngineDeleteNotificationChannel(engineId: string) {
  const { isLoggedIn } = useLoggedInUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationChannelId: string) => {
      invariant(isLoggedIn, "Must be logged in.");

      const res = await fetch(
        `${THIRDWEB_API_HOST}/v1/engine/${engineId}/notification-channels/${notificationChannelId}`,
        {
          method: "DELETE",
        },
      );
      if (!res.ok) {
        throw new Error(`Unexpected status ${res.status}: ${await res.text()}`);
      }
      res.body?.cancel();
    },
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: engineKeys.notificationChannels(engineId),
      });
    },
  });
}
