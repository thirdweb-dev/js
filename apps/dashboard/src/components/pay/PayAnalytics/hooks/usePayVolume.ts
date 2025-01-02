import { useQuery } from "@tanstack/react-query";
import { useActiveAccount } from "thirdweb/react";

type AggregatedData = {
  succeeded: {
    amountUSDCents: number;
    count: number;
    bpsIncreaseFromPriorRange: number;
  };
  failed: {
    amountUSDCents: number;
    count: number;
  };
};

type IntervalResultNode = {
  failed: {
    amountUSDCents: number;
    count: number;
  };
  succeeded: {
    amountUSDCents: number;
    count: number;
  };
};

export type PayVolumeData = {
  intervalType: "day" | "week";
  intervalResults: Array<{
    interval: string;
    buyWithCrypto: IntervalResultNode;
    buyWithFiat: IntervalResultNode;
    sum: IntervalResultNode;
    payouts: {
      amountUSDCents: number;
      count: number;
    };
  }>;
  aggregate: {
    buyWithCrypto: AggregatedData;
    buyWithFiat: AggregatedData;
    sum: AggregatedData;
    payouts: {
      amountUSDCents: number;
      count: number;
      bpsIncreaseFromPriorRange: number;
    };
  };
};

type Response = {
  result: {
    data: PayVolumeData;
  };
};

export function usePayVolume(options: {
  clientId: string;
  from: Date;
  to: Date;
  intervalType: "day" | "week";
}) {
  const address = useActiveAccount()?.address;
  return useQuery({
    queryKey: ["usePayVolume", address, options],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      searchParams.append("intervalType", options.intervalType);
      searchParams.append("clientId", options.clientId);
      searchParams.append("fromDate", `${options.from.getTime()}`);
      searchParams.append("toDate", `${options.to.getTime()}`);

      const res = await fetch(
        `/api/server-proxy/pay/stats/aggregate/volume/v1?${searchParams.toString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!res.ok) {
        throw new Error("Failed to fetch pay volume");
      }

      const resJSON = (await res.json()) as Response;

      return resJSON.result.data;
    },
    retry: false,
  });
}
