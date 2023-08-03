import { THIRDWEB_API_HOST } from "../../../constants/urls";
import { apiKeys } from "../cache-keys";
import { useMutationWithInvalidate } from "./query/useQueryWithNetwork";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useUser } from "@thirdweb-dev/react";
import invariant from "tiny-invariant";

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

export function useApiKeys() {
  const { user } = useUser();

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
        throw new Error(json.error?.message || json.error);
      }

      return json.data as ApiKey[];
    },
    { enabled: !!user?.address },
  );
}

export function useCreateApiKey() {
  const { user } = useUser();
  const queryClient = useQueryClient();

  return useMutation(
    async (input: CreateKeyInput) => {
      invariant(user, "No user is logged in");

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
        throw new Error(json.error?.message || json.error);
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
  const { user } = useUser();
  const queryClient = useQueryClient();

  return useMutationWithInvalidate(
    async (input: UpdateKeyInput) => {
      invariant(user, "No user is logged in");

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
        throw new Error(json.error?.message || json.error);
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
  const { user } = useUser();
  const queryClient = useQueryClient();

  return useMutationWithInvalidate(
    async (id: string) => {
      invariant(user, "No user is logged in");

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
        throw new Error(json.error?.message || json.error);
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
  const { user } = useUser();
  const queryClient = useQueryClient();

  return useMutationWithInvalidate(
    async (id: string) => {
      invariant(user, "No user is logged in");

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
        throw new Error(json.error?.message || json.error);
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
    throw new Error(json.error?.message || json.error);
  }

  return !!json.data.available;
}

export async function fetchAuthToken() {
  const res = await fetch(`${THIRDWEB_API_HOST}/v1/auth/token`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const json = await res.json();

  if (json.error) {
    throw new Error(json.error?.message || json.error);
  }

  return json.data.jwt;
}
