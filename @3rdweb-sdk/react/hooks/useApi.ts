import { apiKeys } from "../cache-keys";
import { useMutationWithInvalidate } from "./query/useQueryWithNetwork";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useUser } from "@thirdweb-dev/react";
import invariant from "tiny-invariant";
import {THIRDWEB_API_HOST} from "../../../constants/urls";

export type ApiKeyInfo = {
  creatorWalletAddress: string;
  key: string;
  revoked: boolean;
};

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
      const data = await res.json();
      if (data.error) {
        throw new Error(data.error?.message || data.error);
      }

      const keys = (data.keys as ApiKeyInfo[]).filter((item) => !item.revoked);
      return keys;
    },
    { enabled: !!user?.address },
  );
}

export function useCreateApiKey() {
  const { user } = useUser();
  const queryClient = useQueryClient();

  return useMutation(
    async () => {
      invariant(user, "No user is logged in");

      const res = await fetch(`${THIRDWEB_API_HOST}/v1/keys`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });
      const data = await res.json();

      if (data.error) {
        throw new Error(data.error?.message || data.error);
      }

      return data;
    },
    {
      onSuccess: (_data, _variables, _options) => {
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
    async (key: string) => {
      invariant(user, "No user is logged in");

      const res = await fetch(
        `${THIRDWEB_API_HOST}/v1/keys/revoke`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            key,
          }),
        },
      );
      const data = await res.json();

      if (data.error) {
        throw new Error(data.error?.message || data.error);
      }

      return data;
    },
    {
      onSuccess: (_data, _variables, _options) => {
        return queryClient.invalidateQueries(
          apiKeys.keys(user?.address as string),
        );
      },
    },
  );
}
