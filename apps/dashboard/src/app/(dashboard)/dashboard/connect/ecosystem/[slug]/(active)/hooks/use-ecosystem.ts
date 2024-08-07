import { useLoggedInUser } from "@3rdweb-sdk/react/hooks/useLoggedInUser";
import { useQuery } from "@tanstack/react-query";
import { THIRDWEB_API_HOST } from "constants/urls";
import { FetchError } from "utils/error";
import type { Ecosystem } from "../../../types";

export function useEcosystem({
  slug,
  refetchInterval,
  refetchOnWindowFocus,
  initialData,
}: {
  slug: string;
  refetchInterval?: number;
  refetchOnWindowFocus?: boolean;
  initialData?: Ecosystem;
}) {
  const { isLoggedIn } = useLoggedInUser();

  const ecosystemQuery = useQuery({
    queryKey: ["ecosystems", slug],
    queryFn: async () => {
      const res = await fetch(
        `${THIRDWEB_API_HOST}/v1/ecosystem-wallet/${slug}`,
      );

      if (!res.ok) {
        const data = await res.json();
        console.error(data);
        throw new FetchError(
          res,
          data?.message ?? data?.error?.message ?? "Failed to fetch ecosystems",
        );
      }

      const data = (await res.json()) as { result: Ecosystem };
      return data.result;
    },
    enabled: isLoggedIn,
    retry: false,
    refetchInterval,
    refetchOnWindowFocus,
    initialData,
  });

  return {
    ...ecosystemQuery,
    error: ecosystemQuery.error as FetchError | undefined,
    ecosystem: ecosystemQuery.data,
  };
}
