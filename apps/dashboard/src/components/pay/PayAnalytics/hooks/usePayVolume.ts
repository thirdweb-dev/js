import { payServerProxy } from "@/actions/proxies";
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
      const res = await payServerProxy({
        pathname: "/stats/aggregate/volume/v1",
        searchParams: {
          intervalType: options.intervalType,
          clientId: options.clientId,
          fromDate: `${options.from.getTime()}`,
          toDate: `${options.to.getTime()}`,
        },
        headers: {
          "Content-Type": "application/json",
        },
        method: "GET",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch pay volume");
      }

      const json = res.data as Response;

      return json.result.data;
    },
    retry: false,
  });
}
