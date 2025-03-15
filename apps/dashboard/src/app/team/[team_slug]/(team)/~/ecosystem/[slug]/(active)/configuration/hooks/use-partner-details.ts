import { useQuery } from "@tanstack/react-query";
import type { Ecosystem, Partner } from "../../../../types";

export function usePartnerDetails({
  ecosystem,
  partnerId,
  authToken,
}: {
  ecosystem: Ecosystem;
  partnerId: string;
  authToken: string;
}) {
  return useQuery({
    queryKey: ["ecosystem", ecosystem.id, "partner", partnerId],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_DOMAIN}/v1/ecosystem/${ecosystem.id}/partner/${partnerId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(
          data?.message ??
            data?.error?.message ??
            "Failed to fetch partner details",
        );
      }

      return (await response.json()) as Partner;
    },
    retry: false,
    enabled: !!ecosystem && !!ecosystem.id && !!partnerId && !!authToken,
  });
}
