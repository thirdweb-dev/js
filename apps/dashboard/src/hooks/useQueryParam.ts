import { useSearchParams } from "next/navigation";
import {} from "next/router";

/**
 * @deprecated use `useSearchParams` from `next/navigation` instead
 */
export function useSingleQueryParam<T extends string>(
  key: string,
): T | undefined {
  const searchParams = useSearchParams();

  return searchParams?.get(key) as T | undefined;
}
