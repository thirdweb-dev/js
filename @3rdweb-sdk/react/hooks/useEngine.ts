import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { engineKeys } from "../cache-keys";
import { useMutationWithInvalidate } from "./query/useQueryWithNetwork";
import invariant from "tiny-invariant";
import { useApiAuthToken } from "./useApi";
import { useAddress, useChainId } from "@thirdweb-dev/react";
import { THIRDWEB_API_HOST } from "constants/urls";
import { useLoggedInUser } from "./useLoggedInUser";

// Engine instances
export interface EngineInstance {
  id: string;
  accountId: string;
  name: string;
  url: string;
  lastAccessedAt: string;
}

export function useEngineInstances() {
  const { token } = useApiAuthToken();
  const { user } = useLoggedInUser();

  return useQuery(
    engineKeys.instances(user?.address ?? ""),
    async (): Promise<EngineInstance[]> => {
      const res = await fetch(`${THIRDWEB_API_HOST}/v1/engine`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        throw new Error(`Unexpected status ${res.status}`);
      }

      const json = await res.json();
      return json.data?.instances || [];
    },
    {
      enabled: !!user && !!token,
    },
  );
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
  const { token } = useApiAuthToken();

  return useQuery(
    engineKeys.backendWallets(instance),
    async () => {
      const res = await fetch(`${instance}backend-wallet/get-all`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await res.json();

      return (json.result as BackendWallet[]) || [];
    },
    { enabled: !!instance && !!token },
  );
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
  // eslint-disable-next-line inclusive-language/use-inclusive-words
  paymasterAndData?: string | null;
  userOpHash?: string | null;
  functionName?: string | null;
  functionArgs?: string | null;
};

export type TransactionResponse = {
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
  const { token } = useApiAuthToken();

  return useQuery(
    engineKeys.transactions(instance),
    async () => {
      const res = await fetch(`${instance}transaction/get-all`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await res.json();

      return (json.result as TransactionResponse) || {};
    },
    {
      enabled: !!instance && !!token,
      refetchInterval: autoUpdate ? 4_000 : false,
    },
  );
}

export type WalletConfig =
  | {
      type: "local";
    }
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

export function useEngineWalletConfig(instance: string) {
  const { token } = useApiAuthToken();

  return useQuery(
    engineKeys.walletConfig(instance),
    async () => {
      const res = await fetch(`${instance}configuration/wallets`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await res.json();

      return (json.result as WalletConfig) || {};
    },
    { enabled: !!instance && !!token },
  );
}

export type CurrencyValue = {
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
  const { token } = useApiAuthToken();
  const chainId = useChainId();

  invariant(chainId, "chainId is required");

  return useQuery(
    engineKeys.backendWalletBalance(address, chainId),
    async () => {
      const res = await fetch(
        `${instance}backend-wallet/${chainId}/${address}/get-balance`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const json = await res.json();

      return (json.result as CurrencyValue) || {};
    },
    { enabled: !!instance && !!address && !!chainId && !!token },
  );
}

export type EngineAdmin = {
  walletAddress: string;
  label?: string;
  permissions: "OWNER" | "ADMIN";
};

export function useEnginePermissions(instance: string) {
  const { token } = useApiAuthToken();
  const address = useAddress();

  return useQuery(
    engineKeys.permissions(instance),
    async () => {
      const res = await fetch(`${instance}auth/permissions/get-all`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status !== 200) {
        throw new Error(`${res.status}`);
      }

      const json = await res.json();

      return (json.result as EngineAdmin[]) || [];
    },
    {
      enabled: !!instance && !!token && !!address,
    },
  );
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
  const { token } = useApiAuthToken();

  return useQuery(
    engineKeys.accessTokens(instance),
    async () => {
      const res = await fetch(`${instance}auth/access-tokens/get-all`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await res.json();

      return (json.result as AccessToken[]) || [];
    },
    { enabled: !!instance && !!token },
  );
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
  const { token } = useApiAuthToken();

  return useQuery(
    engineKeys.relayers(instance),
    async () => {
      const res = await fetch(`${instance}relayer/get-all`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await res.json();

      return (json.result as EngineRelayer[]) || [];
    },
    { enabled: !!instance && !!token },
  );
}

export type CreateRelayerInput = {
  name?: string;
  chain: string;
  backendWalletAddress: string;
  allowedContracts?: string[];
  allowedForwarders?: string[];
};

export function useEngineCreateRelayer(instance: string) {
  const { token } = useApiAuthToken();
  const queryClient = useQueryClient();

  return useMutationWithInvalidate(
    async (input: CreateRelayerInput) => {
      invariant(instance, "instance is required");

      const res = await fetch(`${instance}relayer/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(input),
      });
      const json = await res.json();

      if (json.error) {
        throw new Error(json.message);
      }

      return json.result;
    },
    {
      onSuccess: () => {
        return queryClient.invalidateQueries(engineKeys.relayers(instance));
      },
    },
  );
}

export type RevokeRelayerInput = {
  id: string;
};

export function useEngineRevokeRelayer(instance: string) {
  const { token } = useApiAuthToken();
  const queryClient = useQueryClient();

  return useMutationWithInvalidate(
    async (input: RevokeRelayerInput) => {
      invariant(instance, "instance is required");

      const res = await fetch(`${instance}relayer/revoke`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(input),
      });
      const json = await res.json();

      if (json.error) {
        throw new Error(json.message);
      }

      return json.result;
    },
    {
      onSuccess: () => {
        return queryClient.invalidateQueries(engineKeys.relayers(instance));
      },
    },
  );
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
  const { token } = useApiAuthToken();
  const queryClient = useQueryClient();

  return useMutationWithInvalidate(
    async (input: UpdateRelayerInput) => {
      invariant(instance, "instance is required");

      const res = await fetch(`${instance}relayer/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(input),
      });
      const json = await res.json();

      if (json.error) {
        throw new Error(json.message);
      }

      return json.result;
    },
    {
      onSuccess: () => {
        return queryClient.invalidateQueries(engineKeys.relayers(instance));
      },
    },
  );
}

export type Webhook = {
  url: string;
  name: string;
  secret?: string | null;
  eventType: string;
  active: boolean;
  createdAt: string;
  id: number;
};

export function useEngineWebhooks(instance: string) {
  const { token } = useApiAuthToken();

  return useQuery(
    engineKeys.webhooks(instance),
    async () => {
      const res = await fetch(`${instance}webhooks/get-all`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await res.json();

      return (json.result as Webhook[]) || [];
    },
    { enabled: !!instance && !!token },
  );
}

export function useEngineWebhooksEventTypes(instance: string) {
  const { token } = useApiAuthToken();

  return useQuery(
    engineKeys.webhookEventTypes(instance),
    async () => {
      const res = await fetch(`${instance}webhooks/event-types`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await res.json();

      return (json.result as string[]) || [];
    },
    { enabled: !!instance && !!token },
  );
}

// POST REQUESTS
export type SetWalletConfigInput =
  | {
      type: "local";
    }
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
  const { token } = useApiAuthToken();
  const queryClient = useQueryClient();

  return useMutationWithInvalidate(
    async (input: SetWalletConfigInput) => {
      invariant(instance, "instance is required");

      const res = await fetch(`${instance}configuration/wallets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(input),
      });
      const json = await res.json();

      if (json.error) {
        throw new Error(json.message);
      }

      return json.result;
    },
    {
      onSuccess: () => {
        return queryClient.invalidateQueries(engineKeys.walletConfig(instance));
      },
    },
  );
}

export function useEngineCreateBackendWallet(instance: string) {
  const { token } = useApiAuthToken();
  const queryClient = useQueryClient();

  return useMutationWithInvalidate(
    async () => {
      invariant(instance, "instance is required");

      const res = await fetch(`${instance}backend-wallet/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      });
      const json = await res.json();

      if (json.error) {
        throw new Error(json.message);
      }

      return json.result;
    },
    {
      onSuccess: () => {
        return queryClient.invalidateQueries(
          engineKeys.backendWallets(instance),
        );
      },
    },
  );
}

interface UpdateBackendWalletInput {
  walletAddress: string;
  label?: string;
}

export function useEngineUpdateBackendWallet(instance: string) {
  const { token } = useApiAuthToken();
  const queryClient = useQueryClient();

  return useMutationWithInvalidate(
    async (input: UpdateBackendWalletInput) => {
      invariant(instance, "instance is required");

      const res = await fetch(`${instance}backend-wallet/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(input),
      });
      const json = await res.json();

      if (json.error) {
        throw new Error(json.message);
      }

      return json.result;
    },
    {
      onSuccess: () => {
        return queryClient.invalidateQueries(
          engineKeys.backendWallets(instance),
        );
      },
    },
  );
}

export type ImportBackendWalletInput =
  | {
      awsKmsKeyId: string;
      awsKmsArn: string;
    }
  | {
      gcpKmsKeyId: string;
      gcpKmsKeyVersionId: string;
    }
  | {
      privateKey?: string;
    }
  | {
      mnemonic?: string;
    }
  | {
      encryptedJson?: string;
      password?: string;
    };

export function useEngineImportBackendWallet(instance: string) {
  const { token } = useApiAuthToken();
  const queryClient = useQueryClient();

  return useMutationWithInvalidate(
    async (input: ImportBackendWalletInput) => {
      invariant(instance, "instance is required");

      const res = await fetch(`${instance}backend-wallet/import`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(input),
      });
      const json = await res.json();

      if (json.error) {
        throw new Error(json.message);
      }

      return json.result;
    },
    {
      onSuccess: () => {
        return queryClient.invalidateQueries(
          engineKeys.backendWallets(instance),
        );
      },
    },
  );
}

export function useEngineGrantPermissions(instance: string) {
  const { token } = useApiAuthToken();
  const queryClient = useQueryClient();

  return useMutationWithInvalidate(
    async (input: EngineAdmin) => {
      invariant(instance, "instance is required");

      const res = await fetch(`${instance}auth/permissions/grant`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(input),
      });
      const json = await res.json();

      if (json.error) {
        throw new Error(json.message);
      }

      return json.result;
    },
    {
      onSuccess: () => {
        return queryClient.invalidateQueries(engineKeys.permissions(instance));
      },
    },
  );
}

type RevokePermissionsInput = {
  walletAddress: string;
};

export function useEngineRevokePermissions(instance: string) {
  const { token } = useApiAuthToken();
  const queryClient = useQueryClient();

  return useMutationWithInvalidate(
    async (input: RevokePermissionsInput) => {
      invariant(instance, "instance is required");

      const res = await fetch(`${instance}auth/permissions/revoke`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(input),
      });
      const json = await res.json();

      if (json.error) {
        throw new Error(json.message);
      }

      return json.result;
    },
    {
      onSuccess: () => {
        return queryClient.invalidateQueries(engineKeys.permissions(instance));
      },
    },
  );
}

export type CreateAccessTokenResponse = AccessToken & {
  accessToken: string;
};

export function useEngineCreateAccessToken(instance: string) {
  const { token } = useApiAuthToken();
  const queryClient = useQueryClient();

  return useMutationWithInvalidate(
    async () => {
      invariant(instance, "instance is required");

      const res = await fetch(`${instance}auth/access-tokens/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      });
      const json = await res.json();

      if (json.error) {
        throw new Error(json.message);
      }

      return json.result as CreateAccessTokenResponse;
    },
    {
      onSuccess: () => {
        return queryClient.invalidateQueries(engineKeys.accessTokens(instance));
      },
    },
  );
}

type RevokeAccessTokenInput = {
  id: string;
};

export function useEngineRevokeAccessToken(instance: string) {
  const { token } = useApiAuthToken();
  const queryClient = useQueryClient();

  return useMutationWithInvalidate(
    async (input: RevokeAccessTokenInput) => {
      invariant(instance, "instance is required");

      const res = await fetch(`${instance}auth/access-tokens/revoke`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(input),
      });
      const json = await res.json();

      if (json.error) {
        throw new Error(json.message);
      }

      return json.result;
    },
    {
      onSuccess: () => {
        return queryClient.invalidateQueries(engineKeys.accessTokens(instance));
      },
    },
  );
}

type UpdateAccessTokenInput = {
  id: string;
  label?: string;
};

export function useEngineUpdateAccessToken(instance: string) {
  const { token } = useApiAuthToken();
  const queryClient = useQueryClient();

  return useMutationWithInvalidate(
    async (input: UpdateAccessTokenInput) => {
      invariant(instance, "instance is required");

      const res = await fetch(`${instance}auth/access-tokens/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(input),
      });
      const json = await res.json();

      if (json.error) {
        throw new Error(json.message);
      }

      return json.result;
    },
    {
      onSuccess: () => {
        return queryClient.invalidateQueries(engineKeys.accessTokens(instance));
      },
    },
  );
}

export type CreateWebhookInput = {
  url: string;
  name: string;
  eventType: string;
};

export function useEngineCreateWebhook(instance: string) {
  const { token } = useApiAuthToken();
  const queryClient = useQueryClient();

  return useMutationWithInvalidate(
    async (input: CreateWebhookInput) => {
      invariant(instance, "instance is required");

      const res = await fetch(`${instance}webhooks/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(input),
      });
      const json = await res.json();

      if (json.error) {
        throw new Error(json.message);
      }

      return json.result;
    },
    {
      onSuccess: () => {
        return queryClient.invalidateQueries(engineKeys.webhooks(instance));
      },
    },
  );
}

type RevokeWebhookInput = {
  id: number;
};

export function useEngineRevokeWebhook(instance: string) {
  const { token } = useApiAuthToken();
  const queryClient = useQueryClient();

  return useMutationWithInvalidate(
    async (input: RevokeWebhookInput) => {
      invariant(instance, "instance is required");

      const res = await fetch(`${instance}webhooks/revoke`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(input),
      });
      const json = await res.json();

      if (json.error) {
        throw new Error(json.message);
      }

      return json.result;
    },
    {
      onSuccess: () => {
        return queryClient.invalidateQueries(engineKeys.webhooks(instance));
      },
    },
  );
}

type SendTokensInput = {
  chainId: number;
  fromAddress: string;
  toAddress: string;
  amount: number;
  currencyAddress?: string;
};

export function useEngineSendTokens(instance: string) {
  const { token } = useApiAuthToken();

  return useMutation(async (input: SendTokensInput) => {
    invariant(instance, "instance is required");

    const res = await fetch(
      `${instance}backend-wallet/${input.chainId}/transfer`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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
      throw new Error(json.message);
    }

    return json.result;
  });
}
