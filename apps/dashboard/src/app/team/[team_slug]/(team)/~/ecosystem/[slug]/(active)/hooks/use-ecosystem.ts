import { apiServerProxy } from "@/actions/proxies";
import { useQuery } from "@tanstack/react-query";
import type { Ecosystem } from "../../../types";

export function useEcosystem({
  teamIdOrSlug,
  slug,
  refetchInterval,
  refetchOnWindowFocus,
  initialData,
}: {
  teamIdOrSlug: string;
  slug: string;
  refetchInterval?: number;
  refetchOnWindowFocus?: boolean;
  initialData?: Ecosystem;
}) {
  return useQuery({
    queryKey: ["ecosystems", teamIdOrSlug, slug],
    queryFn: async () => {
      const res = await apiServerProxy({
        pathname: `/v1/teams/${teamIdOrSlug}/ecosystem-wallet/${slug}`,
        method: "GET",
      });

      if (!res.ok) {
        throw new Error(res.error);
      }

      const data = res.data as { result: Ecosystem };
      return data.result;
    },
    retry: false,
    refetchInterval,
    refetchOnWindowFocus,
    initialData,
  });
}
