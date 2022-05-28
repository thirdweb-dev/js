import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { isBrowser } from "utils/isBrowser";

export function useLocalStorage<TType>(key = "", initialValue: TType) {
  const queryClient = useQueryClient();
  const queryKey = useMemo(() => ["local-storage", key], [key]);

  const { mutate } = useMutation(
    async (value: TType) => {
      if (key) {
        return localStorage.setItem(key, JSON.stringify(value));
      }
    },
    {
      onSuccess: () => queryClient.invalidateQueries(queryKey),
    },
  );

  const query = useQuery<TType>(
    queryKey,
    () => {
      const value = window.localStorage.getItem(key);
      if (value) {
        return JSON.parse(value);
      }
      return initialValue;
    },
    {
      enabled: isBrowser() && !!key,
    },
  );

  return [query, mutate] as const;
}
