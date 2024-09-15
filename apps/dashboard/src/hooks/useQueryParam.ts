import { useSearchParams } from "next/navigation";

/**
 * @deprecated use `useSearchParams` from `next/navigation` instead
 */
export function useSingleQueryParam<T extends string>(
  key: string,
): T | undefined {
  const searchParams = useSearchParams();

  return searchParams?.get(key) as T | undefined;
}
