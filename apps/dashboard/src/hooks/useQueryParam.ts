import { useRouter } from "next/router";
import { getSingleQueryValue } from "utils/router";

export function useSingleQueryParam<T extends string>(
  key: string,
): T | undefined {
  const { query } = useRouter();

  return getSingleQueryValue(query, key) as T;
}
