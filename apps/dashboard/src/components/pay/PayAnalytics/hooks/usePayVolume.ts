import { useQuery } from "@tanstack/react-query";
import { useLoggedInUser } from "../../../../@3rdweb-sdk/react/hooks/useLoggedInUser";
import { THIRDWEB_PAY_DOMAIN } from "../../../../constants/urls";

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
  const { user, isLoggedIn } = useLoggedInUser();

  return useQuery(
    ["usePayVolume", user?.address, options],
    async () => {
      const endpoint = new URL(
        `https://${THIRDWEB_PAY_DOMAIN}/stats/aggregate/volume/v1`,
      );
      endpoint.searchParams.append("intervalType", options.intervalType);
      endpoint.searchParams.append("clientId", options.clientId);
      endpoint.searchParams.append("fromDate", `${options.from.getTime()}`);
      endpoint.searchParams.append("toDate", `${options.to.getTime()}`);

      const res = await fetch(endpoint.toString(), {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch pay volume");
      }

      const resJSON = (await res.json()) as Response;

      return resJSON.result.data;
    },
    { enabled: isLoggedIn, retry: false },
  );
}
